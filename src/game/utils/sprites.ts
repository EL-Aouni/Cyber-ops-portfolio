// Character sprite renderer with actual pixel art
export const PlayerSprite = {
  // 32x32 player character sprite data
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, direction: string, frame: number) {
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 30, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (animated)
    const legOffset = frame % 2 === 0 ? 2 : -2;
    ctx.fillStyle = '#00aa88';

    if (direction === 'left' || direction === 'right') {
      ctx.fillRect(x + 10, y + 20 + legOffset, 4, 8); // Left leg
      ctx.fillRect(x + 18, y + 20 - legOffset, 4, 8); // Right leg
    } else {
      ctx.fillRect(x + 10, y + 20, 4, 8);
      ctx.fillRect(x + 18, y + 20, 4, 8);
    }

    // Body armor
    const bodyGradient = ctx.createLinearGradient(x, y + 8, x, y + 20);
    bodyGradient.addColorStop(0, '#00ffaa');
    bodyGradient.addColorStop(1, '#00cc88');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x + 8, y + 10, 16, 12);

    // Shoulders
    ctx.fillStyle = '#00ddaa';
    ctx.fillRect(x + 6, y + 10, 6, 8);
    ctx.fillRect(x + 20, y + 10, 6, 8);

    // Arms (animated)
    ctx.fillStyle = '#00bb99';
    if (direction === 'left') {
      ctx.fillRect(x + 4, y + 12 + legOffset, 4, 10);
      ctx.fillRect(x + 24, y + 12 - legOffset, 4, 10);
    } else if (direction === 'right') {
      ctx.fillRect(x + 4, y + 12 - legOffset, 4, 10);
      ctx.fillRect(x + 24, y + 12 + legOffset, 4, 10);
    } else {
      ctx.fillRect(x + 4, y + 12, 4, 10);
      ctx.fillRect(x + 24, y + 12, 4, 10);
    }

    // Chest plate detail
    ctx.fillStyle = '#008877';
    ctx.fillRect(x + 13, y + 13, 6, 6);

    // Helmet
    ctx.fillStyle = '#00ccaa';
    ctx.fillRect(x + 10, y + 4, 12, 8);

    // Visor
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x + 11, y + 6, 10, 4);

    // Visor glow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 12, y + 7, 8, 2);

    // Direction antenna
    ctx.fillStyle = '#00ffff';
    switch (direction) {
      case 'up':
        ctx.fillRect(x + 15, y + 2, 2, 3);
        break;
      case 'down':
        ctx.fillRect(x + 15, y + 11, 2, 3);
        break;
      case 'left':
        ctx.fillRect(x + 8, y + 7, 3, 2);
        break;
      case 'right':
        ctx.fillRect(x + 21, y + 7, 3, 2);
        break;
    }

    // Outline
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 8, y + 4, 16, 24);

    ctx.restore();
  }
};

export const NPCSprite = {
  // 32x32 NPC character sprite
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, active: boolean) {
    ctx.save();

    const baseColor = active ? '#4466ff' : '#2244aa';
    const lightColor = active ? '#6688ff' : '#3355bb';

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 30, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = baseColor;
    ctx.fillRect(x + 10, y + 20, 4, 10);
    ctx.fillRect(x + 18, y + 20, 4, 10);

    // Body
    ctx.fillStyle = baseColor;
    ctx.fillRect(x + 9, y + 12, 14, 10);

    // Arms
    ctx.fillRect(x + 5, y + 14, 4, 8);
    ctx.fillRect(x + 23, y + 14, 4, 8);

    // Chest plate
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 12, y + 14, 8, 6);

    // Shoulders
    ctx.fillStyle = '#3355cc';
    ctx.fillRect(x + 7, y + 12, 6, 4);
    ctx.fillRect(x + 19, y + 12, 6, 4);

    // Helmet/Head
    ctx.fillStyle = lightColor;
    ctx.fillRect(x + 11, y + 4, 10, 10);

    // Visor
    ctx.fillStyle = active ? '#00ffff' : '#004488';
    ctx.fillRect(x + 12, y + 7, 8, 4);

    // Visor reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 12, y + 7, 4, 2);

    // Badge/ID
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(x + 13, y + 16, 6, 3);

    // Outline
    ctx.strokeStyle = active ? '#00ffff' : '#4466aa';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 9, y + 4, 14, 26);

    ctx.restore();
  }
};

