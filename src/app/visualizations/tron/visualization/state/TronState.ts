export enum Mode {
  NONE = 'none',
  VISUALIZER = 'visualizer',
  LIGHTCYCLE_BATTLE = 'lightcycle-battle',
}

export interface CharacterState {
  id: string;
  // position: {
  //   x: number;
  //   y: number;
  //   z: number;
  // };
  color: string;
  isDisintegrated: boolean;
  vehicle: {
    speed: {
      actual: number;
      target: number;
      min: number;
      max: number;
    };
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
