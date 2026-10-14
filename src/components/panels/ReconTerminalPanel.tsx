import React, { useState } from 'react';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
}

const ReconTerminalPanel: React.FC<PanelProps> = () => {
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setScanComplete(true);
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">RECONNAISSANCE FRAMEWORK</span>
        <span className="terminal-status">● READY</span>
      </div>

      <div className="terminal-content">
        <h2>Red Team Laboratory</h2>
        <p>Offensive security research and penetration testing operations.</p>

        <div className="recon-section">
          <h3>Reconnaissance Simulation</h3>
          <p className="warning-text">
            ⚠ Educational simulation only. No actual attacks are executed.
          </p>

          {!scanComplete ? (
            <div className="scan-interface">
              <div className="scan-target">
                <label>Target (Simulated):</label>
                <input
                  type="text"
                  value="testlab.internal"
                  readOnly
                  className="scan-input"
                />
              </div>
              <button className="scan-button" onClick={handleScan}>
                RUN RECONNAISSANCE SCAN
              </button>
            </div>
          ) : (
            <div className="scan-results">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span> ./recon_framework.sh testlab.internal
              </div>
              <div className="scan-output">
                <div>Starting reconnaissance scan...</div>
                <div>Phase 1: OSINT Collection ..................... [OK]</div>
                <div>Phase 2: Subdomain Enumeration ................ [OK]</div>
                <div>Phase 3: Port Scanning ........................ [OK]</div>
                <div>Phase 4: Service Detection .................... [OK]</div>
                <div>Phase 5: Vulnerability Assessment ............. [OK]</div>
                <div className="success-line">
                  <br />
                  Scan complete. 3 potential vulnerabilities identified.
                </div>
              </div>

              <div className="findings">
                <h4>Findings (Simulated):</h4>
                <ul>
                  <li>Open port 445 (SMB) - Consider restricting access</li>
                  <li>Outdated Apache version detected - Recommend update</li>
                  <li>Default credentials found on test service</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="redteam-projects">
          <h3>Red Team Tools & Projects</h3>
          <ul>
            <li>Custom reconnaissance automation framework</li>
            <li>OSINT gathering and information analysis</li>
            <li>Web application security testing</li>
            <li>Network penetration testing methodologies</li>
            <li>Bug bounty research and vulnerability disclosure</li>
          </ul>

          <div className="achievements">
            <h4>Certifications & Achievements:</h4>
            <div className="cert-badges">
              <span className="cert-badge">HackTheBox</span>
              <span className="cert-badge">TryHackMe</span>
            </div>
          </div>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> Red Team Operations Completed: +200 XP
        </div>
      </div>
    </div>
  );
};

export default ReconTerminalPanel;
