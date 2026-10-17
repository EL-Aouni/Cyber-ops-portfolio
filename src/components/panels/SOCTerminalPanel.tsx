import React, { useState } from 'react';
import { soundFX } from '../../game/utils/sound';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  onMissionComplete?: (missionId: string) => void;
}

interface AlertEvent {
  id: number;
  sourceIp: string;
  destIp: string;
  signature: string;
  protocol: string;
  payload: string;
  correctAction: 'ALLOW' | 'BLOCK' | 'ISOLATE' | 'ESCALATE';
  explanation: string;
}

const ALERTS_DATABASE: AlertEvent[] = [
  {
    id: 1,
    sourceIp: '198.51.100.23',
    destIp: '10.0.1.5 (Web Server)',
    signature: 'WEB_ATTACK: SQL Injection in query string `UNION SELECT null, username, password_hash FROM users--`',
    protocol: 'HTTPS / 443',
    payload: 'GET /api/v1/auth/login?user=%27%20OR%201=1-- HTTP/1.1',
    correctAction: 'BLOCK',
    explanation: 'Malicious SQLi probing credentials from untrusted public IP. Immediate Firewall/WAF IP block required.',
  },
  {
    id: 2,
    sourceIp: '10.0.2.14 (Admin Workstation)',
    destIp: '10.0.1.20 (Backup Storage)',
    signature: 'STORAGE: Scheduled Full Differential Backup Archive',
    protocol: 'SMB / 445',
    payload: 'Authenticated user: corp\\sysadmin_backup with authorized Kerberos ticket.',
    correctAction: 'ALLOW',
    explanation: 'Legitimate routine maintenance scheduled in Change Management. Blocking this disrupts disaster recovery.',
  },
  {
    id: 3,
    sourceIp: '10.0.3.45 (Finance Host)',
    destIp: '185.220.101.5 (External C2)',
    signature: 'MALWARE: Cobalt Strike DNS Tunneling Beacon / Encrypted Heartbeat',
    protocol: 'DNS / 53',
    payload: 'TXT query: a8f9c0e2.cdn-edge-telemetry.ru (high entropy 7.8)',
    correctAction: 'ISOLATE',
    explanation: 'Active C2 beacon from internal Finance laptop! Host must be isolated immediately from network to prevent lateral movement.',
  },
  {
    id: 4,
    sourceIp: '192.0.2.89',
    destIp: '10.0.1.22 (SSH Gateway)',
    signature: 'AUTH: Distributed SSH Brute Force (250 failed attempts in 60s)',
    protocol: 'SSH / 22',
    payload: 'Failed root, admin, ubuntu login attempts with dictionary wordlist.',
    correctAction: 'BLOCK',
    explanation: 'Credential stuffing attack from suspicious external node. Fail2ban / perimeter IP block applied.',
  },
  {
    id: 5,
    sourceIp: '10.0.1.1 (Domain Controller)',
    destIp: '10.0.2.100',
    signature: 'ANOMALY: Golden Ticket Forged TGT with Infinite Lifetime',
    protocol: 'Kerberos / 88',
    payload: 'krbtgt hash forged with domain SID S-1-5-21-... Admin privileges granted.',
    correctAction: 'ESCALATE',
    explanation: 'Critical enterprise compromise indicator! Requires emergency Tier-3 incident response escalation & krbtgt password reset.',
  },
];

