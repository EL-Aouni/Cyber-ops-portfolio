import type { GameState, Room, InteractiveObject } from '../../types/game';
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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
  }

  render(gameState: GameState, currentRoom: Room) {
    this.clear();

    const camera = gameState.cameraOffset;

    this.ctx.save();
    this.ctx.translate(camera.x, camera.y);

    // Enhanced room rendering
    this.drawEnhancedRoom(currentRoom);

    // Particle effects
    this.updateAndDrawParticles();

    // Interactive objects with pixel art style
    for (const obj of currentRoom.objects) {
      this.drawEnhancedObject(obj, gameState.player.position);
    }

    // Player with detailed pixel art
    this.drawEnhancedPlayer(gameState.player);

    this.ctx.restore();

    // UI overlay
    this.drawInteractionPrompt(gameState, currentRoom);
  }

  private clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawEnhancedRoom(room: Room) {
    // Floor with detailed tile pattern
    const tileSize = 32;

    for (let x = room.bounds.x; x < room.bounds.width; x += tileSize) {
      for (let y = room.bounds.y; y < room.bounds.height; y += tileSize) {
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);

        // Checkerboard with detail
        const isDark = (tileX + tileY) % 2 === 0;
        this.ctx.fillStyle = isDark ? '#0f1820' : '#141d28';
        this.ctx.fillRect(x, y, tileSize, tileSize);

        // Tech grid overlay
        this.ctx.strokeStyle = 'rgba(0, 150, 200, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, tileSize, tileSize);

        // Corner dots for tech feel
        if (tileX % 2 === 0 && tileY % 2 === 0) {
          this.ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
          this.ctx.fillRect(x + 1, y + 1, 2, 2);
        }
      }
    }

    // Ambient lighting effect
    const gradient = this.ctx.createRadialGradient(
      room.bounds.width / 2, room.bounds.height / 2, 0,
      room.bounds.width / 2, room.bounds.height / 2, 600
    );
    gradient.addColorStop(0, 'rgba(0, 100, 150, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(room.bounds.x, room.bounds.y, room.bounds.width, room.bounds.height);

    // Draw collision boxes with pixel art style
    for (const box of room.collisionBoxes) {
      const isWall = box.width >= 800 || box.height >= 600;

      if (isWall) {
        this.drawPixelWall(box.x, box.y, box.width, box.height);
      } else {
        this.drawPixelFurniture(box.x, box.y, box.width, box.height);
      }
    }

    // Add atmospheric particles
    if (Math.random() < 0.05) {
      this.addParticle(
        Math.random() * room.bounds.width,
        Math.random() * room.bounds.height
      );
    }
  }

  private drawPixelWall(x: number, y: number, w: number, h: number) {
    // Base wall color with gradient
    const gradient = this.ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, '#1a2a3a');
    gradient.addColorStop(0.5, '#14242f');
    gradient.addColorStop(1, '#0f1a24');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, w, h);

    // Top highlight
    this.ctx.fillStyle = '#2a3a4a';
    this.ctx.fillRect(x, y, w, 4);

    // Rivets/details every 40px
    this.ctx.fillStyle = '#3a4a5a';
    for (let px = x + 20; px < x + w - 20; px += 40) {
      for (let py = y + 20; py < y + h - 20; py += 40) {
        this.ctx.fillRect(px, py, 4, 4);
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(px + 1, py + 1, 3, 3);
        this.ctx.fillStyle = '#3a4a5a';
      }
    }

    // Border
    this.ctx.strokeStyle = '#2a3a4a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawPixelFurniture(x: number, y: number, w: number, h: number) {
    // Desk/console base
    this.ctx.fillStyle = '#203545';
    this.ctx.fillRect(x, y, w, h);

    // Top surface with shine
    const topGradient = this.ctx.createLinearGradient(x, y, x, y + h);
    topGradient.addColorStop(0, '#2a4555');
    topGradient.addColorStop(1, '#1a3040');
    this.ctx.fillStyle = topGradient;
    this.ctx.fillRect(x + 6, y + 6, w - 12, h - 12);

    // Highlight stripe
    this.ctx.fillStyle = 'rgba(100, 180, 220, 0.3)';
    this.ctx.fillRect(x + 6, y + 6, w - 12, 3);

    // Control panel details
    const panelW = Math.min(w - 20, 30);
    const panelH = 20;
    const panelX = x + (w - panelW) / 2;
    const panelY = y + h / 2 - panelH / 2;

    this.ctx.fillStyle = '#0a1a2a';
    this.ctx.fillRect(panelX, panelY, panelW, panelH);

    // LED indicators
    for (let i = 0; i < 3; i++) {
      const ledX = panelX + 5 + i * 8;
      const ledY = panelY + 5;
      const colors = ['#ff3333', '#ffaa33', '#33ff33'];
      this.ctx.fillStyle = colors[i];
      this.ctx.fillRect(ledX, ledY, 4, 4);
      this.ctx.fillStyle = colors[i] + '44';
      this.ctx.fillRect(ledX - 1, ledY - 1, 6, 6);
    }

    // Border
    this.ctx.strokeStyle = '#3a4a5a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawEnhancedObject(obj: InteractiveObject, playerPos: { x: number; y: number }) {
    const { position, size, type } = obj;

    const dx = (playerPos.x + 16) - (position.x + size.x / 2);
    const dy = (playerPos.y + 16) - (position.y + size.y / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const isNear = dist <= obj.interactionRadius;

    // Glow effect when near
    if (isNear) {
      this.ctx.shadowBlur = 25;
      this.ctx.shadowColor = '#00ffff';
    }

    switch (type) {
      case 'terminal':
        TerminalSprite.draw(this.ctx, position.x, position.y, size.x, size.y, isNear);
        break;
      case 'station':
        this.drawPixelStation(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'door':
        DoorSprite.draw(this.ctx, position.x, position.y, size.x, size.y, isNear);
        break;
      case 'npc':
        NPCSprite.draw(this.ctx, position.x, position.y, isNear);
        break;
    }

    this.ctx.shadowBlur = 0;

    // Label when near
    if (isNear) {
      this.drawObjectLabel(obj, position.x, position.y, size.x);
    }
  }

  private drawPixelStation(x: number, y: number, w: number, h: number, active: boolean) {
    // Base platform
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(x, y + h * 0.65, w, h * 0.35);

    // Pedestal
    this.ctx.fillStyle = '#2a2a3e';
    this.ctx.fillRect(x + w * 0.15, y + h * 0.3, w * 0.7, h * 0.65);

    // Holographic display area
    const centerX = x + w / 2;
    const centerY = y + h * 0.2;
    const radius = Math.min(w, h) * 0.18;
    const rotation = (Date.now() / 1500) % (Math.PI * 2);

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(rotation);

    this.ctx.strokeStyle = active ? '#00aaff' : '#004488';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    if (active) {
      this.ctx.fillStyle = 'rgba(0, 170, 255, 0.2)';
      this.ctx.fill();
    }

    this.ctx.restore();

    // Border
    this.ctx.strokeStyle = active ? '#00ffff' : '#3a4a5a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawEnhancedPlayer(player: GameState['player']) {
    const { position, direction, isMoving, animationFrame } = player;

    // Use the proper player sprite
    PlayerSprite.draw(
      this.ctx,
      position.x,
      position.y,
      direction,
      isMoving ? animationFrame : 0
    );
  }

  private drawObjectLabel(obj: InteractiveObject, x: number, y: number, w: number) {
    const labelY = y - 30;
    const labelW = Math.max(w, 120);
    const labelX = x + w / 2 - labelW / 2;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(labelX, labelY, labelW, 24);

    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(labelX, labelY, labelW, 24);

    this.ctx.fillStyle = '#00ffff';
    this.ctx.font = 'bold 11px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(obj.title, labelX + labelW / 2, labelY + 16);
  }

  private drawInteractionPrompt(gameState: GameState, room: Room) {
    const player = gameState.player;

    for (const obj of room.objects) {
      const dx = (player.position.x + 16) - (obj.position.x + obj.size.x / 2);
      const dy = (player.position.y + 16) - (obj.position.y + obj.size.y / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= obj.interactionRadius && obj.isInteractable) {
        const screenX = obj.position.x + obj.size.x / 2 + gameState.cameraOffset.x;
        const screenY = obj.position.y - 60 + gameState.cameraOffset.y;

        const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.7;

        this.ctx.fillStyle = `rgba(0, 20, 30, ${0.95 * pulse})`;
        this.ctx.fillRect(screenX - 60, screenY - 20, 120, 32);

        this.ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX - 60, screenY - 20, 120, 32);

        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[E] Interact', screenX, screenY - 2);

        break;
      }
    }
  }

  private addParticle(x: number, y: number) {
    this.particleSystem.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.5 - 0.2,
      life: 100,
      maxLife: 100,
      size: Math.random() * 2 + 1
    });
  }

  private updateAndDrawParticles() {
    this.particleSystem = this.particleSystem.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life > 0) {
        const alpha = p.life / p.maxLife;
        this.ctx.fillStyle = `rgba(0, 200, 255, ${alpha * 0.6})`;
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
        return true;
      }
      return false;
    });
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
