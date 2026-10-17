import React, { useState, useEffect } from 'react';
import { soundFX } from '../../game/utils/sound';
import './PanelContent.css';

interface PanelProps {
  onClose: () => void;
  onMissionComplete?: (missionId: string) => void;
}

const MATRIX_SIZE = 5;
const HEX_OPTIONS = ['1C', '55', 'BD', 'E9', '7A', 'FF'];

const SIEMStationPanel: React.FC<PanelProps> = ({ onMissionComplete }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [isRowTurn, setIsRowTurn] = useState<boolean>(true);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [activeCol, setActiveCol] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);

  const initGame = () => {
    // Generate 5x5 grid
    const newGrid: string[][] = [];
    for (let r = 0; r < MATRIX_SIZE; r++) {
      const row: string[] = [];
      for (let c = 0; c < MATRIX_SIZE; c++) {
        row.push(HEX_OPTIONS[Math.floor(Math.random() * HEX_OPTIONS.length)]);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);

    // Generate achievable target sequence of 3 hex codes
    const seq = [
      newGrid[0][Math.floor(Math.random() * MATRIX_SIZE)],
      HEX_OPTIONS[Math.floor(Math.random() * HEX_OPTIONS.length)],
      HEX_OPTIONS[Math.floor(Math.random() * HEX_OPTIONS.length)],
    ];
    setTargetSequence(seq);
    setBuffer([]);
    setSelectedCells([]);
    setIsRowTurn(true);
    setActiveRow(0);
    setActiveCol(0);
    setGameWon(false);
    setGameOver(false);
    setTimeLeft(45);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameWon || gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameOver(true);
          soundFX.playHackError();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameWon, gameOver]);

  // Check buffer match against target sequence
  useEffect(() => {
    if (targetSequence.length === 0 || gameWon) return;

    // Check if target sequence is present as a subsequence in buffer
    const bufferStr = buffer.join(',');
    const targetStr = targetSequence.join(',');

    if (bufferStr.includes(targetStr)) {
      setGameWon(true);
      soundFX.playHackSuccess();
      if (onMissionComplete) {
        onMissionComplete('mission-2');
      }
    } else if (buffer.length >= 6) {
      setGameOver(true);
      soundFX.playHackError();
    }
  }, [buffer, targetSequence, gameWon, onMissionComplete]);

  const handleCellClick = (r: number, c: number) => {
    if (gameWon || gameOver) return;

    // Check if cell was already picked
    if (selectedCells.some((cell) => cell.r === r && cell.c === c)) return;

    // Verify row or col constraint
    if (isRowTurn && r !== activeRow) return;
    if (!isRowTurn && c !== activeCol) return;

    soundFX.playInteract();

    const val = grid[r][c];
    setBuffer([...buffer, val]);
    setSelectedCells([...selectedCells, { r, c }]);

    // Alternate constraint: if was row turn, now locked to column c
    if (isRowTurn) {
      setActiveCol(c);
      setIsRowTurn(false);
    } else {
      setActiveRow(r);
      setIsRowTurn(true);
    }
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-prompt">SIEM MATRIX BREACH PROTOCOL</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="terminal-status" style={{ color: timeLeft < 15 ? '#ff4444' : '#00ffff' }}>
            TRACE TIMER: {timeLeft}s
          </span>
          <span className="terminal-status">● CORRELATION ACTIVE</span>
        </div>
      </div>

      <div className="terminal-content">
        {!gameWon && !gameOver ? (
          <div>
            <p style={{ color: '#88ffff', marginBottom: '16px' }}>
              Bypass SIEM security buffer to trace data exfiltration. Match the required hash sequence by
              alternating between horizontal row and vertical column memory sectors.
            </p>

            <div className="matrix-target-box">
              <span className="matrix-label">TARGET SEQUENCE:</span>
              <div className="sequence-display">
                {targetSequence.map((code, idx) => (
                  <span key={idx} className="hex-target-badge">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="buffer-box">
              <span className="matrix-label">BUFFER MEMORY ({buffer.length}/6):</span>
              <div className="sequence-display">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`buffer-slot ${buffer[idx] ? 'slot-filled' : 'slot-empty'}`}
                  >
                    {buffer[idx] || '__'}
                  </span>
                ))}
              </div>
            </div>

            <div className="matrix-helper-text">
              CURRENT DIRECTIVE: {isRowTurn ? `Select cell from ROW ${activeRow + 1}` : `Select cell from COLUMN ${activeCol + 1}`}
            </div>

            <div className="matrix-grid">
              {grid.map((row, r) => (
                <div key={r} className="matrix-row">
                  {row.map((val, c) => {
                    const isSelected = selectedCells.some((cell) => cell.r === r && cell.c === c);
                    const isSelectable =
                      !isSelected && ((isRowTurn && r === activeRow) || (!isRowTurn && c === activeCol));

                    return (
                      <button
                        key={c}
                        className={`matrix-cell ${isSelected ? 'cell-used' : ''} ${
                          isSelectable ? 'cell-active' : ''
                        }`}
                        onClick={() => handleCellClick(r, c)}
                        disabled={!isSelectable}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : gameWon ? (
          <div className="triage-results">
            <h2>🎉 ACCESS GRANTED // SIEM LOG CORRELATED!</h2>
            <div className="final-score-display">
              MALICIOUS TRACE CONTAINED
            </div>
            <p>
              By successfully matching the encrypted hash signature, you traced the stealth C2 exfiltration
              channel back to external adversary infrastructure and deployed automated firewall correlation rules!
            </p>

            <div className="siem-projects">
              <h3>Mohammed's Enterprise SIEM Deployments:</h3>
              <ul>
                <li><strong>Wazuh Elastic Stack Architecture:</strong> Built high-availability cluster handling 15,000 EPS.</li>
                <li><strong>Splunk Threat Detection Queries:</strong> Authored SPL queries detecting Pass-the-Hash & Kerberoasting.</li>
                <li><strong>Incident Response Automation:</strong> Integrated TheHive webhook handlers for instant IP quarantine.</li>
              </ul>
            </div>

            <div className="mission-complete">
              <span className="checkmark">✓</span> Mission 2 Complete: +150 XP Earned!
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="scan-button" onClick={initGame}>
                RETRY MATRIX PROTOCOL
              </button>
            </div>
          </div>
        ) : (
          <div className="triage-results">
            <h2 style={{ color: '#ff4444' }}>⚠ BREACH PROTOCOL FAILED // TRACE DETECTED</h2>
            <p>
              Buffer overloaded or security trace completed before signature match. Resetting encryption buffer.
            </p>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="scan-button" onClick={initGame}>
                REBOOT BREACH SYSTEM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIEMStationPanel;
