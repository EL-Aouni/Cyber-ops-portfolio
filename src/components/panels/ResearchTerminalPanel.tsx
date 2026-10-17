import React, { useState } from 'react';
import { soundFX } from '../../game/utils/sound';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  onMissionComplete?: (missionId: string) => void;
}

interface DefenseNode {
  id: string;
  name: string;
  role: string;
  policy: string;
  active: boolean;
  impact: string;
}

const ResearchTerminalPanel: React.FC<PanelProps> = ({ onMissionComplete }) => {
  const [nodes, setNodes] = useState<DefenseNode[]>([
    {
      id: 'dc01',
      name: 'DC01.CORP.LOCAL',
      role: 'Primary Domain Controller',
      policy: 'Enforce Kerberos Armoring (FAST) & Protected Users Group',
      active: false,
      impact: 'Mitigates Pass-the-Hash, Kerberoasting, and offline credential cracking.',
    },
    {
      id: 'laps',
      name: 'WORKSTATION FLEET',
      role: 'Active Directory Endpoints',
      policy: 'Deploy Windows LAPS (Local Admin Password Solution)',
      active: false,
      impact: 'Eliminates shared local administrator passwords across enterprise workstations.',
    },
    {
      id: 'firewall',
      name: 'INTERNAL FIREWALL',
      role: 'Network Segmentation Gateway',
      policy: 'Block Lateral SMB (445) & RPC (135) between Workstation VLANs',
      active: false,
      impact: 'Confines adversaries to initial breach point, blocking worm propagation.',
    },
    {
      id: 'sysmon',
      name: 'SYSMON SENSOR GRID',
      role: 'Endpoint Telemetry',
      policy: 'Enable Event ID 10 (LSASS Memory Read) & Script Block Logging',
      active: false,
      impact: 'Alerts SOC immediately upon Mimikatz LSASS memory dumping attempts.',
    },
  ]);

  const [completed, setCompleted] = useState(false);

  const togglePolicy = (id: string) => {
    soundFX.playInteract();

    const updated = nodes.map((n) => {
      if (n.id === id) {
        return { ...n, active: !n.active };
      }
      return n;
    });

    setNodes(updated);

    const allActive = updated.every((n) => n.active);
    if (allActive && !completed) {
      setCompleted(true);
      soundFX.playHackSuccess();
      if (onMissionComplete) {
        onMissionComplete('mission-4');
      }
    }
  };

  const activeCount = nodes.filter((n) => n.active).length;

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">ACTIVE DIRECTORY HARDENING MATRIX</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="terminal-status" style={{ color: activeCount === 4 ? '#00ff88' : '#ffff00' }}>
            DEFENSE COVERS: {activeCount}/4 POLICIES
          </span>
          <span className="terminal-status">● DOMAIN: CORP.LOCAL</span>
        </div>
      </div>

      <div className="terminal-content">
        <h2>Active Directory Defense & Research Lab</h2>
        <p>
          Simulate enterprise identity architecture hardening. An adversary is attempting lateral movement
          using Pass-the-Hash and LSASS memory extraction. Activate defense policies across nodes to establish
          Zero-Trust isolation.
        </p>

        {/* Visual Node Diagram */}
        <div className="ad-topology-grid">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`ad-node-card ${node.active ? 'node-secured' : 'node-vulnerable'}`}
              onClick={() => togglePolicy(node.id)}
            >
              <div className="node-card-header">
                <span className="node-status-dot">{node.active ? '🛡️' : '⚠️'}</span>
                <span className="node-title">{node.name}</span>
                <span className={`node-badge ${node.active ? 'badge-secured' : 'badge-vuln'}`}>
                  {node.active ? 'SECURED' : 'VULNERABLE'}
                </span>
              </div>

              <div className="node-role">{node.role}</div>
              <div className="node-policy">
                <strong>Policy:</strong> {node.policy}
              </div>
              <div className="node-impact">
                <em>Effect:</em> {node.impact}
              </div>

              <button className={`node-toggle-btn ${node.active ? 'btn-active' : ''}`}>
                {node.active ? '✓ POLICY ENFORCED' : '+ DEPLOY DEFENSIVE POLICY'}
              </button>
            </div>
          ))}
        </div>

        {completed && (
          <div className="triage-results" style={{ marginTop: '24px' }}>
            <h2>🎉 ENTERPRISE DOMAIN HARDENING COMPLETE!</h2>
            <div className="final-score-display">
              ACTIVE DIRECTORY FOREST SECURED
            </div>
            <p>
              By establishing LAPS, Kerberos FAST armoring, network isolation, and Sysmon LSASS monitoring,
              you eliminated 99% of lateral movement attack paths in the enterprise environment!
            </p>

            <div className="siem-projects">
              <h3>Mohammed's Enterprise Infrastructure & AD Projects:</h3>
              <ul>
                <li><strong>Enterprise AD Lab:</strong> Deployed Windows Server 2022 Forest with multi-domain trusts, DNS, and DHCP.</li>
                <li><strong>Group Policy Architecture:</strong> Created CIS Benchmark GPO templates for automated server baseline security.</li>
                <li><strong>Sysmon Threat Hunting:</strong> Configured centralized telemetry forwarding to Wazuh SIEM for rapid credential theft discovery.</li>
              </ul>
            </div>

            <div className="mission-complete">
              <span className="checkmark">✓</span> Mission 4 Complete: Threat Intelligence & AD Defense Mastery (+250 XP)!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchTerminalPanel;
