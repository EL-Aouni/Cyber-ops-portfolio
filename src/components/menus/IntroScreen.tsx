import React from 'react';
import './IntroScreen.css';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="intro-badge">CYBERSECURITY RPG PORTFOLIO</div>
        <h1 className="intro-title">CYBER OPS</h1>
        <div className="intro-subtitle">OPERATOR DOSSIER // MOHAMMED EL-AOUNI</div>

        <div className="intro-description">
          <p>
            Welcome to the virtual Security Operations Complex. Explore the cybersecurity engineering
            portfolio of <strong>Mohammed El-Aouni</strong> (ENSA Oujda), featuring real interactive
            threat triage, SIEM breach protocols, offensive CLI sandboxes, and Active Directory defense matrices.
          </p>
          <p>
            Eliminate rogue malware bots, crack cyber loot chests, level up your clearance rank,
            and establish recruitment dispatch for Mohammed's upcoming <strong>PFE Internship</strong>.
          </p>
        </div>

        <div className="intro-instructions">
          <h3>TACTICAL CONTROLS</h3>
          <div className="instruction-grid">
            <div className="instruction-item">
              <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></div>
              <span>Move Operator</span>
            </div>
            <div className="instruction-item">
              <div><kbd>SPACE</kbd> / <kbd>F</kbd></div>
              <span>Fire Cyber EMP Blast</span>
            </div>
            <div className="instruction-item">
              <div><kbd>E</kbd></div>
              <span>Interact / Open Chests</span>
            </div>
            <div className="instruction-item">
              <div><kbd>ESC</kbd></div>
              <span>Pause / Close Panel</span>
            </div>
          </div>
        </div>

        <div className="intro-actions">
          <button className="start-button" onClick={onStart}>
            <span>ENTER CYBER OPS</span>
            <span className="button-glow"></span>
          </button>
        </div>

        <div className="intro-footer">
          <span>Available for PFE Graduation Internship (2025/2026)</span>
          <span>•</span>
          <span>Interactive 2D Retro Cyber RPG</span>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
