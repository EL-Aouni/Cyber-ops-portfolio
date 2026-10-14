import React from 'react';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
}

const RecruitmentDeskPanel: React.FC<PanelProps> = () => {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">RECRUITMENT OFFICE // CONTACT</span>
        <span className="terminal-status">● AVAILABLE FOR PFE</span>
      </div>

      <div className="terminal-content">
        <h2>Connect with Mohammed El-Aouni</h2>

        <div className="recruitment-intro">
          <p>
            Cybersecurity Engineering student seeking a <strong>PFE (Projet de Fin d'Études)</strong> internship
            in SOC operations, threat intelligence, incident response, or security automation.
          </p>
        </div>

        <div className="availability-box">
          <div className="availability-status">✓ AVAILABLE FOR INTERNSHIP</div>
          <p>Currently seeking opportunities to apply cybersecurity skills in a professional environment.</p>
        </div>

        <div className="contact-section">
          <h3>Contact Information</h3>

          <div className="contact-grid">
            <a
              href="https://github.com/Spinoza-ao"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">💻</div>
              <div className="contact-label">GitHub</div>
              <div className="contact-value">@Spinoza-ao</div>
            </a>

            <a
              href="https://linkedin.com/in/mohammed-el-aouni"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-icon">🔗</div>
              <div className="contact-label">LinkedIn</div>
              <div className="contact-value">Mohammed El-Aouni</div>
            </a>

            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <div className="contact-label">Email</div>
              <div className="contact-value">Available on LinkedIn</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>What I'm Looking For</h3>
          <ul>
            <li>SOC Analyst or Security Operations role</li>
            <li>Threat Intelligence or Incident Response position</li>
            <li>Security Automation & SOAR implementation</li>
            <li>Red Team or Penetration Testing opportunities</li>
            <li>Security Research & Development projects</li>
          </ul>
        </div>

        <div className="profile-section">
          <h3>What I Bring</h3>
          <ul>
            <li>Hands-on experience with SIEM platforms (Wazuh, Splunk)</li>
            <li>Active Directory security and Windows Server administration</li>
            <li>Offensive security mindset with bug bounty experience</li>
            <li>Security automation and scripting capabilities</li>
            <li>Strong problem-solving and analytical skills</li>
            <li>Passion for cybersecurity and continuous learning</li>
          </ul>
        </div>

        <div className="cta-box">
          <h3>Let's Work Together</h3>
          <p>
            If you're looking for a motivated cybersecurity engineering student to join your team,
            let's connect and discuss how I can contribute to your security operations.
          </p>
          <div className="cta-buttons">
            <a
              href="https://github.com/Spinoza-ao"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button primary"
            >
              View GitHub Projects
            </a>
            <a
              href="https://linkedin.com/in/mohammed-el-aouni"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button secondary"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="mission-complete">
          <span className="checkmark">✓</span> All Missions Complete! Thank you for exploring my portfolio.
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDeskPanel;
