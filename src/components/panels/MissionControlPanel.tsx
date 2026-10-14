import React from 'react';
import type { GameState } from '../../types/game';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  gameState: GameState;
}

const MissionControlPanel: React.FC<PanelProps> = ({ gameState }) => {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">OPERATOR PROFILE // MISSION CONTROL</span>
        <span className="terminal-status">● AUTHENTICATED</span>
      </div>

      <div className="terminal-content">
        <div className="profile-header">
          <h1>MOHAMMED EL-AOUNI</h1>
          <div className="profile-subtitle">Cybersecurity Engineering Student</div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">{gameState.totalXP}</div>
            <div className="stat-label">Total XP Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{gameState.completedMissions.length}/{gameState.missions.length}</div>
            <div className="stat-label">Missions Complete</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{gameState.discoveredLocations.length}</div>
            <div className="stat-label">Areas Discovered</div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          <div className="education-card">
            <div className="edu-institution">École Nationale des Sciences Appliquées (ENSA)</div>
            <div className="edu-degree">Cybersecurity Engineering</div>
            <div className="edu-location">Oujda, Morocco</div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Technical Skills</h3>

          <div className="skills-category">
            <h4>Security Operations</h4>
            <div className="skill-tags">
              <span className="skill-tag">SIEM (Wazuh, Splunk)</span>
              <span className="skill-tag">Incident Response</span>
              <span className="skill-tag">Threat Intelligence</span>
              <span className="skill-tag">SOC Operations</span>
              <span className="skill-tag">Security Monitoring</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>Offensive Security</h4>
            <div className="skill-tags">
              <span className="skill-tag">Penetration Testing</span>
              <span className="skill-tag">OSINT</span>
              <span className="skill-tag">Reconnaissance</span>
              <span className="skill-tag">Web App Security</span>
              <span className="skill-tag">Network Security</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>Infrastructure & Tools</h4>
            <div className="skill-tags">
              <span className="skill-tag">Active Directory</span>
              <span className="skill-tag">Windows Server</span>
              <span className="skill-tag">Linux Administration</span>
              <span className="skill-tag">Network Configuration</span>
              <span className="skill-tag">Virtualization</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>Development</h4>
            <div className="skill-tags">
              <span className="skill-tag">Python</span>
              <span className="skill-tag">PowerShell</span>
              <span className="skill-tag">Bash Scripting</span>
              <span className="skill-tag">Automation</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Certifications & Training</h3>
          <ul>
            <li>HackTheBox Certified User</li>
            <li>TryHackMe Security Training</li>
            <li>Practical SOC & SIEM Implementation</li>
            <li>Network Security & Cisco Packet Tracer</li>
          </ul>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> Operator Profile Reviewed: +150 XP
        </div>
      </div>
    </div>
  );
};

export default MissionControlPanel;
