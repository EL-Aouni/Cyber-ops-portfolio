import React, { useState } from 'react';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
}

const SIEMStationPanel: React.FC<PanelProps> = () => {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  const alerts = [
    {
      id: 1,
      severity: 'HIGH',
      title: 'Multiple Failed Authentication Attempts',
      source: '192.168.10.45',
      destination: 'DC01.corp.local',
      description: 'Detected 15 failed login attempts in 3 minutes',
      recommendation: 'Investigate potential brute force attack. Check user account status.',
    },
    {
      id: 2,
      severity: 'CRITICAL',
      title: 'Suspicious PowerShell Execution',
      source: 'WORKSTATION-07',
      destination: '10.0.0.5:4444',
      description: 'Base64 encoded PowerShell detected with outbound connection',
      recommendation: 'Isolate endpoint immediately. Check for potential malware or C2 communication.',
    },
    {
      id: 3,
      severity: 'MEDIUM',
      title: 'Unusual Data Transfer Volume',
      source: 'FILE-SERVER-02',
      destination: 'External IP: 203.0.113.42',
      description: 'Large data transfer detected outside business hours',
      recommendation: 'Verify if authorized. Check file access logs and user activity.',
    },
  ];

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">SIEM ANALYSIS STATION</span>
        <span className="terminal-status">● ACTIVE ALERTS: {alerts.length}</span>
      </div>

      <div className="terminal-content">
        <h2>Security Alert Investigation</h2>
        <p>Analyze security events and investigate potential threats using SIEM correlation rules.</p>

        <div className="alert-list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item severity-${alert.severity.toLowerCase()} ${
                selectedAlert === alert.id ? 'selected' : ''
              }`}
              onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
            >
              <div className="alert-header">
                <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                  {alert.severity}
                </span>
                <span className="alert-title">{alert.title}</span>
              </div>

              {selectedAlert === alert.id && (
                <div className="alert-details">
                  <div className="detail-row">
                    <span className="detail-label">Source:</span>
                    <span className="detail-value">{alert.source}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Destination:</span>
                    <span className="detail-value">{alert.destination}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{alert.description}</span>
                  </div>
                  <div className="recommendation-box">
                    <strong>Recommended Action:</strong>
                    <p>{alert.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="siem-projects">
          <h3>Mohammed's SIEM Projects</h3>
          <ul>
            <li>Wazuh SIEM deployment with custom detection rules</li>
            <li>Threat intelligence enrichment using MISP platform</li>
            <li>Security automation with TheHive incident response</li>
            <li>Log aggregation and correlation for enterprise infrastructure</li>
          </ul>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> Security Alert Investigated: +150 XP
        </div>
      </div>
    </div>
  );
};

export default SIEMStationPanel;
