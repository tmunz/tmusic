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
}

export interface PlayerState {
  id: string;
  insideBattleground: boolean;
  outsideTimeRemaining: number;
  points: number;
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
