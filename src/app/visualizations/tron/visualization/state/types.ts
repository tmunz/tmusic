import { CameraMode } from '../camera/CameraMode';

export interface Character {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: string;
  vehicle: {
    speed: {
      actual: number;
      target: number;
      min: number;
      max: number;
    };
  };
}

export interface Player {
  id: string;
  insideBattleground: boolean;
  points: number;
  alive: boolean;
}

export interface TronState {
  characters: Record<string, Character>;
  userId: string;
  game: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    active: boolean;
    battlegroundSize: number;
    players: Record<string, Player>;
  };
  world: {
    tileSize: number;
  };
  cameraMode: CameraMode;
}
