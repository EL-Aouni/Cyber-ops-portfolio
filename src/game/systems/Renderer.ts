import type { GameState, Room, InteractiveObject } from '../../types/game';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
  }

  render(gameState: GameState, currentRoom: Room) {
    this.clear();

    const camera = gameState.cameraOffset;

    // Apply camera transform
    this.ctx.save();
    this.ctx.translate(camera.x, camera.y);

    // Draw room
    this.drawRoom(currentRoom);

    // Draw interactive objects
    for (const obj of currentRoom.objects) {
      this.drawObject(obj, gameState.player.position);
    }

    // Draw player
    this.drawPlayer(gameState.player);

    this.ctx.restore();

    // Draw UI overlay (not affected by camera)
    this.drawInteractionPrompt(gameState, currentRoom);
  }

  private clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawRoom(room: Room) {
    // Draw floor
    this.ctx.fillStyle = room.backgroundColor;
    this.ctx.fillRect(room.bounds.x, room.bounds.y, room.bounds.width, room.bounds.height);

    // Draw ambient lighting grid
    this.ctx.strokeStyle = room.ambientColor || '#1a2a3a';
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = 0.3;

    const gridSize = 50;
    for (let x = room.bounds.x; x < room.bounds.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, room.bounds.y);
      this.ctx.lineTo(x, room.bounds.height);
      this.ctx.stroke();
    }
    for (let y = room.bounds.y; y < room.bounds.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(room.bounds.x, y);
      this.ctx.lineTo(room.bounds.width, y);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;

    // Draw collision boxes (walls and furniture)
    for (const box of room.collisionBoxes) {
      // Determine if it's a wall or furniture based on size
      const isWall = box.width >= 800 || box.height >= 600;

      if (isWall) {
        this.ctx.fillStyle = '#1a2a3a';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);
        this.ctx.strokeStyle = '#2a3a4a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
      } else {
        // Furniture/desks
        this.ctx.fillStyle = '#203040';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);

        // Add depth
        this.ctx.fillStyle = '#152535';
        this.ctx.fillRect(box.x, box.y + box.height - 10, box.width, 10);

        // Border
        this.ctx.strokeStyle = '#3a4a5a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.x, box.y, box.width, box.height);
      }
    }
  }

  private drawObject(obj: InteractiveObject, playerPos: { x: number; y: number }) {
    const { position, size, type } = obj;

    // Calculate if player is near
    const dx = (playerPos.x + 16) - (position.x + size.x / 2);
    const dy = (playerPos.y + 16) - (position.y + size.y / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const isNear = dist <= obj.interactionRadius;

    // Draw glow if near
    if (isNear) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#00ffff';
    }

    // Draw based on type
    switch (type) {
      case 'terminal':
        this.drawTerminal(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'station':
        this.drawStation(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'door':
        this.drawDoor(position.x, position.y, size.x, size.y, isNear);
        break;
      case 'npc':
        this.drawNPC(position.x, position.y, size.x, size.y, isNear);
        break;
    }

    this.ctx.shadowBlur = 0;
  }

  private drawTerminal(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Monitor base
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(x, y, w, h);

    // Screen
    const screenPadding = 6;
    this.ctx.fillStyle = highlight ? '#00ff88' : '#003322';
    this.ctx.fillRect(
      x + screenPadding,
      y + screenPadding,
      w - screenPadding * 2,
      h - screenPadding * 2
    );

    // Screen lines
    this.ctx.strokeStyle = highlight ? '#00ff88' : '#00aa44';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const lineY = y + screenPadding + 8 + i * 8;
      this.ctx.beginPath();
      this.ctx.moveTo(x + screenPadding + 4, lineY);
      this.ctx.lineTo(x + w - screenPadding - 4, lineY);
      this.ctx.stroke();
    }

    // Border
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#2a3a4a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawStation(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Base
    this.ctx.fillStyle = '#2a2a3e';
    this.ctx.fillRect(x, y, w, h);

    // Central core
    const coreSize = Math.min(w, h) * 0.6;
    const coreX = x + (w - coreSize) / 2;
    const coreY = y + (h - coreSize) / 2;

    this.ctx.fillStyle = highlight ? '#0088ff' : '#004488';
    this.ctx.beginPath();
    this.ctx.arc(coreX + coreSize / 2, coreY + coreSize / 2, coreSize / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Pulsing effect
    if (highlight) {
      this.ctx.strokeStyle = '#00aaff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Border
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#3a4a5a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
  }

  private drawDoor(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Door frame
    this.ctx.fillStyle = '#1a2a3a';
    this.ctx.fillRect(x, y, w, h);

    // Door panels
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#3a5a6a';
    this.ctx.lineWidth = 3;

    if (w > h) {
      // Horizontal door
      this.ctx.strokeRect(x + 5, y + 5, w / 2 - 10, h - 10);
      this.ctx.strokeRect(x + w / 2 + 5, y + 5, w / 2 - 10, h - 10);
    } else {
      // Vertical door
      this.ctx.strokeRect(x + 5, y + 5, w - 10, h / 2 - 10);
      this.ctx.strokeRect(x + 5, y + h / 2 + 5, w - 10, h / 2 - 10);
    }

    // Indicator light
    this.ctx.fillStyle = highlight ? '#00ff00' : '#005500';
    const lightSize = 8;
    this.ctx.fillRect(x + w / 2 - lightSize / 2, y + h / 2 - lightSize / 2, lightSize, lightSize);
  }

  private drawNPC(x: number, y: number, w: number, h: number, highlight: boolean) {
    // Body
    this.ctx.fillStyle = highlight ? '#4444ff' : '#2222aa';
    this.ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.5);

    // Head
    this.ctx.fillStyle = highlight ? '#6666ff' : '#3333bb';
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h * 0.3, w * 0.25, 0, Math.PI * 2);
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = highlight ? '#00ffff' : '#4444aa';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h * 0.3, w * 0.25, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private drawPlayer(player: GameState['player']) {
    const { position, size, direction, animationFrame, isMoving } = player;

    // Player body
    this.ctx.fillStyle = '#00ffaa';
    this.ctx.fillRect(position.x + 4, position.y + 8, size.x - 8, size.y - 8);

    // Player head
    this.ctx.fillStyle = '#00ddaa';
    this.ctx.fillRect(position.x + 8, position.y + 4, size.x - 16, 12);

    // Direction indicator
    this.ctx.fillStyle = '#ffffff';
    const indicatorSize = 4;
    let indicatorX = position.x + size.x / 2 - indicatorSize / 2;
    let indicatorY = position.y + size.y / 2 - indicatorSize / 2;

    switch (direction) {
      case 'up':
        indicatorY = position.y + 2;
        break;
      case 'down':
        indicatorY = position.y + size.y - indicatorSize - 2;
        break;
      case 'left':
        indicatorX = position.x + 2;
        break;
      case 'right':
        indicatorX = position.x + size.x - indicatorSize - 2;
        break;
    }

    this.ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);

    // Animation bob effect
    if (isMoving) {
      const bobOffset = (animationFrame % 2) * 2;
      this.ctx.fillStyle = 'rgba(0, 255, 170, 0.3)';
      this.ctx.fillRect(position.x, position.y + bobOffset, size.x, 2);
    }

    // Border
    this.ctx.strokeStyle = '#00ffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(position.x, position.y, size.x, size.y);
  }

  private drawInteractionPrompt(gameState: GameState, room: Room) {
    const player = gameState.player;

    for (const obj of room.objects) {
      const dx = (player.position.x + 16) - (obj.position.x + obj.size.x / 2);
      const dy = (player.position.y + 16) - (obj.position.y + obj.size.y / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= obj.interactionRadius && obj.isInteractable) {
        const screenX = obj.position.x + obj.size.x / 2 + gameState.cameraOffset.x;
        const screenY = obj.position.y - 20 + gameState.cameraOffset.y;

        // Prompt background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(screenX - 50, screenY - 15, 100, 30);

        // Prompt text
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[E] Interact', screenX, screenY + 5);

        break;
      }
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
