import React, { useState, useEffect } from 'react';
import { soundFX } from '../../game/utils/sound';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  onMissionComplete?: (missionId: string) => void;
}

interface DialogueNode {
  question: string;
  response: React.ReactNode;
}

const RecruitmentDeskPanel: React.FC<PanelProps> = ({ onMissionComplete }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  useEffect(() => {
    if (onMissionComplete) {
      onMissionComplete('mission-6');
    }
  }, [onMissionComplete]);

  const dialogues: DialogueNode[] = [
    {
      question: 'What is Mohammed looking for in a PFE internship?',
      response: (
        <div>
          <p>
            Mohammed is seeking a <strong>Projet de Fin d'Études (PFE)</strong> internship of 4 to 6 months
            (starting Spring 2025/2026) in:
          </p>
          <ul>
            <li><strong>SOC / Incident Response:</strong> Level 1/2 SOC Analyst, threat triage, digital forensics.</li>
            <li><strong>Security Operations & SIEM:</strong> Rule engineering (Wazuh, Splunk), SOAR automation (TheHive), MISP enrichment.</li>
            <li><strong>Offensive Security:</strong> Junior Penetration Tester, Red Teaming, vulnerability assessment.</li>
            <li><strong>Security Engineering:</strong> Active Directory hardening, Cloud security posture, DevSecOps.</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'What makes Mohammed stand out from other candidates?',
      response: (
        <div>
          <p>
            Beyond academic excellence at ENSA Oujda, Mohammed brings <strong>practical, hands-on enterprise lab experience</strong>:
          </p>
          <ul>
            <li>Built complete end-to-end Wazuh SIEM & Active Directory enterprise lab environments from scratch.</li>
            <li>Practices offensive methodologies actively on HackTheBox and TryHackMe.</li>
            <li>Passionate about automation: writes custom Python, PowerShell, and Bash tools rather than relying only on manual workflows.</li>
            <li>Strong analytical discipline with dedication to continuous learning and MITRE ATT&CK alignment.</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'Where is Mohammed based and what are work arrangements?',
      response: (
        <div>
          <p>
            Currently based in Morocco (ENSA Oujda). Open to <strong>on-site, hybrid, or remote</strong> opportunities
            across Morocco (Casablanca, Rabat, Tangier, etc.) as well as international remote internships.
          </p>
        </div>
      ),
    },
  ];

  const handleTopicClick = (idx: number) => {
    soundFX.playInteract();
    setSelectedTopic(selectedTopic === idx ? null : idx);
  };

  const handleDownloadCV = () => {
    soundFX.playHackSuccess();
    // Create text CV data URI or open GitHub
    const cvText = `=====================================================
MOHAMMED EL-AOUNI - CYBERSECURITY ENGINEERING STUDENT
=====================================================
Education: École Nationale des Sciences Appliquées (ENSA), Oujda
Focus: State Engineering Degree in Cybersecurity
Seeking: PFE Internship (Projet de Fin d'Études)

Core Competencies:
- Security Operations: Wazuh SIEM, Splunk, MISP, TheHive, Sysmon
- Offensive Security: Penetration Testing, Nmap, Metasploit, Burp Suite
- Enterprise Systems: Active Directory, Windows Server 2022, GPO, Linux
- Scripting & Automation: Python, PowerShell, Bash, Git

GitHub: https://github.com/Spinoza-ao
LinkedIn: https://linkedin.com/in/mohammed-el-aouni
=====================================================`;

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mohammed_El-Aouni_Cybersecurity_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">RECRUITMENT OFFICER NPC // DIALOGUE MATRIX</span>
        <span className="terminal-status">● PFE INTERNSHIP AVAILABLE</span>
      </div>

      <div className="terminal-content">
        <div className="npc-dialogue-box">
          <div className="npc-avatar">
            <span style={{ fontSize: '32px' }}>🎖️</span>
          </div>
          <div className="npc-speech">
            <div style={{ color: '#00ffff', fontWeight: 'bold', marginBottom: '4px' }}>
              RECRUITMENT OFFICER
            </div>
            <p style={{ margin: 0 }}>
              "Welcome to Headquarters, Operator! Mohammed El-Aouni is ready to join an elite cybersecurity team
              for his graduation PFE internship. How can I assist your recruitment inquiry today?"
            </p>
          </div>
        </div>

        <div className="dialogue-options">
          <h3>INQUIRE WITH RECRUITMENT OFFICER:</h3>
          {dialogues.map((d, idx) => (
            <div
              key={idx}
              className={`dialogue-item ${selectedTopic === idx ? 'dialogue-selected' : ''}`}
              onClick={() => handleTopicClick(idx)}
            >
              <div className="dialogue-question">
                <span style={{ color: '#00ffff', marginRight: '8px' }}>💬</span>
                {d.question}
              </div>
              {selectedTopic === idx && (
                <div className="dialogue-answer">{d.response}</div>
              )}
            </div>
          ))}
        </div>

        <div className="availability-box" style={{ marginTop: '24px' }}>
          <div className="availability-status">✓ AVAILABLE FOR PFE GRADUATION INTERNSHIP</div>
          <p>Seeking opportunities to contribute immediately to SOC, Threat Intel, or Red Team operations.</p>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="scan-button" onClick={handleDownloadCV}>
              📄 DOWNLOAD OFFICIAL CV / RESUME
            </button>
            <a
              href="https://linkedin.com/in/mohammed-el-aouni"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🔗 CONNECT ON LINKEDIN</span>
            </a>
            <a
              href="https://github.com/Spinoza-ao"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>💻 VIEW GITHUB REPOSITORIES</span>
            </a>
          </div>
        </div>

        <div className="mission-complete" style={{ marginTop: '24px' }}>
          <span className="checkmark">✓</span> Mission 6 Complete: Recruitment Dispatch Established (+100 XP)!
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDeskPanel;
