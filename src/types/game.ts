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
  isAttacking: boolean;
  attackTimer: number;
  isHurt: boolean;
  hurtTimer: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  level: number;
  animationFrame: number;
  animationTimer: number;
}

export interface Bot {
  id: string;
  type: 'malware' | 'sentinel' | 'drone';
  name: string;
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'patrol' | 'chase' | 'attack' | 'hurt' | 'dead';
  health: number;
  maxHealth: number;
  patrolPoints: Vector2[];
  currentPointIndex: number;
  detectionRadius: number;
  attackRadius: number;
  attackCooldown: number;
  attackTimer: number;
  animationFrame: number;
  animationTimer: number;
  deathTimer?: number;
}

export interface Projectile {
  id: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
  damage: number;
  life: number;
  maxLife: number;
  isPlayer: boolean;
}

export interface Collectible {
  id: string;
  title: string;
  lore: string;
  type: 'usb' | 'badge' | 'disc' | 'intel';
  position: Vector2;
  xpReward: number;
  collected: boolean;
  bobTimer: number;
  roomId: string;
}

export interface FloatingText {
  id: string;
  text: string;
  position: Vector2;
  color: string;
  life: number;
  maxLife: number;
}

export interface RoomDecoration {
  type: 'fire' | 'chest' | 'bookshelf' | 'table' | 'box' | 'spikes';
  position: Vector2;
  size: Vector2;
  frame?: number;
  state?: 'closed' | 'open';
}

export interface InteractiveObject {
  id: string;
  position: Vector2;
  size: Vector2;
  type: 'station' | 'door' | 'terminal' | 'npc' | 'document' | 'desk' | 'chest';
  title: string;
  description?: string;
  label?: string;
  interactionRadius: number;
  isInteractable: boolean;
  roomId?: string;
  missionId?: string;
  state?: 'closed' | 'open';
  chestLoot?: string;
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
  decorations?: RoomDecoration[];
  bots?: Bot[];
  collectibles?: Collectible[];
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
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  bots: Bot[];
  collectibles: Collectible[];
  recentLore: { title: string; text: string } | null;
  isMuted: boolean;
}

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  attack: boolean;
  escape: boolean;
  mobile?: {
    joystick: Vector2 | null;
    interactPressed: boolean;
    attackPressed: boolean;
  };
};

export interface PanelContent {
  id: string;
  title: string;
  content: React.ReactNode;
}
