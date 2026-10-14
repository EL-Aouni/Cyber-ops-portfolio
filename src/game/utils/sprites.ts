// DRAMATICALLY IMPROVED character sprites - 64x64 detailed pixel art
export const PlayerSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, direction: string, frame: number) {
    ctx.save();

    // Enhanced shadow with gradient
    const shadowGradient = ctx.createRadialGradient(x + 32, y + 60, 0, x + 32, y + 60, 20);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(x + 12, y + 55, 40, 10);

    // Walking animation offset
    const walkBob = frame % 2 === 0 ? 0 : 1;
    const armSwing = frame % 2 === 0 ? -2 : 2;

    // LEGS with detailed shading
    ctx.fillStyle = '#008866';
    const leftLegY = y + 40 + (direction === 'down' || direction === 'up' ? walkBob * 2 : 0);
    const rightLegY = y + 40 - (direction === 'down' || direction === 'up' ? walkBob * 2 : 0);

    // Left leg
    ctx.fillRect(x + 20, leftLegY, 8, 18);
    ctx.fillStyle = '#006644';
    ctx.fillRect(x + 20, leftLegY, 2, 18); // shadow
    ctx.fillStyle = '#00aa88';
    ctx.fillRect(x + 26, leftLegY, 2, 18); // highlight

    // Right leg
    ctx.fillStyle = '#008866';
    ctx.fillRect(x + 36, rightLegY, 8, 18);
    ctx.fillStyle = '#006644';
    ctx.fillRect(x + 36, rightLegY, 2, 18);
    ctx.fillStyle = '#00aa88';
    ctx.fillRect(x + 42, rightLegY, 2, 18);

    // BODY ARMOR - detailed with panels
    const bodyGradient = ctx.createLinearGradient(x + 18, y + 20, x + 46, y + 20);
    bodyGradient.addColorStop(0, '#00ddaa');
    bodyGradient.addColorStop(0.5, '#00ffcc');
    bodyGradient.addColorStop(1, '#00ddaa');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x + 18, y + 24, 28, 20);

    // Armor panels
    ctx.fillStyle = '#00bb99';
    ctx.fillRect(x + 20, y + 26, 11, 16);
    ctx.fillRect(x + 33, y + 26, 11, 16);

    // Chest plate detail
    ctx.fillStyle = '#007755';
    ctx.fillRect(x + 26, y + 28, 12, 12);

    // Energy core
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x + 29, y + 31, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 30, y + 32, 4, 4);

    // ARMS with movement
    ctx.fillStyle = '#00aa88';

    if (direction === 'left') {
      // Left arm forward
      ctx.fillRect(x + 10, y + 26 + armSwing, 8, 14);
      ctx.fillRect(x + 46, y + 26 - armSwing, 8, 14);
    } else if (direction === 'right') {
      ctx.fillRect(x + 10, y + 26 - armSwing, 8, 14);
      ctx.fillRect(x + 46, y + 26 + armSwing, 8, 14);
    } else {
      ctx.fillRect(x + 10, y + 26, 8, 14);
      ctx.fillRect(x + 46, y + 26, 8, 14);
    }

    // Arm highlights
    ctx.fillStyle = '#00cc99';
    ctx.fillRect(x + 11, y + 27, 3, 12);
    ctx.fillRect(x + 47, y + 27, 3, 12);

    // SHOULDERS
    ctx.fillStyle = '#00ffaa';
    ctx.fillRect(x + 14, y + 22, 10, 8);
    ctx.fillRect(x + 40, y + 22, 10, 8);

    // Shoulder pads detail
    ctx.fillStyle = '#00dd99';
    ctx.fillRect(x + 15, y + 23, 8, 2);
    ctx.fillRect(x + 41, y + 23, 8, 2);

    // HELMET - detailed with segments
    ctx.fillStyle = '#00ccaa';
    ctx.fillRect(x + 22, y + 8, 20, 18);

    // Helmet segments
    ctx.fillStyle = '#00aa88';
    ctx.fillRect(x + 23, y + 9, 8, 16);
    ctx.fillRect(x + 33, y + 9, 8, 16);

    // Helmet top ridge
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(x + 24, y + 8, 16, 3);

    // VISOR - glowing
    ctx.fillStyle = '#003344';
    ctx.fillRect(x + 24, y + 13, 16, 8);

    const visorGlow = ctx.createLinearGradient(x + 24, y + 13, x + 40, y + 13);
    visorGlow.addColorStop(0, '#0088ff');
    visorGlow.addColorStop(0.5, '#00ffff');
    visorGlow.addColorStop(1, '#0088ff');
    ctx.fillStyle = visorGlow;
    ctx.fillRect(x + 25, y + 14, 14, 6);

    // Visor reflection
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 26, y + 15, 8, 2);

    // Helmet lights
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x + 20, y + 12, 2, 2);
    ctx.fillRect(x + 42, y + 12, 2, 2);

    // DIRECTION ANTENNA with detail
    ctx.fillStyle = '#00ffff';
    switch (direction) {
      case 'up':
        ctx.fillRect(x + 31, y + 4, 2, 5);
        ctx.fillRect(x + 29, y + 5, 6, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 31, y + 4, 2, 2);
        break;
      case 'down':
        ctx.fillRect(x + 31, y + 25, 2, 5);
        ctx.fillRect(x + 29, y + 26, 6, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 31, y + 28, 2, 2);
        break;
      case 'left':
        ctx.fillRect(x + 18, y + 16, 5, 2);
        ctx.fillRect(x + 19, y + 14, 2, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 18, y + 16, 2, 2);
        break;
      case 'right':
        ctx.fillRect(x + 41, y + 16, 5, 2);
        ctx.fillRect(x + 43, y + 14, 2, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 44, y + 16, 2, 2);
        break;
    }

    // Outer glow effect
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 18, y + 8, 28, 50);

    // Secondary glow
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 16, y + 6, 32, 54);

    ctx.restore();
  }
};

