import { create } from 'zustand';

interface GameState {
  location: string;
  xp: number;
  completedMissions: string[];
  activeProject: string | null;
  setLocation: (loc: string) => void;
  addXp: (amount: number) => void;
  completeMission: (missionId: string) => void;
  setActiveProject: (projectId: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  location: 'spawn',
  xp: 0,
  completedMissions: [],
  activeProject: null,
  setLocation: (location) => set({ location }),
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  completeMission: (missionId) => set((state) => ({
    completedMissions: state.completedMissions.includes(missionId)
      ? state.completedMissions
      : [...state.completedMissions, missionId]
  })),
  setActiveProject: (projectId) => set({ activeProject: projectId }),
}));
