import React from 'react';
import type { GameState } from '../../types/game';
import SOCTerminalPanel from './SOCTerminalPanel';
import SIEMStationPanel from './SIEMStationPanel';
import ReconTerminalPanel from './ReconTerminalPanel';
import ResearchTerminalPanel from './ResearchTerminalPanel';
import MissionControlPanel from './MissionControlPanel';
import RecruitmentDeskPanel from './RecruitmentDeskPanel';
import './PanelOverlay.css';

interface PanelOverlayProps {
  panelId: string;
  onClose: () => void;
  gameState: GameState;
  onMissionComplete?: (missionId: string) => void;
}

const PanelOverlay: React.FC<PanelOverlayProps> = ({
  panelId,
  onClose,
  gameState,
  onMissionComplete,
}) => {
  const renderPanelContent = () => {
    switch (panelId) {
      case 'soc-terminal':
        return <SOCTerminalPanel onClose={onClose} onMissionComplete={onMissionComplete} />;
      case 'siem-station':
        return <SIEMStationPanel onClose={onClose} onMissionComplete={onMissionComplete} />;
      case 'recon-terminal':
        return <ReconTerminalPanel onClose={onClose} onMissionComplete={onMissionComplete} />;
      case 'research-terminal':
        return <ResearchTerminalPanel onClose={onClose} onMissionComplete={onMissionComplete} />;
      case 'mission-control':
        return (
          <MissionControlPanel
            onClose={onClose}
            gameState={gameState}
            onMissionComplete={onMissionComplete}
          />
        );
      case 'recruitment-desk':
        return <RecruitmentDeskPanel onClose={onClose} onMissionComplete={onMissionComplete} />;
      default:
        return (
          <div className="panel-default">
            <h2>Terminal Access</h2>
            <p>Data stream active. Terminal ID: {panelId}</p>
          </div>
        );
    }
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-container" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div className="panel-header-title">TERMINAL ACCESS // {panelId.toUpperCase()}</div>
          <button className="panel-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="panel-body">{renderPanelContent()}</div>
      </div>
    </div>
  );
};

export default PanelOverlay;
