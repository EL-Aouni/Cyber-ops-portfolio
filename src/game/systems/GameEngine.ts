import type { GameState, InputState, InteractiveObject, Room } from '../../types/game';
import { resolveCollision, distance } from '../utils/collision';
import { ROOMS } from '../../data/rooms';
import { MISSIONS } from '../../data/missions';

export class GameEngine {
  private gameState: GameState;
  private rooms: Room[];
  private onStateChange: (state: GameState) => void;

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.rooms = ROOMS;

    // Initialize game state
    const startRoom = this.rooms[0];
    this.gameState = {
      player: {
        position: { x: 600, y: 400 },
        velocity: { x: 0, y: 0 },
        size: { x: 32, y: 32 },
        speed: 200,
        direction: 'down',
        isMoving: false,
        animationFrame: 0,
        animationTimer: 0,
      },
      currentRoom: startRoom.id,
      missions: [...MISSIONS],
      completedMissions: [],
      totalXP: 0,
      discoveredLocations: [startRoom.id],
      isPaused: false,
      isMenuOpen: false,
      activePanel: null,
      cameraOffset: { x: 0, y: 0 },
    };

    this.loadProgress();
  }

  private loadProgress() {
    try {
      const saved = localStorage.getItem('cyberops-progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.gameState.completedMissions = data.completedMissions || [];
        this.gameState.totalXP = data.totalXP || 0;
        this.gameState.discoveredLocations = data.discoveredLocations || [this.rooms[0].id];

        // Update mission states
        this.gameState.missions = this.gameState.missions.map(mission => ({
          ...mission,
          completed: this.gameState.completedMissions.includes(mission.id),
        }));
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  }

  private saveProgress() {
    try {
      localStorage.setItem('cyberops-progress', JSON.stringify({
        completedMissions: this.gameState.completedMissions,
        totalXP: this.gameState.totalXP,
        discoveredLocations: this.gameState.discoveredLocations,
      }));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  update(deltaTime: number, input: InputState) {
    if (this.gameState.isPaused || this.gameState.activePanel) {
      return;
    }

    this.updatePlayer(deltaTime, input);
    this.updateCamera();
    this.checkInteractions(input);

    this.onStateChange(this.gameState);
  }

  private updatePlayer(deltaTime: number, input: InputState) {
    const player = this.gameState.player;
    const dt = deltaTime / 1000;

    // Calculate velocity from input
    let vx = 0;
    let vy = 0;

    if (input.up) vy -= 1;
    if (input.down) vy += 1;
    if (input.left) vx -= 1;
    if (input.right) vx += 1;

    // Mobile joystick input
    if (input.mobile?.joystick) {
      vx = input.mobile.joystick.x;
      vy = input.mobile.joystick.y;
    }

    // Normalize diagonal movement
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    if (magnitude > 0) {
      vx = (vx / magnitude) * player.speed;
      vy = (vy / magnitude) * player.speed;
      player.isMoving = true;

      // Update direction
      if (Math.abs(vx) > Math.abs(vy)) {
        player.direction = vx > 0 ? 'right' : 'left';
      } else {
        player.direction = vy > 0 ? 'down' : 'up';
      }
    } else {
      player.isMoving = false;
    }

    player.velocity = { x: vx, y: vy };

    // Calculate new position
    let newPos = {
      x: player.position.x + vx * dt,
      y: player.position.y + vy * dt,
    };

    // Check collisions with room boundaries and objects
    const currentRoom = this.getCurrentRoom();
    if (currentRoom) {
      for (const box of currentRoom.collisionBoxes) {
        newPos = resolveCollision(newPos, player.size, box, player.velocity);
      }
    }

    player.position = newPos;

    // Update animation
    if (player.isMoving) {
      player.animationTimer += deltaTime;
      if (player.animationTimer > 150) {
        player.animationFrame = (player.animationFrame + 1) % 4;
        player.animationTimer = 0;
      }
    } else {
      player.animationFrame = 0;
      player.animationTimer = 0;
    }
  }

  private updateCamera() {
    const player = this.gameState.player;
    const canvasWidth = 1200;
    const canvasHeight = 700;

    // Center camera on player
    this.gameState.cameraOffset = {
      x: canvasWidth / 2 - player.position.x,
      y: canvasHeight / 2 - player.position.y,
    };
  }

  private checkInteractions(input: InputState) {
    const interactPressed = input.interact || input.mobile?.interactPressed;

    if (!interactPressed) return;

    const player = this.gameState.player;
    const currentRoom = this.getCurrentRoom();

    if (!currentRoom) return;

    // Check for nearby interactive objects
    for (const obj of currentRoom.objects) {
      const dist = distance(
        { x: player.position.x + player.size.x / 2, y: player.position.y + player.size.y / 2 },
        { x: obj.position.x + obj.size.x / 2, y: obj.position.y + obj.size.y / 2 }
      );

      if (dist <= obj.interactionRadius && obj.isInteractable) {
        this.handleInteraction(obj);
        break;
      }
    }
  }

  private handleInteraction(obj: InteractiveObject) {
    // Handle room transitions (doors)
    if (obj.type === 'door' && obj.roomId) {
      this.changeRoom(obj.roomId);
      return;
    }

    // Handle mission-related interactions
    if (obj.missionId) {
      const mission = this.gameState.missions.find(m => m.id === obj.missionId);
      if (mission && !mission.completed) {
        this.completeMission(mission.id);
      }
    }

    // Open panel
    this.gameState.activePanel = obj.id;
    this.onStateChange(this.gameState);
  }

  private changeRoom(roomId: string) {
    const newRoom = this.rooms.find(r => r.id === roomId);
    if (!newRoom) return;

    this.gameState.currentRoom = roomId;

    // Add to discovered locations
    if (!this.gameState.discoveredLocations.includes(roomId)) {
      this.gameState.discoveredLocations.push(roomId);
    }

    // Teleport player to appropriate entry point
    const entryPoints: { [key: string]: { x: number; y: number } } = {
      'soc-room': { x: 600, y: 680 },
      'redteam-lab': { x: 500, y: 80 },
      'research-room': { x: 80, y: 320 },
      'mission-control': { x: 550, y: 600 },
      'recruitment-office': { x: 80, y: 300 },
    };

    this.gameState.player.position = entryPoints[roomId] || { x: 400, y: 400 };
    this.saveProgress();
  }

  private completeMission(missionId: string) {
    const mission = this.gameState.missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    mission.completed = true;
    this.gameState.completedMissions.push(missionId);
    this.gameState.totalXP += mission.xpReward;

    this.saveProgress();
  }

  getCurrentRoom(): Room | undefined {
    return this.rooms.find(r => r.id === this.gameState.currentRoom);
  }

  getState(): GameState {
    return this.gameState;
  }

  togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.onStateChange(this.gameState);
  }

  closePanel() {
    this.gameState.activePanel = null;
    this.onStateChange(this.gameState);
  }

  resetProgress() {
    localStorage.removeItem('cyberops-progress');
    this.gameState.completedMissions = [];
    this.gameState.totalXP = 0;
    this.gameState.missions = this.gameState.missions.map(m => ({ ...m, completed: false }));
    this.gameState.discoveredLocations = [this.rooms[0].id];
    this.onStateChange(this.gameState);
  }
}
