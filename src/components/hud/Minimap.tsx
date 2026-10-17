import React, { useEffect, useRef } from 'react';
import type { GameState, Room } from '../../types/game';
import { ROOMS } from '../../data/rooms';

interface MinimapProps {
  gameState: GameState;
}

const Minimap: React.FC<MinimapProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentRoom: Room | undefined = ROOMS.find((r) => r.id === gameState.currentRoom);
    if (!currentRoom) return;

    const mapW = canvas.width;
    const mapH = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(5, 12, 24, 0.9)';
    ctx.fillRect(0, 0, mapW, mapH);

    // Border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, mapW, mapH);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < mapW; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapH);
      ctx.stroke();
    }
    for (let y = 0; y < mapH; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapW, y);
      ctx.stroke();
    }

    // Scale factors
    const scaleX = mapW / currentRoom.bounds.width;
    const scaleY = mapH / currentRoom.bounds.height;

    // Draw room collision boxes / walls
    ctx.fillStyle = 'rgba(0, 150, 255, 0.25)';
    for (const box of currentRoom.collisionBoxes) {
      ctx.fillRect(box.x * scaleX, box.y * scaleY, box.width * scaleX, box.height * scaleY);
    }

    // Draw interactive objects (Terminals/doors)
    for (const obj of currentRoom.objects) {
      const ox = obj.position.x * scaleX;
      const oy = obj.position.y * scaleY;
      ctx.fillStyle = obj.type === 'door' ? '#0088ff' : obj.type === 'chest' ? '#ffaa00' : '#ffff00';
      ctx.beginPath();
      ctx.arc(ox, oy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Collectibles
    ctx.fillStyle = '#00ff88';
    for (const c of gameState.collectibles) {
      const cx = c.position.x * scaleX;
      const cy = c.position.y * scaleY;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Bots (red blips)
    ctx.fillStyle = '#ff3333';
    for (const b of gameState.bots) {
      if (b.state !== 'dead') {
        const bx = b.position.x * scaleX;
        const by = b.position.y * scaleY;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Player (pulsing cyan blip)
    const px = gameState.player.position.x * scaleX;
    const py = gameState.player.position.y * scaleY;

    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    // Direction pointer
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    let dx = 0;
    let dy = 0;
    if (gameState.player.direction === 'up') dy = -7;
    else if (gameState.player.direction === 'down') dy = 7;
    else if (gameState.player.direction === 'left') dx = -7;
    else if (gameState.player.direction === 'right') dx = 7;
    ctx.lineTo(px + dx, py + dy);
    ctx.stroke();

    // Corner title
    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.font = '8px monospace';
    ctx.fillText('RADAR', 4, 10);
  }, [gameState]);

  return (
    <div className="hud-minimap-container">
      <canvas ref={canvasRef} width={130} height={90} className="hud-minimap-canvas" />
    </div>
  );
};

export default Minimap;
