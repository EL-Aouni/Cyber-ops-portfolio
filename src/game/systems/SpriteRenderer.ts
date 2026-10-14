// Enhanced sprite-based renderer with tile maps
import type { GameState, Room, InteractiveObject } from '../../types/game';

interface Sprite {
  image: HTMLImageElement;
  loaded: boolean;
}

export class SpriteRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private sprites: Map<string, Sprite> = new Map();
  private imagesLoaded = false;
  private loadingProgress = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false; // Crisp pixel art
    this.preloadSprites();
  }

  private preloadSprites() {
    // Using free pixel art from OpenGameArt.org and itch.io
    const spriteList = [
      // Floor tiles
      { key: 'floor-tech', url: 'https://opengameart.org/sites/default/files/floor_tile_0.png' },
      // Character (can be replaced with better sprites)
      { key: 'player', url: 'https://opengameart.org/sites/default/files/character.png' },
      // Objects
      { key: 'terminal', url: 'https://opengameart.org/sites/default/files/computer.png' },
    ];

    let loaded = 0;
    const total = spriteList.length;

    spriteList.forEach(({ key, url }) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const sprite: Sprite = {
        image: img,
        loaded: false,
      };

      img.onload = () => {
        sprite.loaded = true;
        loaded++;
        this.loadingProgress = (loaded / total) * 100;

        if (loaded === total) {
          this.imagesLoaded = true;
          console.log('All sprites loaded!');
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load sprite: ${key} from ${url}`);
        sprite.loaded = true; // Mark as loaded to not block
        loaded++;
        this.loadingProgress = (loaded / total) * 100;

        if (loaded === total) {
          this.imagesLoaded = true;
        }
      };

      img.src = url;
      this.sprites.set(key, sprite);
    });
  }

  render(gameState: GameState, currentRoom: Room) {
    this.clear();

    if (!this.imagesLoaded) {
      this.drawLoadingScreen();
      return;
    }

    const camera = gameState.cameraOffset;

    // Apply camera transform
    this.ctx.save();
    this.ctx.translate(camera.x, camera.y);

    // Draw room with enhanced graphics
    this.drawRoomEnhanced(currentRoom);

    // Draw interactive objects with sprites
    for (const obj of currentRoom.objects) {
      this.drawObjectEnhanced(obj, gameState.player.position);
    }

    // Draw player with sprite
    this.drawPlayerEnhanced(gameState.player);

    this.ctx.restore();

    // Draw UI overlay
    this.drawInteractionPrompt(gameState, currentRoom);
  }

  private drawLoadingScreen() {
    this.ctx.fillStyle = '#0a0e1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00ffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      `Loading Assets... ${Math.round(this.loadingProgress)}%`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  private clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawRoomEnhanced(room: Room) {
    // Draw floor with gradient pattern
    const gradient = this.ctx.createRadialGradient(
      room.bounds.width / 2,
      room.bounds.height / 2,
      0,
      room.bounds.width / 2,
      room.bounds.height / 2,
      Math.max(room.bounds.width, room.bounds.height)
    );
    gradient.addColorStop(0, room.backgroundColor);
    gradient.addColorStop(1, '#000000');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(room.bounds.x, room.bounds.y, room.bounds.width, room.bounds.height);

    // Draw tiles in a grid pattern
    this.ctx.strokeStyle = room.ambientColor || '#1a2a3a';
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = 0.15;

    const tileSize = 50;
    for (let x = room.bounds.x; x < room.bounds.width; x += tileSize) {
      for (let y = room.bounds.y; y < room.bounds.height; y += tileSize) {
        // Checkerboard pattern
        if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
          this.ctx.fillStyle = 'rgba(26, 42, 58, 0.3)';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    this.ctx.globalAlpha = 1;

    // Draw walls and furniture with enhanced 3D effect
    for (const box of room.collisionBoxes) {
      const isWall = box.width >= 800 || box.height >= 600;

      if (isWall) {
        // Wall with depth
        this.ctx.fillStyle = '#1a2a3a';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);

        // Top highlight
        this.ctx.fillStyle = '#2a3a4a';
        this.ctx.fillRect(box.x, box.y, box.width, 4);

        // Border
        this.ctx.strokeStyle = '#3a4a5a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
      } else {
        // Desk/furniture with isometric-like depth
        // Base
        this.ctx.fillStyle = '#203040';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);

        // Top surface
        this.ctx.fillStyle = '#2a4a5a';
        this.ctx.fillRect(box.x + 4, box.y + 4, box.width - 8, box.height - 8);

        // Side depth
        this.ctx.fillStyle = '#152535';
        this.ctx.fillRect(box.x, box.y + box.height - 10, box.width, 10);

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(box.x + 4, box.y + 4, box.width - 8, 4);

        // Border
        this.ctx.strokeStyle = '#3a5a6a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
      }
    }
  }

  private drawObjectEnhanced(obj: InteractiveObject, playerPos: { x: number; y: number }) {
    const { position, size, type } = obj;

    const dx = (playerPos.x + 16) - (position.x + size.x / 2);
    const dy = (playerPos.y + 16) - (position.y + size.y / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const isNear = dist <= obj.interactionRadius;

    if (isNear) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#00ffff';
    }

    switch (type) {
      case 'terminal':
        this.drawTerminalEnhanced(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'station':
        this.drawStationEnhanced(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'door':
        this.drawDoorEnhanced(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'npc':
        this.drawNPCEnhanced(position.x, position.y, size.x, size.y, isNear);
        break;
    }

    this.ctx.shadowBlur = 0;

    // Draw label when near
    if (isNear) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(position.x - 10, position.y - 30, size.x + 20, 20);

      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(obj.title, position.x + size.x / 2, position.y - 16);
    }
  }

  private drawTerminalEnhanced(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Monitor with CRT effect
    // Base/stand
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(x + w * 0.3, y + h - 8, w * 0.4, 8);

    // Monitor body
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(x, y, w, h - 8);

    // Screen bezel
    this.ctx.strokeStyle = '#2a2a3e';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x, y, w, h - 8);

    // Screen
    const screenPadding = 8;
    const gradient = this.ctx.createLinearGradient(
      x + screenPadding,
      y + screenPadding,
      x + screenPadding,
      y + h - screenPadding - 8
    );
    gradient.addColorStop(0, highlight ? '#00ff88' : '#003322');
    gradient.addColorStop(1, highlight ? '#004444' : '#001111');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      x + screenPadding,
      y + screenPadding,
      w - screenPadding * 2,
      h - screenPadding * 2 - 8
    );

    // Screen scanlines
    this.ctx.globalAlpha = 0.1;
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < h - 16; i += 4) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + screenPadding, y + screenPadding + i);
      this.ctx.lineTo(x + w - screenPadding, y + screenPadding + i);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1;

    // Terminal text
    this.ctx.fillStyle = highlight ? '#00ff88' : '#00aa44';
    this.ctx.font = '8px monospace';
    this.ctx.textAlign = 'left';
    const lines = ['> SYSTEM READY', '> ACCESS GRANTED', '> AWAITING INPUT'];
    lines.forEach((line, idx) => {
      this.ctx.fillText(line, x + screenPadding + 4, y + screenPadding + 12 + idx * 10);
    });

    // Power LED
    this.ctx.fillStyle = highlight ? '#00ff00' : '#005500';
    this.ctx.beginPath();
    this.ctx.arc(x + w - 10, y + 10, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Border glow
    if (highlight) {
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, w, h - 8);
    }
  }

  private drawStationEnhanced(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Control station with holographic display
    // Base platform
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(x, y + h * 0.7, w, h * 0.3);

    // Central pedestal
    this.ctx.fillStyle = '#2a2a3e';
    this.ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.6);

    // Holographic display (rotating hexagon)
    const centerX = x + w / 2;
    const centerY = y + h * 0.3;
    const radius = Math.min(w, h) * 0.25;
    const rotation = Date.now() / 1000;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(rotation);

    this.ctx.strokeStyle = highlight ? '#00aaff' : '#004488';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    this.ctx.stroke();

    // Inner glow
    if (highlight) {
      this.ctx.fillStyle = 'rgba(0, 170, 255, 0.3)';
      this.ctx.fill();
    }

    this.ctx.restore();

    // Control panels
    this.ctx.fillStyle = highlight ? '#0066cc' : '#003366';
    this.ctx.fillRect(x + 5, y + h * 0.5, 8, 20);
    this.ctx.fillRect(x + w - 13, y + h * 0.5, 8, 20);

    // Border
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#3a4a5a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawDoorEnhanced(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Sci-fi sliding door
    this.ctx.fillStyle = '#1a2a3a';
    this.ctx.fillRect(x, y, w, h);

    // Door panels with split in middle
    const panelOffset = highlight ? 4 : 0;

    if (w > h) {
      // Horizontal door
      // Left panel
      this.ctx.fillStyle = '#2a3a4a';
      this.ctx.fillRect(x + 5 - panelOffset, y + 5, w / 2 - 10, h - 10);
      // Right panel
      this.ctx.fillRect(x + w / 2 + 5 + panelOffset, y + 5, w / 2 - 10, h - 10);

      // Center split line
      this.ctx.strokeStyle = highlight ? '#00ffff' : '#4a5a6a';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x + w / 2, y + 5);
      this.ctx.lineTo(x + w / 2, y + h - 5);
      this.ctx.stroke();
    } else {
      // Vertical door
      // Top panel
      this.ctx.fillStyle = '#2a3a4a';
      this.ctx.fillRect(x + 5, y + 5 - panelOffset, w - 10, h / 2 - 10);
      // Bottom panel
      this.ctx.fillRect(x + 5, y + h / 2 + 5 + panelOffset, w - 10, h / 2 - 10);

      // Center split line
      this.ctx.strokeStyle = highlight ? '#00ffff' : '#4a5a6a';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x + 5, y + h / 2);
      this.ctx.lineTo(x + w - 5, y + h / 2);
      this.ctx.stroke();
    }

    // Control panel
    const panelSize = 12;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(
      x + w / 2 - panelSize / 2,
      y + h / 2 - panelSize / 2,
      panelSize,
      panelSize
    );

    // Indicator light
    this.ctx.fillStyle = highlight ? '#00ff00' : '#005500';
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h / 2, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Panel details
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#3a5a6a';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      x + w / 2 - panelSize / 2,
      y + h / 2 - panelSize / 2,
      panelSize,
      panelSize
    );
  }

  private drawNPCEnhanced(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Humanoid figure with color distinction
    const baseColor = highlight ? '#4444ff' : '#2222aa';
    const lightColor = highlight ? '#6666ff' : '#3333bb';

    // Body
    this.ctx.fillStyle = baseColor;
    this.ctx.fillRect(x + w * 0.25, y + h * 0.4, w * 0.5, h * 0.5);

    // Arms
    this.ctx.fillRect(x + w * 0.1, y + h * 0.5, w * 0.15, h * 0.3);
    this.ctx.fillRect(x + w * 0.75, y + h * 0.5, w * 0.15, h * 0.3);

    // Head
    this.ctx.fillStyle = lightColor;
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h * 0.25, w * 0.3, 0, Math.PI * 2);
    this.ctx.fill();

    // Face visor
    this.ctx.fillStyle = highlight ? '#00ffff' : '#004444';
    this.ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.4, h * 0.12);

    // Outline
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#4444aa';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h * 0.25, w * 0.3, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.strokeRect(x + w * 0.25, y + h * 0.4, w * 0.5, h * 0.5);
  }

  private drawPlayerEnhanced(player: GameState['player']) {
    const { position, size, direction, animationFrame, isMoving } = player;

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(
      position.x + size.x / 2,
      position.y + size.y - 2,
      size.x * 0.4,
      size.y * 0.15,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Body with glow
    const gradient = this.ctx.createRadialGradient(
      position.x + size.x / 2,
      position.y + size.y / 2,
      0,
      position.x + size.x / 2,
      position.y + size.y / 2,
      size.x
    );
    gradient.addColorStop(0, '#00ffaa');
    gradient.addColorStop(1, '#00aa88');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(position.x + 6, position.y + 10, size.x - 12, size.y - 12);

    // Head
    this.ctx.fillStyle = '#00ddaa';
    this.ctx.fillRect(position.x + 8, position.y + 6, size.x - 16, 10);

    // Visor/face
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(position.x + 10, position.y + 8, size.x - 20, 4);

    // Direction indicator (glowing arrow)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#00ffff';

    const centerX = position.x + size.x / 2;
    const centerY = position.y + size.y / 2;
    const arrowSize = 6;

    this.ctx.beginPath();
    switch (direction) {
      case 'up':
        this.ctx.moveTo(centerX, position.y);
        this.ctx.lineTo(centerX - arrowSize, position.y + arrowSize);
        this.ctx.lineTo(centerX + arrowSize, position.y + arrowSize);
        break;
      case 'down':
        this.ctx.moveTo(centerX, position.y + size.y);
        this.ctx.lineTo(centerX - arrowSize, position.y + size.y - arrowSize);
        this.ctx.lineTo(centerX + arrowSize, position.y + size.y - arrowSize);
        break;
      case 'left':
        this.ctx.moveTo(position.x, centerY);
        this.ctx.lineTo(position.x + arrowSize, centerY - arrowSize);
        this.ctx.lineTo(position.x + arrowSize, centerY + arrowSize);
        break;
      case 'right':
        this.ctx.moveTo(position.x + size.x, centerY);
        this.ctx.lineTo(position.x + size.x - arrowSize, centerY - arrowSize);
        this.ctx.lineTo(position.x + size.x - arrowSize, centerY + arrowSize);
        break;
    }
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.shadowBlur = 0;

    // Walking animation (bob effect)
    if (isMoving) {
      const bobOffset = Math.sin(animationFrame * 0.5) * 2;
      this.ctx.fillStyle = 'rgba(0, 255, 170, 0.5)';
      this.ctx.fillRect(position.x, position.y + bobOffset, size.x, 3);
    }

    // Outer glow
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(position.x + 2, position.y + 2, size.x - 4, size.y - 4);
  }

  private drawInteractionPrompt(gameState: GameState, room: Room) {
    const player = gameState.player;

    for (const obj of room.objects) {
      const dx = (player.position.x + 16) - (obj.position.x + obj.size.x / 2);
      const dy = (player.position.y + 16) - (obj.position.y + obj.size.y / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= obj.interactionRadius && obj.isInteractable) {
        const screenX = obj.position.x + obj.size.x / 2 + gameState.cameraOffset.x;
        const screenY = obj.position.y - 25 + gameState.cameraOffset.y;

        // Animated prompt
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;

        // Background
        this.ctx.fillStyle = `rgba(0, 0, 0, ${0.9 * pulse})`;
        this.ctx.fillRect(screenX - 55, screenY - 18, 110, 28);

        // Border
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX - 55, screenY - 18, 110, 28);

        // Text
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 13px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[E] Interact', screenX, screenY);

        break;
      }
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
