import React from 'react';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
}

const SOCTerminalPanel: React.FC<PanelProps> = () => {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">operator@cyberops:~$</span>
        <span className="terminal-status">● CONNECTED</span>
      </div>

      <div className="terminal-content">
        <div className="terminal-line">
          <span className="terminal-prompt">$</span> cat soc_overview.txt
        </div>
        <div className="terminal-output">
          <h2>Security Operations Center</h2>
          <p>
            Welcome to the SOC - the nerve center of cybersecurity operations.
            This facility monitors, detects, analyzes, and responds to cybersecurity incidents
            in real-time using a combination of technology solutions and strong processes.
          </p>

          <h3>Core Capabilities</h3>
          <ul>
            <li>24/7 Security Monitoring & Event Correlation</li>
            <li>Real-time Threat Detection & Analysis</li>
            <li>Incident Response & Investigation</li>
            <li>Threat Intelligence Integration</li>
            <li>Security Automation & Orchestration</li>
          </ul>

          <h3>Technologies Used</h3>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-name">Wazuh</div>
              <div className="tech-desc">Open-source SIEM & XDR platform</div>
            </div>
            <div className="tech-card">
              <div className="tech-name">Splunk</div>
              <div className="tech-desc">Security information & event management</div>
            </div>
            <div className="tech-card">
              <div className="tech-name">MISP</div>
              <div className="tech-desc">Threat intelligence sharing platform</div>
            </div>
            <div className="tech-card">
              <div className="tech-name">TheHive</div>
              <div className="tech-desc">Security incident response platform</div>
            </div>
          </div>

          <div className="mission-complete">
            <span className="checkmark">✓</span> Mission Objective Complete: +100 XP
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOCTerminalPanel;
