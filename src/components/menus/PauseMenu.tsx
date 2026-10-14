import React from 'react';
import './PauseMenu.css';

interface PauseMenuProps {
  onRestart: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onRestart }) => {
  return (
    <div className="pause-menu">
      <div className="pause-content">
        <h2 className="pause-title">MISSION PAUSED</h2>

        <div className="pause-options">
          <button className="menu-button" onClick={onRestart}>
            <span>RESTART SIMULATION</span>
          </button>
          <button className="menu-button secondary" onClick={() => window.open('https://github.com/Spinoza-ao', '_blank')}>
            <span>GITHUB PROFILE</span>
          </button>
          <button className="menu-button secondary" onClick={() => window.open('https://linkedin.com', '_blank')}>
            <span>LINKEDIN PROFILE</span>
          </button>
        </div>

        <div className="pause-hint">
          Press <kbd>ESC</kbd> to resume operations
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
