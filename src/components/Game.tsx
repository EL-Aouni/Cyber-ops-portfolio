import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/systems/GameEngine';
import { Renderer } from '../game/systems/Renderer';
import { InputManager } from '../game/utils/input';
import type { GameState } from '../types/game';
import HUD from './hud/HUD';
import PauseMenu from './menus/PauseMenu';
import PanelOverlay from './panels/PanelOverlay';
import MobileControls from './hud/MobileControls';
import IntroScreen from './menus/IntroScreen';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const inputRef = useRef<InputManager | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    if (!canvasRef.current) return;

    // Initialize game systems
    const engine = new GameEngine((state) => setGameState(state));
    const renderer = new Renderer(canvasRef.current);
    const input = new InputManager();

    engineRef.current = engine;
    rendererRef.current = renderer;
    inputRef.current = input;

    setGameState(engine.getState());

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        const width = Math.min(window.innerWidth, 1200);
        const height = Math.min(window.innerHeight - 100, 700);
        renderer.resize(width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Game loop
    const gameLoop = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min(currentTime - lastTimeRef.current, 100);
      lastTimeRef.current = currentTime;

      const currentState = engine.getState();
      const inputState = input.getInputState();

      // Handle pause toggle
      if (inputState.escape) {
        engine.togglePause();
        input.resetEscape();
      }

      // Update game
      engine.update(deltaTime, inputState);

      // Render
      const currentRoom = engine.getCurrentRoom();
      if (currentRoom) {
        renderer.render(currentState, currentRoom);
      }

      // Reset one-time inputs
      input.resetInteract();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartGame = () => {
    setShowIntro(false);
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.resetProgress();
      setShowIntro(true);
    }
  };

  const handleClosePanel = () => {
    if (engineRef.current) {
      engineRef.current.closePanel();
    }
  };

  const handleJoystick = (direction: { x: number; y: number } | null) => {
    if (inputRef.current) {
      inputRef.current.setMobileJoystick(direction);
    }
  };

  const handleMobileInteract = (pressed: boolean) => {
    if (inputRef.current) {
      inputRef.current.setMobileInteract(pressed);
    }
  };

  if (!gameState) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e1a',
        color: '#00ffff',
        fontFamily: 'monospace',
      }}>
        Initializing CYBER OPS...
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {showIntro && <IntroScreen onStart={handleStartGame} />}

      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            border: '2px solid #00ffff',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            display: 'block',
          }}
        />

        <HUD gameState={gameState} />

        {gameState.isPaused && <PauseMenu onRestart={handleRestart} />}

        {gameState.activePanel && (
          <PanelOverlay
            panelId={gameState.activePanel}
            onClose={handleClosePanel}
            gameState={gameState}
          />
        )}

        {isMobile && (
          <MobileControls
            onJoystick={handleJoystick}
            onInteract={handleMobileInteract}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
