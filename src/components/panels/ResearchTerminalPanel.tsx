import React from 'react';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
}

const ResearchTerminalPanel: React.FC<PanelProps> = () => {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">SECURITY RESEARCH LAB</span>
        <span className="terminal-status">● SYSTEMS ONLINE</span>
      </div>

      <div className="terminal-content">
        <h2>Cybersecurity Research & Lab Environments</h2>

        <div className="lab-environment">
          <h3>Active Directory Lab Environment</h3>
          <p>
            Comprehensive enterprise security lab featuring Windows Server infrastructure,
            Active Directory domain services, and security monitoring solutions.
          </p>

          <div className="infrastructure-diagram">
            <div className="infra-section">
              <h4>Domain Controllers</h4>
              <ul>
                <li>Windows Server 2022 - Primary DC</li>
                <li>Active Directory Domain Services</li>
                <li>Group Policy Management</li>
                <li>DNS & DHCP Services</li>
              </ul>
            </div>

            <div className="infra-section">
              <h4>Security Monitoring</h4>
              <ul>
                <li>Wazuh Agent Deployment</li>
                <li>Windows Event Log Collection</li>
                <li>Sysmon for Enhanced Logging</li>
                <li>Centralized Log Aggregation</li>
              </ul>
            </div>

            <div className="infra-section">
              <h4>Testing Infrastructure</h4>
              <ul>
                <li>Exchange Server Configuration</li>
                <li>File Server with Audit Policies</li>
                <li>Workstation Fleet Management</li>
                <li>Network Segmentation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="research-projects">
          <h3>Research Focus Areas</h3>

          <div className="research-card">
            <h4>Security Event Correlation</h4>
            <p>
              Developing advanced correlation rules for detecting lateral movement,
              privilege escalation, and suspicious authentication patterns in Active Directory.
            </p>
          </div>

          <div className="research-card">
            <h4>Threat Hunting Methodologies</h4>
            <p>
              Proactive threat hunting using behavioral analytics, anomaly detection,
              and threat intelligence integration across enterprise environments.
            </p>
          </div>

          <div className="research-card">
            <h4>Security Automation</h4>
            <p>
              Building automated response workflows for common security incidents,
              reducing mean time to respond (MTTR) through orchestration.
            </p>
          </div>
        </div>

        <div className="lab-tech">
          <h3>Lab Technologies</h3>
          <div className="tech-list">
            <span className="tech-tag">Windows Server</span>
            <span className="tech-tag">Active Directory</span>
            <span className="tech-tag">Exchange Server</span>
            <span className="tech-tag">Wazuh</span>
            <span className="tech-tag">Sysmon</span>
            <span className="tech-tag">PowerShell</span>
            <span className="tech-tag">VirtualBox</span>
            <span className="tech-tag">Network Packet Analysis</span>
          </div>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> Research Lab Accessed: +250 XP
        </div>
      </div>
    </div>
  );
};

export default ResearchTerminalPanel;
