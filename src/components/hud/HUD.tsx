import { useState } from 'react';
import type { GameState } from '../../types/game';
import MissionTracker from './MissionTracker';
import Minimap from './Minimap';
import { soundFX } from '../../game/utils/sound';
import './HUD.css';

interface HUDProps {
  gameState: GameState;
  onDismissLore?: () => void;
}

const rankNames: { [key: number]: string } = {
  1: 'Novice Operator',
  2: 'SOC Analyst',
  3: 'Threat Hunter',
  4: 'Red Team Specialist',
  5: 'Cyber Ops Engineer',
};

const HUD = ({ gameState, onDismissLore }: HUDProps) => {
  const [musicActive, setMusicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());

  const currentRoom = gameState.currentRoom;
  const roomName = currentRoom
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const completedCount = gameState.completedMissions.length;
  const totalMissions = gameState.missions.length;
  const progress = Math.round((completedCount / totalMissions) * 100);

  const player = gameState.player;
  const playerRank = rankNames[player.level] || 'Cyber Specialist';

  const toggleMusic = () => {
    if (musicActive) {
      soundFX.stopMusic();
      setMusicActive(false);
    } else {
      soundFX.startMusic();
      setMusicActive(true);
    }
  };

  const toggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="hud">
      {/* Top Bar */}
      <div className="hud-top">
        <div className="hud-location">
          <div className="hud-label">CURRENT SECTOR</div>
          <div className="hud-value">{roomName}</div>
        </div>

        <div className="hud-rank">
          <div className="hud-label">OPERATOR CLEARANCE</div>
          <div className="hud-value" style={{ color: '#00ff88' }}>
            LVL {player.level} // {playerRank}
          </div>
        </div>

        {/* Shield and Health Bars */}
        <div className="hud-meters">
          <div className="meter-row">
            <span className="meter-label">SHIELD</span>
            <div className="meter-track">
              <div
                className="meter-fill fill-shield"
                style={{ width: `${(player.shield / player.maxShield) * 100}%` }}
              />
            </div>
            <span className="meter-num">{Math.round(player.shield)}</span>
          </div>

          <div className="meter-row">
            <span className="meter-label">HEALTH</span>
            <div className="meter-track">
              <div
                className="meter-fill fill-health"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
            <span className="meter-num">{Math.round(player.health)}</span>
          </div>
        </div>

        <div className="hud-xp">
          <div className="hud-label">TOTAL XP</div>
          <div className="hud-value">{gameState.totalXP}</div>
        </div>

        <div className="hud-progress">
          <div className="hud-label">MISSION PROGRESS</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <span className="progress-text">{progress}%</span>
          </div>
        </div>

        {/* Audio / Music Controls */}
        <div className="hud-audio-controls">
          <button
            className={`audio-toggle-btn ${musicActive ? 'btn-music-on' : ''}`}
            onClick={toggleMusic}
            title="Toggle Retro Synthwave Music"
          >
            {musicActive ? '🎵 SYNTH: ON' : '🔈 SYNTH: OFF'}
          </button>
          <button
            className="audio-toggle-btn"
            onClick={toggleMute}
            title="Toggle All Sound"
          >
            {isMuted ? '🔇 MUTED' : '🔊 SFX ON'}
          </button>
        </div>
      </div>

      {/* Radar Minimap */}
      <Minimap gameState={gameState} />

      {/* Mission Tracker */}
      <MissionTracker missions={gameState.missions} />

      {/* Lore Datapad Notification Modal */}
      {gameState.recentLore && (
        <div className="hud-lore-notification">
          <div className="lore-header">
            <span className="lore-icon">💾</span>
            <span className="lore-title">{gameState.recentLore.title}</span>
            <button className="lore-close-btn" onClick={onDismissLore}>
              ✕
            </button>
          </div>
          <div className="lore-body">{gameState.recentLore.text}</div>
        </div>
      )}

      {/* Controls Help */}
      <div className="hud-controls">
        <span><kbd>WASD / ARROWS</kbd> Move</span>
        <span><kbd>SPACE / F</kbd> EMP Blast</span>
        <span><kbd>E</kbd> Interact / Hack</span>
        <span><kbd>ESC</kbd> Pause</span>
      </div>
    </div>
  );
};

export default HUD;
