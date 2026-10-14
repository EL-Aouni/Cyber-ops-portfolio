import type { Rectangle, Vector2 } from '../../types/game';

export const checkCollision = (
  rect1: Rectangle,
  rect2: Rectangle
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

export const checkPointInRect = (point: Vector2, rect: Rectangle): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

export const distance = (p1: Vector2, p2: Vector2): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const resolveCollision = (
  playerPos: Vector2,
  playerSize: Vector2,
  collisionBox: Rectangle,
  velocity: Vector2
): Vector2 => {
  const newPos = { ...playerPos };

  const playerRect = {
    x: newPos.x,
    y: newPos.y,
    width: playerSize.x,
    height: playerSize.y,
  };

  if (checkCollision(playerRect, collisionBox)) {
    // Calculate overlap on each axis
    const overlapLeft = (playerRect.x + playerRect.width) - collisionBox.x;
    const overlapRight = (collisionBox.x + collisionBox.width) - playerRect.x;
    const overlapTop = (playerRect.y + playerRect.height) - collisionBox.y;
    const overlapBottom = (collisionBox.y + collisionBox.height) - playerRect.y;

    // Find minimum overlap
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    // Resolve collision by moving player back
    if (minOverlap === overlapLeft && velocity.x > 0) {
      newPos.x = collisionBox.x - playerSize.x;
    } else if (minOverlap === overlapRight && velocity.x < 0) {
      newPos.x = collisionBox.x + collisionBox.width;
    } else if (minOverlap === overlapTop && velocity.y > 0) {
      newPos.y = collisionBox.y - playerSize.y;
    } else if (minOverlap === overlapBottom && velocity.y < 0) {
      newPos.y = collisionBox.y + collisionBox.height;
    }
  }

  return newPos;
};
