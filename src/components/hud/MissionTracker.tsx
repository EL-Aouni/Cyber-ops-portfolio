import type { Mission } from '../../types/game';
import './MissionTracker.css';

interface MissionTrackerProps {
  missions: Mission[];
}

const MissionTracker = ({ missions }: MissionTrackerProps) => {
  const activeMission = missions.find(m => !m.completed);

  if (!activeMission) {
    return (
      <div className="mission-tracker completed">
        <div className="mission-header">✓ ALL MISSIONS COMPLETED</div>
        <div className="mission-text">Outstanding work, operator!</div>
      </div>
    );
  }

  return (
    <div className="mission-tracker">
      <div className="mission-header">
        ACTIVE MISSION [{activeMission.order}/{missions.length}]
      </div>
      <div className="mission-title">{activeMission.title}</div>
      <div className="mission-objective">
        <span className="objective-label">→</span> {activeMission.objectiveText}
      </div>
      <div className="mission-xp">+{activeMission.xpReward} XP</div>
    </div>
  );
};

export default MissionTracker;
