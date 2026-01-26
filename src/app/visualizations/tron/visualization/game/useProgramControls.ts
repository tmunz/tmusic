import { RefObject, useRef, useCallback } from 'react';
import { Vector3 } from 'three';
import { VehicleHandle } from '../object/vehicle/Vehicle';
import { ControlsState } from '../userInput/useUserInput';
import { useProgramPilot } from './useProgramPilot';
import { useTronStore } from '../state/TronStore';
import { calculateMovementControls } from '../movement/calculateMovementControls';

interface ProgramControlsParams {
  characterId: string;
  characterRef: RefObject<VehicleHandle>;
}

export interface ProgramControlsDebugInfo {
  targetPositionRef: RefObject<Vector3>;
}

export const useProgramControls = ({
  characterId,
  characterRef,
}: ProgramControlsParams): [() => ControlsState, ProgramControlsDebugInfo] => {
  const targetPositionRef = useRef(new Vector3());
  const programPilot = useProgramPilot({ characterId, characterRef });
  const setSpeed = useTronStore(state => state.setSpeed);
  const actualSpeed = useTronStore(state => state.characters[characterId]?.speed.actual ?? 0);

  const getProgramControls = useCallback((): ControlsState => {
    const vehicle = characterRef.current?.getObject();
    if (!vehicle) {
      return { direction: 0, acceleration: 0, camera: 0 };
    }

    const directionToTarget = new Vector3().subVectors(targetPositionRef.current, vehicle.position);
    const targetAngle = Math.atan2(-directionToTarget.x, -directionToTarget.z);
    const currentAngle = vehicle.rotation.y;
    let angleDiff = targetAngle - currentAngle;
    angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
    const { position, speed } = programPilot();
    setSpeed(characterId, speed);

    if (!position) {
      return { direction: 0, acceleration: 0, camera: 0 };
    }

    targetPositionRef.current.copy(position);
    const movementControls = calculateMovementControls(vehicle, targetPositionRef.current, actualSpeed, false);
    const targetSpeed = speed;
    const acceleration = actualSpeed < targetSpeed ? 1 : actualSpeed > targetSpeed ? -1 : 0;

    return {
      direction: movementControls.direction,
      acceleration,
      camera: 0,
    };
  }, [characterId, programPilot, characterRef, setSpeed, actualSpeed]);

  return [getProgramControls, { targetPositionRef }];
};