export const TerminalSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, active: boolean) {
    // Monitor stand
    ctx.fillStyle = '#1a1a2a';
    const standW = w * 0.3;
    const standH = 8;
    ctx.fillRect(x + (w - standW) / 2, y + h - standH, standW, standH);

    // Monitor body
    const monitorH = h - standH - 2;
    ctx.fillStyle = '#14141e';
    ctx.fillRect(x, y, w, monitorH);

    // Screen bezel
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, monitorH);

    // Screen
    const padding = 8;
    const screenGradient = ctx.createLinearGradient(
      x + padding, y + padding,
      x + padding, y + monitorH - padding
    );
    screenGradient.addColorStop(0, active ? '#00ff88' : '#003322');
    screenGradient.addColorStop(1, active ? '#006644' : '#001111');

    ctx.fillStyle = screenGradient;
    ctx.fillRect(x + padding, y + padding, w - padding * 2, monitorH - padding * 2);

    // CRT scanlines
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < monitorH - padding * 2; i += 3) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + padding, y + padding + i, w - padding * 2, 1);
    }
    ctx.globalAlpha = 1;

    // Terminal text
    ctx.fillStyle = active ? '#00ff88' : '#00aa44';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';

    const lines = ['> SYSTEM ONLINE', '> ACCESS: GRANTED', '> AWAITING INPUT_'];
    lines.forEach((line, idx) => {
      ctx.fillText(line, x + padding + 4, y + padding + 14 + idx * 11);
    });

    // Power LED
    ctx.fillStyle = active ? '#00ff00' : '#005500';
    ctx.fillRect(x + w - 12, y + 8, 6, 6);
    if (active) {
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(x + w - 11, y + 9, 4, 4);
    }
  }
};

export const DoorSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, active: boolean) {
    const isHorizontal = w > h;
    const opening = active ? 8 : 0;

    // Door frame
    ctx.fillStyle = '#1a2a3a';
    ctx.fillRect(x, y, w, h);

    // Door panels
    if (isHorizontal) {
      // Left panel (slides left)
      ctx.fillStyle = '#2a3a4a';
      ctx.fillRect(x + 8 - opening, y + 8, w / 2 - 16, h - 16);

      // Right panel (slides right)
      ctx.fillRect(x + w / 2 + 8 + opening, y + 8, w / 2 - 16, h - 16);

      // Center line
      ctx.strokeStyle = active ? '#00ffff' : '#1a2a3a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + 8);
      ctx.lineTo(x + w / 2, y + h - 8);
      ctx.stroke();
    } else {
      // Top panel (slides up)
      ctx.fillStyle = '#2a3a4a';
      ctx.fillRect(x + 8, y + 8 - opening, w - 16, h / 2 - 16);

      // Bottom panel (slides down)
      ctx.fillRect(x + 8, y + h / 2 + 8 + opening, w - 16, h / 2 - 16);

      // Center line
      ctx.strokeStyle = active ? '#00ffff' : '#1a2a3a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + h / 2);
      ctx.lineTo(x + w - 8, y + h / 2);
      ctx.stroke();
    }

    // Control panel
    const panelSize = 16;
    const panelX = x + w / 2 - panelSize / 2;
    const panelY = y + h / 2 - panelSize / 2;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(panelX, panelY, panelSize, panelSize);

    // LED indicator
    ctx.fillStyle = active ? '#00ff00' : '#005500';
    ctx.fillRect(panelX + 4, panelY + 4, 8, 8);

    if (active) {
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(panelX + 6, panelY + 6, 4, 4);
    }

    // Panel border
    ctx.strokeStyle = active ? '#00ffff' : '#3a5a6a';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelSize, panelSize);
  }
};
