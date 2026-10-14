import React from 'react';
import './IntroScreen.css';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="intro-badge">PORTFOLIO EXPERIENCE</div>
        <h1 className="intro-title">CYBER OPS</h1>
        <div className="intro-subtitle">MOHAMMED'S SECURITY MISSION</div>

        <div className="intro-description">
          <p>
            Welcome to the virtual Security Operations Center. You are about to explore
            the cybersecurity portfolio of <strong>Mohammed El-Aouni</strong>,
            Cybersecurity Engineering Student at ENSA Oujda.
          </p>
          <p>
            Navigate through different rooms to discover SOC/SIEM projects, Red Team tools,
            security research, and technical skills.
          </p>
        </div>

        <div className="intro-instructions">
          <h3>CONTROLS</h3>
          <div className="instruction-grid">
            <div className="instruction-item">
              <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
              <span>Move Operator</span>
            </div>
            <div className="instruction-item">
              <kbd>E</kbd> or <kbd>SPACE</kbd>
              <span>Interact with Terminals</span>
            </div>
            <div className="instruction-item">
              <kbd>ESC</kbd>
              <span>Pause / Menu</span>
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
          <span>Seeking Cybersecurity PFE Internship</span>
          <span>•</span>
          <span>Interactive Browser Experience</span>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
