import { SpeedCharacteristics } from '../../movement/SpeedCharactersistic';
import { TurnCharacteristics } from '../../movement/TurnCharacteristics';

export interface VehicleParams extends SpeedCharacteristics, TurnCharacteristics {
  lightWallOffset: number;
  lightWallHeight: number;
}
