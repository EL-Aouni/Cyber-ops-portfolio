import type { GameState, Room, InteractiveObject } from '../../types/game';
import { SpriteLoader } from '../utils/SpriteLoader';
import { PlayerSprite, NPCSprite, TerminalSprite, DoorSprite } from '../utils/sprites';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export class EnhancedRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private particleSystem: Particle[] = [];
  private spriteLoader: SpriteLoader;
  private spritesLoaded: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering

    // Load sprites
    this.spriteLoader = new SpriteLoader();
    this.spriteLoader.waitForLoad().then(() => {
      this.spritesLoaded = true;
      console.log('All sprites loaded successfully');
    });
  }

  render(gameState: GameState, currentRoom: Room) {
    this.clear();

    const camera = gameState.cameraOffset;

    this.ctx.save();
    this.ctx.translate(camera.x, camera.y);

    // Enhanced room rendering with real tiles
    this.drawEnhancedRoom(currentRoom);

    // Particle effects
    this.updateAndDrawParticles();

    // Interactive objects
    for (const obj of currentRoom.objects) {
      this.drawEnhancedObject(obj, gameState.player.position);
    }

    // Player with sprite sheets
    this.drawEnhancedPlayer(gameState.player);

    this.ctx.restore();

    // UI overlay
    this.drawInteractionPrompt(gameState, currentRoom);

    // Loading indicator
    if (!this.spritesLoaded) {
      this.drawLoadingIndicator();
    }
  }

  private drawLoadingIndicator() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(this.canvas.width - 200, 10, 190, 30);
    this.ctx.fillStyle = '#00ffff';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('Loading sprites...', this.canvas.width - 190, 30);
  }

  private clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawEnhancedRoom(room: Room) {
    const tileSize = 32;
    const floorSprite = this.spriteLoader.getSprite('floor');

    for (let x = room.bounds.x; x < room.bounds.width; x += tileSize) {
      for (let y = room.bounds.y; y < room.bounds.height; y += tileSize) {
        if (floorSprite && this.spritesLoaded) {
          // Draw real floor tile
          this.ctx.drawImage(floorSprite, x, y, tileSize, tileSize);
        } else {
          // Fallback to procedural
          const tileX = Math.floor(x / tileSize);
          const tileY = Math.floor(y / tileSize);
          const isDark = (tileX + tileY) % 2 === 0;
          this.ctx.fillStyle = isDark ? '#0f1820' : '#141d28';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        }

        // Tech grid overlay
        this.ctx.strokeStyle = 'rgba(0, 150, 200, 0.08)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, tileSize, tileSize);

        // Corner dots
        if (Math.random() < 0.1) {
          this.ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
          this.ctx.fillRect(x + 2, y + 2, 2, 2);
        }
      }
    }

    // Ambient lighting gradient
    const gradient = this.ctx.createRadialGradient(
      room.bounds.width / 2, room.bounds.height / 2, 100,
      room.bounds.width / 2, room.bounds.height / 2, 600
    );
    gradient.addColorStop(0, 'rgba(0, 200, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(room.bounds.x, room.bounds.y, room.bounds.width, room.bounds.height);

    // Walls with depth
    if (room.walls) {
      for (const wall of room.walls) {
        const wallGradient = this.ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.height);
        wallGradient.addColorStop(0, '#1a2a3a');
        wallGradient.addColorStop(0.5, '#0f1f2f');
        wallGradient.addColorStop(1, '#0a1520');
        this.ctx.fillStyle = wallGradient;
        this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

        // Wall highlights
        this.ctx.fillStyle = 'rgba(100, 150, 200, 0.2)';
        this.ctx.fillRect(wall.x, wall.y, wall.width, 4);

        // Rivets
        for (let i = 0; i < wall.width; i += 40) {
          this.ctx.fillStyle = '#334455';
          this.ctx.fillRect(wall.x + i, wall.y + 10, 4, 4);
          this.ctx.fillRect(wall.x + i, wall.y + wall.height - 14, 4, 4);
        }
      }
    }
  }

  private drawEnhancedPlayer(player: any) {
    const spriteKey = player.isMoving
      ? (player.direction === 'down' ? 'player_walk_down' :
         player.direction === 'up' ? 'player_walk_up' : 'player_walk_side')
      : 'player_idle';

    const sprite = this.spriteLoader.getSprite(spriteKey);

    if (sprite && this.spritesLoaded) {
      // Real sprite sheet - 192x32 = 6 frames of 32x32 each
      const frameWidth = 32;
      const frameHeight = 32;
      const frameCount = 6;
      const frame = Math.floor(player.animationFrame) % frameCount;

      this.ctx.save();

      // Flip for left direction
      if (player.direction === 'left') {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          -(player.position.x + 48), player.position.y - 8, 48, 48
        );
      } else if (player.direction === 'right') {
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          player.position.x - 8, player.position.y - 8, 48, 48
        );
      } else {
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          player.position.x - 8, player.position.y - 8, 48, 48
        );
      }

      this.ctx.restore();
    } else {
      // Fallback to procedural
      PlayerSprite.draw(
        this.ctx,
        player.position.x,
        player.position.y,
        player.direction,
        Math.floor(player.animationFrame)
      );
    }
  }

  private drawEnhancedObject(obj: InteractiveObject, playerPos: { x: number; y: number }) {
    const dx = obj.position.x - playerPos.x;
    const dy = obj.position.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isNear = distance < 80;

    switch (obj.type) {
      case 'terminal':
        TerminalSprite.draw(
          this.ctx,
          obj.position.x,
          obj.position.y,
          obj.size.x,
          obj.size.y,
          isNear
        );
        break;

      case 'station':
        this.drawStation(obj, isNear);
        break;

      case 'door':
        DoorSprite.draw(
          this.ctx,
          obj.position.x,
          obj.position.y,
          obj.size.x,
          obj.size.y,
          isNear
        );
        break;

      case 'npc':
        const npcSprite = this.spriteLoader.getSprite('npc1_idle');
        if (npcSprite && this.spritesLoaded) {
          // Real NPC sprite - 128x32 = 4 frames of 32x32 each
          const frameWidth = 32;
          const frameHeight = 32;
          const frame = Math.floor(Date.now() / 500) % 4; // Slow idle animation

          this.ctx.drawImage(
            npcSprite,
            frame * frameWidth, 0, frameWidth, frameHeight,
            obj.position.x - 8, obj.position.y - 8, 48, 48
          );

          // Glow when active
          if (isNear) {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(obj.position.x - 8, obj.position.y - 8, 48, 48);
          }
        } else {
          NPCSprite.draw(this.ctx, obj.position.x, obj.position.y, isNear);
        }
        break;

      case 'desk':
        this.drawDesk(obj);
        break;
    }

    // Label when near
    if (isNear && obj.label) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(obj.position.x - 10, obj.position.y - 40, obj.label.length * 8 + 20, 24);
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(obj.position.x - 10, obj.position.y - 40, obj.label.length * 8 + 20, 24);
      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 12px monospace';
      this.ctx.fillText(obj.label, obj.position.x, obj.position.y - 22);
    }
  }

  private drawStation(obj: InteractiveObject, isNear: boolean) {
    const x = obj.position.x;
    const y = obj.position.y;
    const w = obj.size.x;
    const h = obj.size.y;

    // Platform
    this.ctx.fillStyle = '#1a2a3a';
    this.ctx.fillRect(x, y + h - 15, w, 15);
    this.ctx.fillStyle = '#2a3a4a';
    this.ctx.fillRect(x + 5, y + h - 15, w - 10, 3);

    // Holographic display (animated rotation)
    const time = Date.now() / 1000;
    const rotation = time * 0.5;

    this.ctx.save();
    this.ctx.translate(x + w / 2, y + h / 2);
    this.ctx.rotate(rotation);

    // Outer hexagon
    this.ctx.strokeStyle = isNear ? '#00ffff' : '#00aacc';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * 25;
      const py = Math.sin(angle) * 25;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    // Inner hexagon
    this.ctx.strokeStyle = isNear ? '#88ffff' : '#0088aa';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * 15;
      const py = Math.sin(angle) * 15;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.restore();

    // Control buttons
    this.ctx.fillStyle = '#ff3300';
    this.ctx.fillRect(x + 5, y + h - 8, 8, 4);
    this.ctx.fillStyle = isNear ? '#00ff00' : '#003300';
    this.ctx.fillRect(x + w - 13, y + h - 8, 8, 4);
  }

  private drawDesk(obj: InteractiveObject) {
    const x = obj.position.x;
    const y = obj.position.y;
    const w = obj.size.x;
    const h = obj.size.y;

    // Desk body
    const deskGrad = this.ctx.createLinearGradient(x, y, x, y + h);
    deskGrad.addColorStop(0, '#2a3a4a');
    deskGrad.addColorStop(1, '#1a2a3a');
    this.ctx.fillStyle = deskGrad;
    this.ctx.fillRect(x, y, w, h);

    // Top surface
    this.ctx.fillStyle = '#3a4a5a';
    this.ctx.fillRect(x, y, w, 8);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(x + 5, y + 2, w - 10, 2);

    // Control panel
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(x + 10, y + 15, w - 20, 20);

    // LEDs
    const leds = ['#00ff00', '#ff8800', '#00ffff'];
    leds.forEach((color, i) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x + 15 + i * 15, y + 20, 8, 8);
    });

    // Mini screen
    this.ctx.fillStyle = '#003322';
    this.ctx.fillRect(x + w - 35, y + 18, 25, 14);
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + w - 35, y + 18, 25, 14);

    // Scanning line
    const scanY = (Date.now() % 1000) / 1000 * 14;
    this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(x + w - 35, y + 18 + scanY);
    this.ctx.lineTo(x + w - 10, y + 18 + scanY);
    this.ctx.stroke();

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x + 2, y + h, w - 4, 4);
  }

  private updateAndDrawParticles() {
    const time = Date.now();

    // Spawn new particles occasionally
    if (Math.random() < 0.05) {
      this.particleSystem.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: time,
        maxLife: 3000 + Math.random() * 2000,
        size: 1 + Math.random() * 2,
      });
    }

    // Update and draw
    this.particleSystem = this.particleSystem.filter(p => {
      const age = time - p.life;
      if (age > p.maxLife) return false;

      p.x += p.vx;
      p.y += p.vy;

      const alpha = 1 - (age / p.maxLife);
      this.ctx.fillStyle = `rgba(0, 200, 255, ${alpha * 0.3})`;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);

      return true;
    });
  }

  private drawInteractionPrompt(gameState: GameState, room: Room) {
    const player = gameState.player;

    // Find nearest interactive object
    let nearest: InteractiveObject | null = null;
    let minDist = Infinity;

    for (const obj of room.objects) {
      const dx = obj.position.x - player.position.x;
      const dy = obj.position.y - player.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80 && dist < minDist) {
        nearest = obj;
        minDist = dist;
      }
    }

    if (nearest && !gameState.activePanel) {
      const promptX = this.canvas.width / 2 - 100;
      const promptY = this.canvas.height - 100;
      const time = Date.now() / 1000;
      const pulse = 0.7 + Math.sin(time * 3) * 0.3;

      this.ctx.save();
      this.ctx.globalAlpha = pulse;

      // Background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(promptX, promptY, 200, 50);

      // Border with corners
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(promptX, promptY, 200, 50);

      // Corner accents
      const cornerSize = 10;
      this.ctx.strokeStyle = '#88ffff';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(promptX, promptY, cornerSize, cornerSize);
      this.ctx.strokeRect(promptX + 200 - cornerSize, promptY, cornerSize, cornerSize);
      this.ctx.strokeRect(promptX, promptY + 50 - cornerSize, cornerSize, cornerSize);
      this.ctx.strokeRect(promptX + 200 - cornerSize, promptY + 50 - cornerSize, cornerSize, cornerSize);

      // Text
      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 16px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Press E to interact', promptX + 100, promptY + 30);

      this.ctx.restore();
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
