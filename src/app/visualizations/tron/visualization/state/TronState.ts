import { CameraMode } from '../camera/CameraMode';
import { Character } from './Character';
import { Player } from './Player';

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
