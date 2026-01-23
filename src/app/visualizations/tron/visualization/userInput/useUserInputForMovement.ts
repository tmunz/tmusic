import { MovementControlState } from '../movement/MovementControlState';
import { VehicleParams } from '../object/vehicle/VehicleParams';
import { ControlsState } from './UserInput';

export const useUserInputForMovement = (
  delta: number,
  speedControl: any,
  controls?: ControlsState,
  movementCharacteritics?: VehicleParams
) => {
  const TARGET_SPEED_CHANGE_RATE = 60;
  let movementControlState: MovementControlState | undefined;

  if (controls && movementCharacteritics) {
    speedControl.updateTargetSpeed(
      delta,
      {
        minSpeed: movementCharacteritics.minSpeed,
        maxSpeed: movementCharacteritics.maxSpeed,
        speedChangeRate: TARGET_SPEED_CHANGE_RATE,
      },
      controls.acceleration
    );
    const speed = speedControl.updateActualSpeed(delta, movementCharacteritics.speedChangeRate);
    movementControlState = {
      direction: controls.direction,
      speed,
    };
  }

  return { movementControlState, targetSpeed: speedControl.getTargetSpeed() };
};