const SOCTerminalPanel: React.FC<PanelProps> = ({ onMissionComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const currentAlert = ALERTS_DATABASE[currentIdx];

  const handleAction = (action: 'ALLOW' | 'BLOCK' | 'ISOLATE' | 'ESCALATE') => {
    if (feedback !== null || gameFinished) return;

    const isCorrect = action === currentAlert.correctAction;

    if (isCorrect) {
      soundFX.playHackSuccess();
      const newScore = score + 100 * (streak + 1);
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setFeedback({
        isCorrect: true,
        text: `CORRECT: ${currentAlert.explanation} (+${100 * newStreak} Score)`,
      });
    } else {
      soundFX.playHackError();
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `INCORRECT DECISION: ${currentAlert.explanation}`,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx + 1 < ALERTS_DATABASE.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setGameFinished(true);
        if (onMissionComplete) {
          onMissionComplete('mission-1');
        }
      }
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setGameFinished(false);
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">SOC INCIDENT DEFENDER // LIVE STREAM</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span className="terminal-status">SCORE: {score}</span>
          <span className="terminal-status" style={{ color: streak > 1 ? '#ffff00' : '#00ff88' }}>
            COMBO: {streak}x
          </span>
          <span className="terminal-status">
            ALERT {currentIdx + 1}/{ALERTS_DATABASE.length}
          </span>
        </div>
      </div>

      <div className="terminal-content">
        {!gameFinished ? (
          <div>
            <div className="triage-card">
              <div className="triage-header">
                <span className="triage-badge">LIVE NETWORK EVENT</span>
                <span className="triage-protocol">{currentAlert.protocol}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">SOURCE:</span>
                <span className="detail-value" style={{ color: '#ffaa55' }}>{currentAlert.sourceIp}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">DESTINATION:</span>
                <span className="detail-value">{currentAlert.destIp}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">SIGNATURE:</span>
                <span className="detail-value" style={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {currentAlert.signature}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">PAYLOAD:</span>
                <code className="payload-box">{currentAlert.payload}</code>
              </div>
            </div>

            {feedback && (
              <div
                className={`feedback-box ${feedback.isCorrect ? 'feedback-correct' : 'feedback-error'}`}
              >
                {feedback.isCorrect ? '✓ ' : '⚠ '}
                {feedback.text}
              </div>
            )}

            <div className="action-buttons-grid">
              <button
                className="triage-btn btn-allow"
                onClick={() => handleAction('ALLOW')}
                disabled={feedback !== null}
              >
                [ALLOW EVENT]
                <span className="btn-subtext">Legitimate Traffic</span>
              </button>
              <button
                className="triage-btn btn-block"
                onClick={() => handleAction('BLOCK')}
                disabled={feedback !== null}
              >
                [BLOCK IP]
                <span className="btn-subtext">Perimeter Firewall</span>
              </button>
              <button
                className="triage-btn btn-isolate"
                onClick={() => handleAction('ISOLATE')}
                disabled={feedback !== null}
              >
                [ISOLATE HOST]
                <span className="btn-subtext">EDR Containment</span>
              </button>
              <button
                className="triage-btn btn-escalate"
                onClick={() => handleAction('ESCALATE')}
                disabled={feedback !== null}
              >
                [ESCALATE TIER 3]
                <span className="btn-subtext">Emergency Response</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="triage-results">
            <h2>🎉 SOC TRIAGE SIMULATION COMPLETE!</h2>
            <div className="final-score-display">
              FINAL SCORE: <span style={{ color: '#00ff88' }}>{score}</span>
            </div>
            <p>
              Excellent work, Operator! You successfully triaged critical enterprise security incidents,
              identifying legitimate traffic while containing active threat vectors and neutralizing adversary intrusions.
            </p>

            <div className="siem-projects">
              <h3>Mohammed's Real-World SOC & SIEM Experience:</h3>
              <ul>
                <li><strong>Wazuh SIEM Deployment:</strong> Designed custom decoders and XML detection rules for MITRE ATT&CK coverage.</li>
                <li><strong>MISP Threat Intel:</strong> Automated IOC enrichment for proactive perimeter blocking.</li>
                <li><strong>TheHive SOAR Automation:</strong> Streamlined incident response pipelines to reduce MTTR by 45%.</li>
                <li><strong>24/7 Monitoring Mindset:</strong> Rigorous log aggregation across Windows Event Logs, Sysmon, and Linux Auditd.</li>
              </ul>
            </div>

            <div className="mission-complete">
              <span className="checkmark">✓</span> Mission 1 Complete: +100 XP & SOC Specialist Badge Unlocked!
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="scan-button" onClick={handleRestart}>
                REPLAY TRIAGE CHALLENGE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOCTerminalPanel;
