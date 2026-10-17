import type { Collectible, GameState, InputState, InteractiveObject, Room } from '../../types/game';
import { resolveCollision, distance } from '../utils/collision';
import { ROOMS } from '../../data/rooms';
import { MISSIONS } from '../../data/missions';
import { BotSystem } from '../entities/Bot';
import { soundFX } from '../utils/sound';

export class GameEngine {
  private gameState: GameState;
  private rooms: Room[];
  private onStateChange: (state: GameState) => void;
  private attackCooldown: number = 0;
  private footstepTimer: number = 0;
  private collectedItems: Set<string> = new Set();

  constructor(onStateChange: (state: GameState) => void) {
    this.onStateChange = onStateChange;
    this.rooms = ROOMS;

    const startRoom = this.rooms[0];
    this.gameState = {
      player: {
        position: { x: 600, y: 400 },
        velocity: { x: 0, y: 0 },
        size: { x: 32, y: 32 },
        speed: 210,
        direction: 'down',
        isMoving: false,
        isAttacking: false,
        attackTimer: 0,
        isHurt: false,
        hurtTimer: 0,
        health: 100,
        maxHealth: 100,
        shield: 100,
        maxShield: 100,
        level: 1,
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
      projectiles: [],
      floatingTexts: [],
      bots: [],
      collectibles: [],
      recentLore: null,
      isMuted: false,
    };

    this.loadProgress();
    this.loadRoomEntities(startRoom.id);
  }

  private loadProgress() {
    try {
      const saved = localStorage.getItem('cyberops-progress-v2');
      if (saved) {
        const data = JSON.parse(saved);
        this.gameState.completedMissions = data.completedMissions || [];
        this.gameState.totalXP = data.totalXP || 0;
        this.gameState.discoveredLocations = data.discoveredLocations || [this.rooms[0].id];
        if (data.collectedItems) {
          this.collectedItems = new Set(data.collectedItems);
        }

        this.updatePlayerLevel();

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
      localStorage.setItem('cyberops-progress-v2', JSON.stringify({
        completedMissions: this.gameState.completedMissions,
        totalXP: this.gameState.totalXP,
        discoveredLocations: this.gameState.discoveredLocations,
        collectedItems: Array.from(this.collectedItems),
      }));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  private loadRoomEntities(roomId: string) {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    // Load bots cloned
    this.gameState.bots = (room.bots || []).map(b => ({
      ...b,
      position: { ...b.position },
      velocity: { ...b.velocity },
      health: b.maxHealth,
      state: 'patrol',
      patrolPoints: b.patrolPoints.map(p => ({ ...p })),
    }));

    // Load uncollected collectibles
    this.gameState.collectibles = (room.collectibles || [])
      .filter(c => !this.collectedItems.has(c.id))
      .map(c => ({
        ...c,
        position: { ...c.position },
      }));

    this.gameState.projectiles = [];
  }

  update(deltaTime: number, input: InputState) {
    if (this.gameState.isPaused || this.gameState.activePanel) {
      return;
    }

    this.updatePlayer(deltaTime, input);
    this.updateCombat(deltaTime, input);
    this.updateEntities(deltaTime);
    this.updateCollectibles(deltaTime);
    this.updateCamera();
    this.checkInteractions(input);

    this.onStateChange(this.gameState);
  }

  private updatePlayer(deltaTime: number, input: InputState) {
    const player = this.gameState.player;
    const dt = deltaTime / 1000;

    let vx = 0;
    let vy = 0;

    if (input.up) vy -= 1;
    if (input.down) vy += 1;
    if (input.left) vx -= 1;
    if (input.right) vx += 1;

    if (input.mobile?.joystick) {
      vx = input.mobile.joystick.x;
      vy = input.mobile.joystick.y;
    }

    const magnitude = Math.sqrt(vx * vx + vy * vy);
    if (magnitude > 0) {
      vx = (vx / magnitude) * player.speed;
      vy = (vy / magnitude) * player.speed;
      player.isMoving = true;

      if (Math.abs(vx) > Math.abs(vy)) {
        player.direction = vx > 0 ? 'right' : 'left';
      } else {
        player.direction = vy > 0 ? 'down' : 'up';
      }

      // Footstep sound
      this.footstepTimer += deltaTime;
      if (this.footstepTimer > 350) {
        soundFX.playFootstep();
        this.footstepTimer = 0;
      }
    } else {
      player.isMoving = false;
      this.footstepTimer = 0;
    }

    player.velocity = { x: vx, y: vy };

    let newPos = {
      x: player.position.x + vx * dt,
      y: player.position.y + vy * dt,
    };

    const currentRoom = this.getCurrentRoom();
    if (currentRoom) {
      for (const box of currentRoom.collisionBoxes) {
        newPos = resolveCollision(newPos, player.size, box, player.velocity);
      }
    }

    player.position = newPos;

    // Player attack timer
    if (player.isAttacking) {
      player.attackTimer -= deltaTime;
      if (player.attackTimer <= 0) {
        player.isAttacking = false;
      }
    }

    // Player hurt timer
    if (player.isHurt) {
      player.hurtTimer -= deltaTime;
      if (player.hurtTimer <= 0) {
        player.isHurt = false;
      }
    }

    // Shield passive regeneration (after 3 seconds of not taking damage)
    if (!player.isHurt && player.shield < player.maxShield) {
      player.shield = Math.min(player.maxShield, player.shield + dt * 12);
    }

    // Animation frame
    if (player.isMoving) {
      player.animationTimer += deltaTime;
      if (player.animationTimer > 130) {
        player.animationFrame = (player.animationFrame + 1) % 6;
        player.animationTimer = 0;
      }
    } else {
      player.animationTimer += deltaTime;
      if (player.animationTimer > 250) {
        player.animationFrame = (player.animationFrame + 1) % 4;
        player.animationTimer = 0;
      }
    }
  }

  private updateCombat(deltaTime: number, input: InputState) {
    const player = this.gameState.player;

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    const wantsAttack = input.attack || input.mobile?.attackPressed;

    if (wantsAttack && this.attackCooldown <= 0) {
      player.isAttacking = true;
      player.attackTimer = 220;
      this.attackCooldown = 320; // attack delay

      // Fire EMP Pulse / Hack Beam projectile
      const speed = 400;
      let vx = 0;
      let vy = 0;

      if (player.direction === 'down') vy = speed;
      else if (player.direction === 'up') vy = -speed;
      else if (player.direction === 'right') vx = speed;
      else if (player.direction === 'left') vx = -speed;

      this.gameState.projectiles.push({
        id: `p-${Date.now()}-${Math.random()}`,
        position: {
          x: player.position.x + player.size.x / 2,
          y: player.position.y + player.size.y / 2,
        },
        velocity: { x: vx, y: vy },
        radius: 6,
        damage: 25,
        life: 0.7,
        maxLife: 0.7,
        isPlayer: true,
      });

      soundFX.playEMPBlast();
    }
  }

  private updateEntities(deltaTime: number) {
    const dt = deltaTime / 1000;

    // Update projectiles
    for (let i = this.gameState.projectiles.length - 1; i >= 0; i--) {
      const p = this.gameState.projectiles[i];
      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.life -= dt;

      if (p.life <= 0) {
        this.gameState.projectiles.splice(i, 1);
      }
    }

    // Update bots
    BotSystem.updateBots(
      this.gameState.bots,
      this.gameState.player,
      this.gameState.projectiles,
      deltaTime,
      (defeatedBot) => {
        this.addXP(60);
        this.addFloatingText('+60 XP (Malware Neutralized)', defeatedBot.position, '#00ff88');

        // Drop an encrypted USB key
        const drop: Collectible = {
          id: `drop-${Date.now()}`,
          title: `Dump: ${defeatedBot.name}`,
          lore: `Extracted memory payload from neutralized threat ${defeatedBot.name}. Contains forensic telemetry!`,
          type: 'usb',
          position: { ...defeatedBot.position },
          xpReward: 40,
          collected: false,
          bobTimer: 0,
          roomId: this.gameState.currentRoom,
        };
        this.gameState.collectibles.push(drop);
      }
    );

    // Clean up expired dead bots
    this.gameState.bots = this.gameState.bots.filter(b => !(b.state === 'dead' && (b.deathTimer || 0) <= 0));

    // Update floating texts
    for (let i = this.gameState.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.gameState.floatingTexts[i];
      ft.position.y -= dt * 35;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.gameState.floatingTexts.splice(i, 1);
      }
    }
  }

  private updateCollectibles(deltaTime: number) {
    const player = this.gameState.player;

    for (let i = this.gameState.collectibles.length - 1; i >= 0; i--) {
      const c = this.gameState.collectibles[i];
      c.bobTimer += deltaTime / 1000;

      const dist = distance(
        { x: player.position.x + player.size.x / 2, y: player.position.y + player.size.y / 2 },
        c.position
      );

      if (dist < 32 && !c.collected) {
        c.collected = true;
        this.collectedItems.add(c.id);
        this.addXP(c.xpReward);
        this.addFloatingText(`+${c.xpReward} XP: ${c.title}`, c.position, '#00ffff');
        soundFX.playItemPickup();
        this.gameState.recentLore = {
          title: c.title,
          text: c.lore,
        };
        this.gameState.collectibles.splice(i, 1);
        this.saveProgress();
      }
    }
  }

  private updateCamera() {
    const player = this.gameState.player;
    const canvasWidth = 1200;
    const canvasHeight = 700;

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
    // Chest interaction
    if (obj.type === 'chest') {
      if (obj.state !== 'open') {
        obj.state = 'open';
        soundFX.playChestOpen();
        this.addXP(80);
        this.addFloatingText('+80 XP (Cache Unlocked)', obj.position, '#00ffaa');
        this.gameState.recentLore = {
          title: obj.title,
          text: obj.chestLoot || obj.description || 'Confidential Cyber Ops Data',
        };
        this.saveProgress();
      }
      return;
    }

    // Door interaction
    if (obj.type === 'door' && obj.roomId) {
      soundFX.playDoor();
      this.changeRoom(obj.roomId);
      return;
    }

    // Station or terminal interaction
    soundFX.playInteract();
    this.gameState.activePanel = obj.id;
    this.onStateChange(this.gameState);
  }

  changeRoom(roomId: string) {
    const newRoom = this.rooms.find(r => r.id === roomId);
    if (!newRoom) return;

    this.gameState.currentRoom = roomId;

    if (!this.gameState.discoveredLocations.includes(roomId)) {
      this.gameState.discoveredLocations.push(roomId);
      this.addXP(50);
      this.addFloatingText('+50 XP Area Discovered', { x: 600, y: 350 }, '#00ffff');
    }

    const entryPoints: { [key: string]: { x: number; y: number } } = {
      'soc-room': { x: 600, y: 680 },
      'redteam-lab': { x: 500, y: 80 },
      'research-room': { x: 80, y: 320 },
      'mission-control': { x: 550, y: 600 },
      'recruitment-office': { x: 80, y: 300 },
    };

    this.gameState.player.position = entryPoints[roomId] || { x: 400, y: 400 };
    this.loadRoomEntities(roomId);
    this.saveProgress();
  }

  addXP(amount: number) {
    this.gameState.totalXP += amount;
    this.updatePlayerLevel();
    this.saveProgress();
  }

  private updatePlayerLevel() {
    const oldLevel = this.gameState.player.level;
    const xp = this.gameState.totalXP;
    let newLevel = 1;

    if (xp >= 1000) newLevel = 5;
    else if (xp >= 650) newLevel = 4;
    else if (xp >= 350) newLevel = 3;
    else if (xp >= 150) newLevel = 2;

    this.gameState.player.level = newLevel;

    if (newLevel > oldLevel) {
      soundFX.playLevelUp();
      this.addFloatingText(`LEVEL UP! RANK ${newLevel}`, this.gameState.player.position, '#ffff00');
    }
  }

  completeMission(missionId: string) {
    const mission = this.gameState.missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    mission.completed = true;
    this.gameState.completedMissions.push(missionId);
    this.addXP(mission.xpReward);
    soundFX.playHackSuccess();
    this.addFloatingText(`MISSION COMPLETE! +${mission.xpReward} XP`, this.gameState.player.position, '#00ff88');

    this.saveProgress();
    this.onStateChange(this.gameState);
  }

  addFloatingText(text: string, position: { x: number; y: number }, color: string = '#00ffff') {
    this.gameState.floatingTexts.push({
      id: `ft-${Date.now()}-${Math.random()}`,
      text,
      position: { x: position.x, y: position.y - 15 },
      color,
      life: 1.8,
      maxLife: 1.8,
    });
  }

  dismissLore() {
    this.gameState.recentLore = null;
    this.onStateChange(this.gameState);
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
    localStorage.removeItem('cyberops-progress-v2');
    this.collectedItems.clear();
    this.gameState.completedMissions = [];
    this.gameState.totalXP = 0;
    this.gameState.player.health = 100;
    this.gameState.player.shield = 100;
    this.gameState.player.level = 1;
    this.gameState.missions = this.gameState.missions.map(m => ({ ...m, completed: false }));
    this.gameState.discoveredLocations = [this.rooms[0].id];
    this.loadRoomEntities(this.rooms[0].id);
    this.onStateChange(this.gameState);
  }
}