export const NPCSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, active: boolean) {
    ctx.save();

    const primary = active ? '#5577ff' : '#3344aa';
    const secondary = active ? '#7799ff' : '#5566cc';
    const accent = active ? '#99bbff' : '#6688dd';

    // Shadow
    const shadowGrad = ctx.createRadialGradient(x + 32, y + 60, 0, x + 32, y + 60, 18);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(x + 14, y + 55, 36, 8);

    // Legs
    ctx.fillStyle = primary;
    ctx.fillRect(x + 22, y + 42, 8, 16);
    ctx.fillRect(x + 34, y + 42, 8, 16);

    // Leg detail
    ctx.fillStyle = secondary;
    ctx.fillRect(x + 23, y + 43, 3, 14);
    ctx.fillRect(x + 35, y + 43, 3, 14);

    // Body
    ctx.fillStyle = primary;
    ctx.fillRect(x + 20, y + 26, 24, 18);

    // Body armor plates
    ctx.fillStyle = secondary;
    ctx.fillRect(x + 22, y + 28, 9, 14);
    ctx.fillRect(x + 33, y + 28, 9, 14);

    // ID Badge
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(x + 28, y + 32, 8, 6);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(x + 29, y + 33, 6, 4);

    // Belt
    ctx.fillStyle = '#222222';
    ctx.fillRect(x + 20, y + 40, 24, 3);
    ctx.fillStyle = '#666666';
    ctx.fillRect(x + 30, y + 40, 4, 3);

    // Arms
    ctx.fillStyle = primary;
    ctx.fillRect(x + 14, y + 28, 6, 12);
    ctx.fillRect(x + 44, y + 28, 6, 12);

    // Arm highlights
    ctx.fillStyle = accent;
    ctx.fillRect(x + 15, y + 29, 3, 10);
    ctx.fillRect(x + 45, y + 29, 3, 10);

    // Shoulders
    ctx.fillStyle = secondary;
    ctx.fillRect(x + 16, y + 24, 10, 6);
    ctx.fillRect(x + 38, y + 24, 10, 6);

    // Head/Helmet
    ctx.fillStyle = secondary;
    ctx.fillRect(x + 24, y + 10, 16, 16);

    // Helmet detail
    ctx.fillStyle = accent;
    ctx.fillRect(x + 25, y + 11, 6, 14);
    ctx.fillRect(x + 33, y + 11, 6, 14);

    // Visor
    ctx.fillStyle = active ? '#00ffff' : '#003366';
    ctx.fillRect(x + 26, y + 14, 12, 6);

    // Visor glow
    if (active) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 27, y + 15, 6, 2);
    }

    // Helmet antenna
    ctx.fillStyle = active ? '#00ffff' : '#666666';
    ctx.fillRect(x + 30, y + 8, 4, 3);
    ctx.fillRect(x + 31, y + 6, 2, 3);

    // Helmet lights
    ctx.fillStyle = active ? '#00ff00' : '#003300';
    ctx.fillRect(x + 22, y + 14, 2, 2);
    ctx.fillRect(x + 40, y + 14, 2, 2);

    // Outline with glow
    ctx.strokeStyle = active ? '#00ffff' : primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 20, y + 10, 24, 48);

    if (active) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 18, y + 8, 28, 52);
    }

    ctx.restore();
  }
};

