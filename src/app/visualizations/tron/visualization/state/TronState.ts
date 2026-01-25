export enum Mode {
  NONE = 'none',
  VISUALIZER = 'visualizer',
  LIGHTCYCLE_BATTLE = 'lightcycle-battle',
}

export interface CharacterState {
  id: string;
  color: string;
  isDisintegrated: boolean;
  companionId?: string;
  speed: {
    actual: number;
    target: number;
    min: number;
    max: number;
  };
  movement: {
    turnSpeed: number;
    turnDirection: number;
    tilt: { x: number; z: number };
    direction: { x: number; y: number; z: number };
    isInCollision: boolean;
  };
}

export interface PlayerState {
  id: string;
  insideBattleground: boolean;
  points: number;
  alive: boolean;
}

export interface TronState {
  characters: Record<string, CharacterState>;
  userId: string;
  mode: Mode;
  game: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    battlegroundSize: number;
    players: Record<string, PlayerState>;
  };
  world: {
    tileSize: number;
  };
}
