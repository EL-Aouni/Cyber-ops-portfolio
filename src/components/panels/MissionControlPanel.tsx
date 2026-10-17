import React, { useEffect } from 'react';
import type { GameState } from '../../types/game';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  gameState: GameState;
  onMissionComplete?: (missionId: string) => void;
}

const MissionControlPanel: React.FC<PanelProps> = ({ gameState, onMissionComplete }) => {
  useEffect(() => {
    if (onMissionComplete) {
      onMissionComplete('mission-5');
    }
  }, [onMissionComplete]);

  const rankNames: { [key: number]: string } = {
    1: 'Novice Operator',
    2: 'SOC Analyst',
    3: 'Threat Hunter',
    4: 'Red Team Specialist',
    5: 'Master Cyber Ops Engineer',
  };

  const currentRank = rankNames[gameState.player.level] || 'Cyber Specialist';

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">OPERATOR DOSSIER // MISSION CONTROL</span>
        <span className="terminal-status">● AUTHENTICATED // CLEARANCE: LEVEL {gameState.player.level}</span>
      </div>

      <div className="terminal-content">
        <div className="profile-header">
          <h1>MOHAMMED EL-AOUNI</h1>
          <div className="profile-subtitle">Cybersecurity Engineering Student — {currentRank.toUpperCase()}</div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">{gameState.totalXP}</div>
            <div className="stat-label">Total Operator XP</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#00ff88' }}>LVL {gameState.player.level}</div>
            <div className="stat-label">{currentRank}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {gameState.completedMissions.length}/{gameState.missions.length}
            </div>
            <div className="stat-label">Missions Complete</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{gameState.discoveredLocations.length}/5</div>
            <div className="stat-label">Sectors Discovered</div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Education & Academic Foundation</h3>
          <div className="education-card">
            <div className="edu-institution">École Nationale des Sciences Appliquées (ENSA)</div>
            <div className="edu-degree">State Engineering Degree in Cybersecurity (PFE Candidate)</div>
            <div className="edu-location">Oujda, Morocco</div>
            <div style={{ color: '#88ffff', marginTop: '8px', fontSize: '13px' }}>
              Rigorous 5-year engineering training encompassing applied cryptography, network security architectures,
              reverse engineering, penetration testing, and enterprise systems security.
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Interactive Technical Skill Matrix</h3>

          <div className="skills-category">
            <h4>🛡️ Security Operations & Defense (SOC / Blue Team)</h4>
            <div className="skill-tags">
              <span className="skill-tag">Wazuh SIEM & XDR</span>
              <span className="skill-tag">Splunk Enterprise</span>
              <span className="skill-tag">MISP Threat Intel</span>
              <span className="skill-tag">TheHive SOAR</span>
              <span className="skill-tag">Sysmon Telemetry</span>
              <span className="skill-tag">Incident Triage</span>
              <span className="skill-tag">Log Analysis</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>⚔️ Offensive Security & Vulnerability Assessment (Red Team)</h4>
            <div className="skill-tags">
              <span className="skill-tag">Penetration Testing</span>
              <span className="skill-tag">Network Scanning (Nmap)</span>
              <span className="skill-tag">OSINT Automation</span>
              <span className="skill-tag">Web Security (OWASP Top 10)</span>
              <span className="skill-tag">Burp Suite Professional</span>
              <span className="skill-tag">Privilege Escalation</span>
              <span className="skill-tag">Bug Bounty Research</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>🏢 Enterprise Systems & Identity Security</h4>
            <div className="skill-tags">
              <span className="skill-tag">Active Directory Domain Services</span>
              <span className="skill-tag">Windows Server 2022 Hardening</span>
              <span className="skill-tag">Group Policy (GPO) Architecture</span>
              <span className="skill-tag">Kerberos & NTLM Security</span>
              <span className="skill-tag">Linux Enterprise Administration</span>
              <span className="skill-tag">Network Segmentation & Firewalls</span>
            </div>
          </div>

          <div className="skills-category">
            <h4>💻 Development & Security Automation</h4>
            <div className="skill-tags">
              <span className="skill-tag">Python (Tooling & Automation)</span>
              <span className="skill-tag">PowerShell Scripting</span>
              <span className="skill-tag">Bash / Shell Automation</span>
              <span className="skill-tag">Git / GitHub CI/CD</span>
              <span className="skill-tag">Docker & Virtualization</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Certifications & Practical Platforms</h3>
          <div className="cert-badges">
            <span className="cert-badge">HackTheBox Active Pentester</span>
            <span className="cert-badge">TryHackMe Top Security Operator</span>
            <span className="cert-badge">Practical SOC & SIEM Implementation</span>
            <span className="cert-badge">Cisco Network Security Concepts</span>
          </div>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> Mission 5 Complete: Operator Profile Dossier Authenticated (+150 XP)!
        </div>
      </div>
    </div>
  );
};

export default MissionControlPanel;