export const TerminalSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, active: boolean) {
    // Stand
    ctx.fillStyle = '#1a1a2e';
    const standW = w * 0.4;
    const standH = 10;
    ctx.fillRect(x + (w - standW) / 2, y + h - standH, standW, standH);

    // Monitor body with depth
    const monitorH = h - standH - 2;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(x, y, w, monitorH);

    // Side panels for depth
    ctx.fillStyle = '#14141e';
    ctx.fillRect(x + 2, y + 2, 4, monitorH - 4);
    ctx.fillRect(x + w - 6, y + 2, 4, monitorH - 4);

    // Screen bezel
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, w, monitorH);

    // Inner bezel
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 4, y + 4, w - 8, monitorH - 8);

    // Screen with CRT curve effect
    const padding = 10;
    const screenGradient = ctx.createRadialGradient(
      x + w / 2, y + monitorH / 2, 0,
      x + w / 2, y + monitorH / 2, w / 2
    );
    screenGradient.addColorStop(0, active ? '#00ff88' : '#003322');
    screenGradient.addColorStop(0.7, active ? '#00cc66' : '#002211');
    screenGradient.addColorStop(1, active ? '#008844' : '#001100');

    ctx.fillStyle = screenGradient;
    ctx.fillRect(x + padding, y + padding, w - padding * 2, monitorH - padding * 2);

    // Scanlines
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < monitorH - padding * 2; i += 2) {
      ctx.fillStyle = i % 4 === 0 ? '#000000' : 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(x + padding, y + padding + i, w - padding * 2, 1);
    }
    ctx.globalAlpha = 1;

    // Terminal text with glow
    ctx.shadowColor = active ? '#00ff88' : '#00aa44';
    ctx.shadowBlur = active ? 8 : 4;
    ctx.fillStyle = active ? '#00ff88' : '#00aa44';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';

    const lines = [
      '> SYSTEM: ONLINE',
      '> AUTH: GRANTED',
      '> STATUS: READY',
      '> CMD: _'
    ];

    lines.forEach((line, idx) => {
      ctx.fillText(line, x + padding + 6, y + padding + 18 + idx * 14);
    });

    ctx.shadowBlur = 0;

    // Power indicator panel
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x + w - 20, y + 6, 14, 20);

    // Multiple status LEDs
    const ledColors = active
      ? ['#00ff00', '#00ffff', '#00ff00']
      : ['#003300', '#003333', '#003300'];

    ledColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(x + w - 17, y + 9 + i * 6, 8, 4);
      if (active) {
        ctx.fillStyle = color + '88';
        ctx.fillRect(x + w - 18, y + 8 + i * 6, 10, 6);
      }
    });

    // Screen glare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(x + padding, y + padding, w - padding * 2, (monitorH - padding * 2) / 3);
  }
};

