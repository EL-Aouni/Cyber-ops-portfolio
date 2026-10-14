import { useRef, useState, useEffect } from 'react';
import type { TouchEvent } from 'react';
import './MobileControls.css';

interface MobileControlsProps {
  onJoystick: (direction: { x: number; y: number } | null) => void;
  onInteract: (pressed: boolean) => void;
}

const MobileControls = ({ onJoystick, onInteract }: MobileControlsProps) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  const handleJoystickStart = (e: TouchEvent) => {
    e.preventDefault();
    setJoystickActive(true);
  };

  const handleJoystickMove = (e: TouchEvent) => {
    if (!joystickActive || !joystickRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;

    const maxDistance = 40;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    setJoystickPosition({ x: dx, y: dy });

    const normalizedX = dx / maxDistance;
    const normalizedY = dy / maxDistance;

    onJoystick({ x: normalizedX, y: normalizedY });
  };

  const handleJoystickEnd = () => {
    setJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
    onJoystick(null);
  };

  const handleInteractStart = (e: TouchEvent) => {
    e.preventDefault();
    onInteract(true);
  };

  const handleInteractEnd = (e: TouchEvent) => {
    e.preventDefault();
    onInteract(false);
  };

  useEffect(() => {
    return () => {
      onJoystick(null);
      onInteract(false);
    };
  }, []);

  return (
    <div className="mobile-controls">
      {/* Joystick */}
      <div
        ref={joystickRef}
        className="joystick-container"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div className="joystick-base">
          <div
            className="joystick-stick"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
            }}
          />
        </div>
      </div>

      {/* Interact Button */}
      <button
        className="interact-button"
        onTouchStart={handleInteractStart}
        onTouchEnd={handleInteractEnd}
      >
        <span>E</span>
      </button>
    </div>
  );
};

export default MobileControls;
