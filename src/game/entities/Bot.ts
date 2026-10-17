import type { Bot, Player, Projectile } from '../../types/game';
import { distance } from '../utils/collision';
import { soundFX } from '../utils/sound';

export class BotSystem {
  static updateBots(
    bots: Bot[],
    player: Player,
    projectiles: Projectile[],
    deltaTime: number,
    onBotDefeated?: (bot: Bot) => void
  ) {
    const dt = deltaTime / 1000;

    for (const bot of bots) {
      if (bot.state === 'dead') {
        if (bot.deathTimer !== undefined) {
          bot.deathTimer -= deltaTime;
        }
        continue;
      }

      // Decrement attack cooldown
      if (bot.attackTimer > 0) {
        bot.attackTimer -= deltaTime;
      }

      // Check distance to player
      const distToPlayer = distance(bot.position, player.position);

      // Bot state machine
      if (bot.state === 'hurt') {
        bot.animationTimer += deltaTime;
        if (bot.animationTimer > 300) {
          bot.state = 'chase';
          bot.animationTimer = 0;
        }
      } else if (distToPlayer <= bot.attackRadius) {
        // In attack range
        bot.state = 'attack';
        bot.velocity = { x: 0, y: 0 };

        if (bot.attackTimer <= 0) {
          // Perform attack on player
          this.botAttackPlayer(bot, player);
          bot.attackTimer = bot.attackCooldown;
        }
      } else if (distToPlayer <= bot.detectionRadius) {
        // Player detected: chase!
        bot.state = 'chase';
        const dx = player.position.x - bot.position.x;
        const dy = player.position.y - bot.position.y;
        const mag = Math.sqrt(dx * dx + dy * dy);

        if (mag > 0) {
          bot.velocity = {
            x: (dx / mag) * bot.speed,
            y: (dy / mag) * bot.speed,
          };

          // Direction facing
          if (Math.abs(dx) > Math.abs(dy)) {
            bot.direction = dx > 0 ? 'right' : 'left';
          } else {
            bot.direction = dy > 0 ? 'down' : 'up';
          }
        }
      } else {
        // Patrol path
        bot.state = 'patrol';
        this.updatePatrol(bot);
      }

      // Move bot if patrolling or chasing
      if (bot.state === 'patrol' || bot.state === 'chase') {
        bot.position.x += bot.velocity.x * dt;
        bot.position.y += bot.velocity.y * dt;

        // Walk animation
        bot.animationTimer += deltaTime;
        if (bot.animationTimer > 140) {
          bot.animationFrame = (bot.animationFrame + 1) % 6;
          bot.animationTimer = 0;
        }
      } else if (bot.state === 'attack') {
        bot.animationTimer += deltaTime;
        if (bot.animationTimer > 150) {
          bot.animationFrame = (bot.animationFrame + 1) % 4;
          bot.animationTimer = 0;
        }
      }

      // Check projectile hits against this bot
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!p.isPlayer) continue;

        const hitDist = distance(bot.position, p.position);
        if (hitDist < bot.size.x / 2 + p.radius) {
          // Hit detected!
          bot.health -= p.damage;
          p.life = 0; // destroy projectile
          soundFX.playHit();

          if (bot.health <= 0) {
            bot.health = 0;
            bot.state = 'dead';
            bot.deathTimer = 1200; // time before disappearing
            bot.animationFrame = 0;
            soundFX.playBotDeath();
            if (onBotDefeated) {
              onBotDefeated(bot);
            }
          } else {
            bot.state = 'hurt';
            bot.animationFrame = 0;
            bot.animationTimer = 0;
          }
        }
      }
    }
  }

  private static updatePatrol(bot: Bot) {
    if (!bot.patrolPoints || bot.patrolPoints.length === 0) {
      bot.velocity = { x: 0, y: 0 };
      return;
    }

    const target = bot.patrolPoints[bot.currentPointIndex];
    const dx = target.x - bot.position.x;
    const dy = target.y - bot.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 15) {
      // Reached waypoint, advance to next
      bot.currentPointIndex = (bot.currentPointIndex + 1) % bot.patrolPoints.length;
    } else {
      bot.velocity = {
        x: (dx / dist) * (bot.speed * 0.6),
        y: (dy / dist) * (bot.speed * 0.6),
      };

      if (Math.abs(dx) > Math.abs(dy)) {
        bot.direction = dx > 0 ? 'right' : 'left';
      } else {
        bot.direction = dy > 0 ? 'down' : 'up';
      }
    }
  }

  private static botAttackPlayer(bot: Bot, player: Player) {
    const damage = bot.type === 'sentinel' ? 20 : 12;
    player.isHurt = true;
    player.hurtTimer = 300;
    soundFX.playHit();

    if (player.shield > 0) {
      player.shield = Math.max(0, player.shield - damage);
    } else {
      player.health = Math.max(0, player.health - damage);
    }
  }
}