export const DoorSprite = {
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, active: boolean) {
    const isHorizontal = w > h;
    const opening = active ? 12 : 0;

    // Door frame with depth
    ctx.fillStyle = '#0f1f2f';
    ctx.fillRect(x, y, w, h);

    // Frame edges
    ctx.fillStyle = '#1a2a3a';
    if (isHorizontal) {
      ctx.fillRect(x, y, w, 6);
      ctx.fillRect(x, y + h - 6, w, 6);
    } else {
      ctx.fillRect(x, y, 6, h);
      ctx.fillRect(x + w - 6, y, 6, h);
    }

    // Door panels with texture
    if (isHorizontal) {
      // Left panel
      const leftGrad = ctx.createLinearGradient(x, y, x + w / 2, y);
      leftGrad.addColorStop(0, '#2a3a4a');
      leftGrad.addColorStop(1, '#3a4a5a');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(x + 10 - opening, y + 10, w / 2 - 20, h - 20);

      // Panel segments
      ctx.fillStyle = '#1a2a3a';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 12 - opening, y + 12 + i * ((h - 24) / 3), w / 2 - 24, 2);
      }

      // Right panel
      const rightGrad = ctx.createLinearGradient(x + w / 2, y, x + w, y);
      rightGrad.addColorStop(0, '#3a4a5a');
      rightGrad.addColorStop(1, '#2a3a4a');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(x + w / 2 + 10 + opening, y + 10, w / 2 - 20, h - 20);

      // Panel segments
      ctx.fillStyle = '#1a2a3a';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + w / 2 + 12 + opening, y + 12 + i * ((h - 24) / 3), w / 2 - 24, 2);
      }

      // Center gap glow
      if (active) {
        const gapGlow = ctx.createLinearGradient(x + w / 2 - 10, y, x + w / 2 + 10, y);
        gapGlow.addColorStop(0, 'rgba(0, 255, 255, 0)');
        gapGlow.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
        gapGlow.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = gapGlow;
        ctx.fillRect(x + w / 2 - 10, y + 10, 20, h - 20);
      }
    } else {
      // Vertical door (same logic)
      ctx.fillStyle = '#2a3a4a';
      ctx.fillRect(x + 10, y + 10 - opening, w - 20, h / 2 - 20);
      ctx.fillRect(x + 10, y + h / 2 + 10 + opening, w - 20, h / 2 - 20);
    }

    // Control panel with detail
    const panelSize = 24;
    const panelX = x + w / 2 - panelSize / 2;
    const panelY = y + h / 2 - panelSize / 2;

    ctx.fillStyle = '#000000';
    ctx.fillRect(panelX, panelY, panelSize, panelSize);

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(panelX + 2, panelY + 2, panelSize - 4, panelSize - 4);

    // Status indicator
    ctx.fillStyle = active ? '#00ff00' : '#ff3300';
    ctx.fillRect(panelX + 6, panelY + 6, 12, 12);

    if (active) {
      ctx.fillStyle = '#88ff88';
      ctx.fillRect(panelX + 8, panelY + 8, 8, 8);
    }

    // Control buttons
    ctx.fillStyle = '#333333';
    ctx.fillRect(panelX + 6, panelY + 20, 4, 2);
    ctx.fillRect(panelX + 14, panelY + 20, 4, 2);

    // Panel border
    ctx.strokeStyle = active ? '#00ffff' : '#3a5a6a';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelSize, panelSize);

    // Glowing border when active
    if (active) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 4;
      ctx.strokeRect(panelX - 2, panelY - 2, panelSize + 4, panelSize + 4);
    }
  }
};
