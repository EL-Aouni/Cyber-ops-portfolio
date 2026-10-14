// Core game types
export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionBox extends Rectangle {}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  animationFrame: number;
  animationTimer: number;
}

export interface InteractiveObject {
  id: string;
  position: Vector2;
  size: Vector2;
  type: 'station' | 'door' | 'terminal' | 'npc' | 'document' | 'desk';
  title: string;
  description?: string;
  label?: string;
  interactionRadius: number;
  isInteractable: boolean;
  roomId?: string;
  missionId?: string;
  action?: () => void;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  bounds: Rectangle;
  walls?: CollisionBox[];
  collisionBoxes: CollisionBox[];
  objects: InteractiveObject[];
  backgroundColor: string;
  ambientColor?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectiveText: string;
  completed: boolean;
  xpReward: number;
  requiredInteraction?: string;
  order: number;
}

export interface GameState {
  player: Player;
  currentRoom: string;
  missions: Mission[];
  completedMissions: string[];
  totalXP: number;
  discoveredLocations: string[];
  isPaused: boolean;
  isMenuOpen: boolean;
  activePanel: string | null;
  cameraOffset: Vector2;
}

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  escape: boolean;
  mobile?: {
    joystick: Vector2 | null;
    interactPressed: boolean;
  };
};

export interface PanelContent {
  id: string;
  title: string;
  content: React.ReactNode;
}
