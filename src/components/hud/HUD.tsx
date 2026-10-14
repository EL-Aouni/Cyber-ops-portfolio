import type { GameState } from '../../types/game';
import MissionTracker from './MissionTracker';
import './HUD.css';

interface HUDProps {
  gameState: GameState;
}

const HUD = ({ gameState }: HUDProps) => {
  const currentRoom = gameState.currentRoom;
  const roomName = currentRoom.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const completedCount = gameState.completedMissions.length;
  const totalMissions = gameState.missions.length;
  const progress = Math.round((completedCount / totalMissions) * 100);

  return (
    <div className="hud">
      {/* Top Bar */}
      <div className="hud-top">
        <div className="hud-location">
          <div className="hud-label">LOCATION</div>
          <div className="hud-value">{roomName}</div>
        </div>

        <div className="hud-xp">
          <div className="hud-label">TOTAL XP</div>
          <div className="hud-value">{gameState.totalXP}</div>
        </div>

        <div className="hud-progress">
          <div className="hud-label">PROGRESS</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Mission Tracker */}
      <MissionTracker missions={gameState.missions} />

      {/* Controls Help */}
      <div className="hud-controls">
        <span><kbd>WASD</kbd> Move</span>
        <span><kbd>E</kbd> Interact</span>
        <span><kbd>ESC</kbd> Pause</span>
      </div>
    </div>
  );
};

export default HUD;
