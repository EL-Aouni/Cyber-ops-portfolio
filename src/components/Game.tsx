import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/systems/GameEngine';
import { EnhancedRenderer } from '../game/systems/EnhancedRenderer';
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
  const rendererRef = useRef<EnhancedRenderer | null>(null);
  const inputRef = useRef<InputManager | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [initialized, setInitialized] = useState(false);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if mobile
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    // Wait for canvas to be ready
    const initGame = () => {
      try {
        if (!canvasRef.current) {
          console.error('Canvas ref is null');
          return;
        }

        console.log('Initializing game systems...');

        // Initialize game systems
        const engine = new GameEngine((state) => {
          setGameState(state);
        });

        const renderer = new EnhancedRenderer(canvasRef.current);
        const input = new InputManager();

        engineRef.current = engine;
        rendererRef.current = renderer;
        inputRef.current = input;

        setGameState(engine.getState());
        setInitialized(true);
        console.log('Game initialized successfully');

        // Handle resize
        const handleResize = () => {
          if (canvasRef.current && rendererRef.current) {
            const width = Math.min(window.innerWidth, 1200);
            const height = Math.min(window.innerHeight - 100, 700);
            rendererRef.current.resize(width, height);
          }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Game loop
        const gameLoop = (currentTime: number) => {
          if (!engineRef.current || !rendererRef.current || !inputRef.current) return;

          if (!lastTimeRef.current) lastTimeRef.current = currentTime;
          const deltaTime = Math.min(currentTime - lastTimeRef.current, 100);
          lastTimeRef.current = currentTime;

          const currentState = engineRef.current.getState();
          const inputState = inputRef.current.getInputState();

          // Handle escape key for pause menu OR closing panels
          if (inputState.escape) {
            if (currentState.activePanel) {
              engineRef.current.closePanel();
            } else {
              engineRef.current.togglePause();
            }
            inputRef.current.resetEscape();
          }

          // Handle interact/close for panels (E, Space, Enter)
          if (inputState.interact && currentState.activePanel) {
            engineRef.current.closePanel();
            inputRef.current.resetInteract();
          }

          // Update game
          engineRef.current.update(deltaTime, inputState);

          // Render (always render even if paused)
          const currentRoom = engineRef.current.getCurrentRoom();
          if (currentRoom) {
            rendererRef.current.render(currentState, currentRoom);
          }

          // Reset one-time inputs AFTER everything
          inputRef.current.resetInteract();

          animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
          cancelAnimationFrame(animationFrameRef.current);
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error('Game initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize game');
      }
    };

    // Small delay to ensure canvas is mounted
    const timer = setTimeout(initGame, 100);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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

  if (error) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e1a',
          color: '#ff5555',
          fontFamily: 'monospace',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>⚠ Initialization Error</div>
        <div style={{ color: '#ffaa55' }}>{error}</div>
        <div style={{ color: '#88ffff', marginTop: '20px', fontSize: '14px' }}>
          Please check the browser console for details.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!initialized && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0e1a',
            color: '#00ffff',
            fontFamily: 'monospace',
            fontSize: '18px',
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>⚡ Initializing CYBER OPS...</div>
            <div style={{ fontSize: '14px', color: '#88ffff' }}>Loading security systems</div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          style={{
            border: '2px solid #00ffff',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            display: initialized ? 'block' : 'none',
          }}
        />

        {gameState && showIntro && (
          <IntroScreen onStart={handleStartGame} />
        )}

        {gameState && <HUD gameState={gameState} />}

        {gameState?.isPaused && (
          <PauseMenu onRestart={handleRestart} />
        )}

        {gameState?.activePanel && (
          <PanelOverlay
            panelId={gameState.activePanel}
            onClose={handleClosePanel}
            gameState={gameState}
          />
        )}

        {isMobile && gameState && (
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
