import type { GameState, Room, InteractiveObject, Bot, Projectile, Collectible, FloatingText } from '../../types/game';
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
  color: string;
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
    this.ctx.imageSmoothingEnabled = false;

    this.spriteLoader = new SpriteLoader();
    this.spriteLoader.waitForLoad().then(() => {
      this.spritesLoaded = true;
    });
  }

  render(gameState: GameState, currentRoom: Room) {
    this.clear();

    const camera = gameState.cameraOffset;

    this.ctx.save();
    this.ctx.translate(camera.x, camera.y);

    // 1. Room Floor, Walls, and Tiles
    this.drawRoomTiles(currentRoom);

    // 2. Animated Room Decorations (Torches, Furniture, Spikes)
    this.drawDecorations(currentRoom);

    // 3. Ambient cyber particles
    this.updateAndDrawParticles();

    // 4. Interactive objects (Terminals, Stations, Chests, Doors)
    for (const obj of currentRoom.objects) {
      this.drawObject(obj, gameState.player.position);
    }

    // 5. Collectibles (USB Drives, Badges, Discs)
    for (const c of gameState.collectibles) {
      this.drawCollectible(c);
    }

    // 6. Roaming Malware Bots / Sentinels
    for (const bot of gameState.bots) {
      this.drawBot(bot);
    }

    // 7. Projectiles (EMP Blasts / Hack Beams)
    for (const p of gameState.projectiles) {
      this.drawProjectile(p);
    }

    // 8. Player Sprite with Walk, Attack, Hurt frames
    this.drawPlayer(gameState.player);

    // 9. Dynamic Cyber Lighting & Shadows (Player Spotlight, Torches, Terminals)
    this.drawLighting(gameState, currentRoom);

    // 10. Floating Combat/XP Texts
    for (const ft of gameState.floatingTexts) {
      this.drawFloatingText(ft);
    }

    this.ctx.restore();

    // 11. Screen-space Overlays (Interaction Prompt, Recent Lore Notification)
    this.drawInteractionPrompt(gameState, currentRoom);
  }

  private clear() {
    this.ctx.fillStyle = '#050811';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawRoomTiles(room: Room) {
    const tileSize = 32;
    const floorSprite = this.spriteLoader.getSprite('floor');
    const wallSprite = this.spriteLoader.getSprite('wall');

    // Draw floor
    for (let x = room.bounds.x; x < room.bounds.width; x += tileSize) {
      for (let y = room.bounds.y; y < room.bounds.height; y += tileSize) {
        if (floorSprite && this.spritesLoaded) {
          this.ctx.drawImage(floorSprite, x, y, tileSize, tileSize);
        } else {
          const tileX = Math.floor(x / tileSize);
          const tileY = Math.floor(y / tileSize);
          const isDark = (tileX + tileY) % 2 === 0;
          this.ctx.fillStyle = isDark ? '#0a101d' : '#0f1828';
          this.ctx.fillRect(x, y, tileSize, tileSize);
        }

        // Tech grid lines
        this.ctx.strokeStyle = 'rgba(0, 200, 255, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Draw outer & inner collision walls with cyber depth
    for (const wall of room.collisionBoxes) {
      // Check if it's an outer wall or obstacle
      const isWallObstacle = wall.width >= 40 && wall.height >= 40;
      if (isWallObstacle) {
        if (wallSprite && this.spritesLoaded) {
          // Tile the wall sprite
          for (let wx = wall.x; wx < wall.x + wall.width; wx += tileSize) {
            for (let wy = wall.y; wy < wall.y + wall.height; wy += tileSize) {
              const dw = Math.min(tileSize, wall.x + wall.width - wx);
              const dh = Math.min(tileSize, wall.y + wall.height - wy);
              this.ctx.drawImage(wallSprite, 0, 0, dw, dh, wx, wy, dw, dh);
            }
          }
        } else {
          const wallGrad = this.ctx.createLinearGradient(wall.x, wall.y, wall.x, wall.y + wall.height);
          wallGrad.addColorStop(0, '#192b3d');
          wallGrad.addColorStop(1, '#0c1622');
          this.ctx.fillStyle = wallGrad;
          this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }

        // Neon cyber edge along walls
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.35)';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);

        // Tech rivets/nodes
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(wall.x + 4, wall.y + 4, 3, 3);
        this.ctx.fillRect(wall.x + wall.width - 7, wall.y + 4, 3, 3);
      }
    }
  }

  private drawDecorations(room: Room) {
    if (!room.decorations) return;
    const time = Date.now();

    for (const deco of room.decorations) {
      if (deco.type === 'fire') {
        const fireSprite = this.spriteLoader.getSprite('fire1');
        if (fireSprite && this.spritesLoaded) {
          // 128x16 = 8 frames of 16x16
          const frameWidth = 16;
          const frameHeight = 16;
          const frame = Math.floor(time / 100) % 8;

          this.ctx.drawImage(
            fireSprite,
            frame * frameWidth, 0, frameWidth, frameHeight,
            deco.position.x, deco.position.y, deco.size.x, deco.size.y
          );
        } else {
          // Procedural plasma flame
          this.ctx.fillStyle = '#00ffff';
          this.ctx.beginPath();
          this.ctx.arc(deco.position.x + 16, deco.position.y + 16, 10 + Math.sin(time / 80) * 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  private drawObject(obj: InteractiveObject, playerPos: { x: number; y: number }) {
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
        const doorSprite = this.spriteLoader.getSprite('door');
        if (doorSprite && this.spritesLoaded) {
          // 80x20 = 4 frames of 20x20
          const frame = isNear ? 3 : 0;
          this.ctx.drawImage(
            doorSprite,
            frame * 20, 0, 20, 20,
            obj.position.x, obj.position.y, obj.size.x, obj.size.y
          );
        } else {
          DoorSprite.draw(
            this.ctx,
            obj.position.x,
            obj.position.y,
            obj.size.x,
            obj.size.y,
            isNear
          );
        }
        break;

      case 'chest':
        const chestSprite = this.spriteLoader.getSprite('chest1');
        if (chestSprite && this.spritesLoaded) {
          // 64x24 = 4 frames of 16x24
          const frame = obj.state === 'open' ? 3 : 0;
          this.ctx.drawImage(
            chestSprite,
            frame * 16, 0, 16, 24,
            obj.position.x, obj.position.y - 8, 32, 40
          );
          if (isNear && obj.state !== 'open') {
            this.ctx.strokeStyle = '#00ffaa';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(obj.position.x - 2, obj.position.y - 10, 36, 44);
          }
        } else {
          this.ctx.fillStyle = obj.state === 'open' ? '#33aa88' : '#ffaa00';
          this.ctx.fillRect(obj.position.x, obj.position.y, 32, 32);
        }
        break;

      case 'npc':
        const npcSprite = this.spriteLoader.getSprite('npc1_idle');
        if (npcSprite && this.spritesLoaded) {
          const frameWidth = 32;
          const frameHeight = 32;
          const frame = Math.floor(Date.now() / 400) % 4;

          this.ctx.drawImage(
            npcSprite,
            frame * frameWidth, 0, frameWidth, frameHeight,
            obj.position.x, obj.position.y, 48, 48
          );

          if (isNear) {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(obj.position.x, obj.position.y, 48, 48);
          }
        } else {
          NPCSprite.draw(this.ctx, obj.position.x, obj.position.y, isNear);
        }
        break;

      case 'desk':
        this.drawDesk(obj);
        break;
    }

    // Near label banner
    if (isNear && obj.label) {
      this.ctx.fillStyle = 'rgba(5, 12, 24, 0.88)';
      const textWidth = this.ctx.measureText(obj.label).width;
      this.ctx.fillRect(obj.position.x - 10, obj.position.y - 32, Math.max(textWidth + 24, 110), 24);
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(obj.position.x - 10, obj.position.y - 32, Math.max(textWidth + 24, 110), 24);

      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 12px monospace';
      this.ctx.fillText(obj.label, obj.position.x - 4, obj.position.y - 16);
    }
  }

  private drawStation(obj: InteractiveObject, isNear: boolean) {
    const x = obj.position.x;
    const y = obj.position.y;
    const w = obj.size.x;
    const h = obj.size.y;

    this.ctx.fillStyle = '#101d2d';
    this.ctx.fillRect(x, y + h - 16, w, 16);
    this.ctx.fillStyle = '#1e3852';
    this.ctx.fillRect(x + 4, y + h - 16, w - 8, 3);

    const time = Date.now() / 1000;
    const rotation = time * 0.7;

    this.ctx.save();
    this.ctx.translate(x + w / 2, y + h / 2 - 8);
    this.ctx.rotate(rotation);

    this.ctx.strokeStyle = isNear ? '#00ffff' : '#0099bb';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * 22;
      const py = Math.sin(angle) * 22;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawDesk(obj: InteractiveObject) {
    const x = obj.position.x;
    const y = obj.position.y;
    const w = obj.size.x;
    const h = obj.size.y;

    this.ctx.fillStyle = '#172738';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.fillStyle = '#223d5a';
    this.ctx.fillRect(x, y, w, 8);
  }

  private drawCollectible(c: Collectible) {
    const bob = Math.sin(c.bobTimer * 4) * 5;
    const x = c.position.x;
    const y = c.position.y + bob;

    this.ctx.save();

    // Floating glow aura
    const glow = this.ctx.createRadialGradient(x, y, 2, x, y, 18);
    glow.addColorStop(0, c.type === 'usb' ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 215, 0, 0.8)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 18, 0, Math.PI * 2);
    this.ctx.fill();

    if (c.type === 'usb') {
      // Draw USB Drive
      this.ctx.fillStyle = '#00ffff';
      this.ctx.fillRect(x - 6, y - 8, 12, 16);
      this.ctx.fillStyle = '#cccccc';
      this.ctx.fillRect(x - 4, y - 13, 8, 5);
      this.ctx.fillStyle = '#005577';
      this.ctx.fillRect(x - 3, y - 5, 6, 8);
    } else if (c.type === 'badge') {
      // Draw Security Badge (Shield)
      this.ctx.fillStyle = '#ffd700';
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - 10);
      this.ctx.lineTo(x + 9, y - 4);
      this.ctx.lineTo(x + 7, y + 8);
      this.ctx.lineTo(x, y + 12);
      this.ctx.lineTo(x - 7, y + 8);
      this.ctx.lineTo(x - 9, y - 4);
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      // Optical Disc / Intel chip
      this.ctx.fillStyle = '#ff00bb';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 9, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#050811';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private drawBot(bot: Bot) {
    if (bot.state === 'dead' && bot.deathTimer !== undefined && bot.deathTimer <= 0) return;

    let spriteKey = 'enemy1_walk_down';
    if (bot.type === 'sentinel') {
      if (bot.state === 'attack') spriteKey = 'enemy2_attack';
      else if (bot.state === 'hurt') spriteKey = 'enemy2_hurt';
      else if (bot.state === 'dead') spriteKey = 'enemy2_death';
      else if (bot.direction === 'up') spriteKey = 'enemy2_walk_up';
      else if (bot.direction === 'down') spriteKey = 'enemy2_walk_down';
      else spriteKey = 'enemy2_walk_side';
    } else {
      if (bot.state === 'attack') spriteKey = 'enemy1_attack';
      else if (bot.state === 'hurt') spriteKey = 'enemy1_hurt';
      else if (bot.state === 'dead') spriteKey = 'enemy1_death';
      else if (bot.direction === 'up') spriteKey = 'enemy1_walk_up';
      else if (bot.direction === 'down') spriteKey = 'enemy1_walk_down';
      else spriteKey = 'enemy1_walk_side';
    }

    const sprite = this.spriteLoader.getSprite(spriteKey);

    this.ctx.save();

    if (sprite && this.spritesLoaded) {
      const frameWidth = 32;
      const frameHeight = 32;
      let frameCount = 6;
      if (bot.state === 'attack') frameCount = 4;
      if (bot.state === 'hurt') frameCount = 2;
      if (bot.state === 'dead') frameCount = 8;

      const frame = Math.floor(bot.animationFrame) % frameCount;

      if (bot.direction === 'left') {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          -(bot.position.x + 36), bot.position.y - 8, 40, 40
        );
      } else {
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          bot.position.x - 4, bot.position.y - 8, 40, 40
        );
      }
    } else {
      // Fallback
      this.ctx.fillStyle = bot.state === 'chase' ? '#ff2222' : '#ff8800';
      this.ctx.fillRect(bot.position.x, bot.position.y, 28, 28);
    }

    // Health bar above bot (if not dead)
    if (bot.state !== 'dead') {
      const barW = 32;
      const barH = 4;
      const barX = bot.position.x - 2;
      const barY = bot.position.y - 14;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(barX, barY, barW, barH);
      this.ctx.fillStyle = bot.state === 'chase' ? '#ff3333' : '#00ff88';
      const fillW = Math.max(0, (bot.health / bot.maxHealth) * barW);
      this.ctx.fillRect(barX, barY, fillW, barH);
      this.ctx.strokeStyle = '#222';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(barX, barY, barW, barH);
    }

    this.ctx.restore();
  }

  private drawProjectile(p: Projectile) {
    this.ctx.save();

    // Laser / EMP glowing core
    const rad = this.ctx.createRadialGradient(p.position.x, p.position.y, 1, p.position.x, p.position.y, p.radius * 2);
    rad.addColorStop(0, '#ffffff');
    rad.addColorStop(0.4, '#00ffff');
    rad.addColorStop(1, 'rgba(0, 200, 255, 0)');

    this.ctx.fillStyle = rad;
    this.ctx.beginPath();
    this.ctx.arc(p.position.x, p.position.y, p.radius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawPlayer(player: any) {
    let spriteKey = 'player_idle';

    if (player.isAttacking) {
      if (player.direction === 'down') spriteKey = 'player_attack_down';
      else if (player.direction === 'up') spriteKey = 'player_attack_up';
      else spriteKey = 'player_attack_side';
    } else if (player.isHurt) {
      spriteKey = 'player_hurt';
    } else if (player.isMoving) {
      if (player.direction === 'down') spriteKey = 'player_walk_down';
      else if (player.direction === 'up') spriteKey = 'player_walk_up';
      else spriteKey = 'player_walk_side';
    }

    const sprite = this.spriteLoader.getSprite(spriteKey);

    this.ctx.save();

    if (sprite && this.spritesLoaded) {
      const frameWidth = 32;
      const frameHeight = 32;
      let frameCount = 6;
      if (player.isAttacking || !player.isMoving) frameCount = 4;
      if (player.isHurt) frameCount = 2;

      const frame = Math.floor(player.animationFrame) % frameCount;

      if (player.direction === 'left') {
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          -(player.position.x + 48), player.position.y - 8, 48, 48
        );
      } else {
        this.ctx.drawImage(
          sprite,
          frame * frameWidth, 0, frameWidth, frameHeight,
          player.position.x - 8, player.position.y - 8, 48, 48
        );
      }
    } else {
      PlayerSprite.draw(
        this.ctx,
        player.position.x,
        player.position.y,
        player.direction,
        Math.floor(player.animationFrame)
      );
    }

    // Hurt red flash overlay
    if (player.isHurt) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.35)';
      this.ctx.fillRect(player.position.x - 4, player.position.y - 4, 40, 40);
    }

    this.ctx.restore();
  }

  private drawLighting(gameState: GameState, _room: Room) {
    const player = gameState.player;

    // Dark ambient lighting overlay
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-over';

    // Spotlight gradient around player (cyber flashlight)
    const playerRadius = 240;
    const playerLight = this.ctx.createRadialGradient(
      player.position.x + 16, player.position.y + 16, 20,
      player.position.x + 16, player.position.y + 16, playerRadius
    );
    playerLight.addColorStop(0, 'rgba(0, 220, 255, 0.08)');
    playerLight.addColorStop(0.7, 'rgba(0, 100, 150, 0.03)');
    playerLight.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = playerLight;
    this.ctx.beginPath();
    this.ctx.arc(player.position.x + 16, player.position.y + 16, playerRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private drawFloatingText(ft: FloatingText) {
    const alpha = Math.max(0, ft.life / ft.maxLife);
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'center';

    // Black stroke for legibility
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(ft.text, ft.position.x, ft.position.y);

    this.ctx.fillStyle = ft.color;
    this.ctx.fillText(ft.text, ft.position.x, ft.position.y);
    this.ctx.restore();
  }

  private updateAndDrawParticles() {
    const time = Date.now();

    if (Math.random() < 0.1) {
      this.particleSystem.push({
        x: Math.random() * this.canvas.width * 2,
        y: Math.random() * this.canvas.height * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        life: time,
        maxLife: 2500 + Math.random() * 2000,
        size: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#00ffff' : '#00ff88',
      });
    }

    this.particleSystem = this.particleSystem.filter(p => {
      const age = time - p.life;
      if (age > p.maxLife) return false;

      p.x += p.vx;
      p.y += p.vy;

      const alpha = 1 - (age / p.maxLife);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha * 0.35;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
      this.ctx.globalAlpha = 1;

      return true;
    });
  }

  private drawInteractionPrompt(gameState: GameState, room: Room) {
    const player = gameState.player;
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
      const promptX = this.canvas.width / 2 - 130;
      const promptY = this.canvas.height - 75;

      this.ctx.save();
      this.ctx.fillStyle = 'rgba(5, 12, 24, 0.92)';
      this.ctx.fillRect(promptX, promptY, 260, 46);

      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(promptX, promptY, 260, 46);

      this.ctx.fillStyle = '#00ffff';
      this.ctx.font = 'bold 14px monospace';
      this.ctx.textAlign = 'center';
      const promptText = nearest.type === 'chest' && nearest.state !== 'open'
        ? '[E] Unlock Cyber Cache'
        : nearest.label || 'Press [E] to Interact';
      this.ctx.fillText(promptText, promptX + 130, promptY + 28);

      this.ctx.restore();
    }
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
