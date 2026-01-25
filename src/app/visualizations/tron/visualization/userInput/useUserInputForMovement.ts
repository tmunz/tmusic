import { MovementControlState } from '../movement/MovementControlState';
import { VehicleParams } from '../object/vehicle/VehicleParams';
import { ControlsState } from './useUserInput';

interface SpeedState {
  targetSpeed: number;
  actualSpeed: number;
}

interface SpeedActions {
  setTargetSpeed: (characterId: string, speed: number) => void;
  updateSpeed: (characterId: string, speed: number) => void;
}

export const getUserInputForMovement = (
  characterId: string,
  delta: number,
  speedState: SpeedState,
  speedActions: SpeedActions,
  controls?: ControlsState,
  movementCharacteritics?: VehicleParams
): { movementControlState: MovementControlState | undefined; targetSpeed: number } => {
  const TARGET_SPEED_CHANGE_RATE = 60;
  let movementControlState: MovementControlState | undefined;
  let { targetSpeed, actualSpeed } = speedState;

  if (controls && movementCharacteritics) {
    // Update target speed based on acceleration input
    const speedChange = TARGET_SPEED_CHANGE_RATE * delta * controls.acceleration;
    const newTargetSpeed = Math.max(
      movementCharacteritics.minSpeed,
      Math.min(movementCharacteritics.maxSpeed, targetSpeed + speedChange)
    );
    speedActions.setTargetSpeed(characterId, newTargetSpeed);
    targetSpeed = newTargetSpeed;

    // Update actual speed towards target
    let newActual = actualSpeed;
    if (actualSpeed < newTargetSpeed) {
      newActual = Math.min(newTargetSpeed, actualSpeed + movementCharacteritics.speedChangeRate * delta);
    } else if (actualSpeed > newTargetSpeed) {
      newActual = Math.max(newTargetSpeed, actualSpeed - movementCharacteritics.speedChangeRate * delta);
    }

    if (newActual !== actualSpeed) {
      speedActions.updateSpeed(characterId, newActual);
    }

    movementControlState = {
      direction: controls.direction,
      speed: newActual,
    };
  }

  return { movementControlState, targetSpeed };
};
