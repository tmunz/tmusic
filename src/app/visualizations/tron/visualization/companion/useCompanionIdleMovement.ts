import { useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { SpeedCharacteristics } from '../movement/SpeedCharactersistic';
import { TurnCharacteristics } from '../movement/TurnCharacteristics';

export interface CompanionIdleConfig {
  verticalOffset?: number;
}

export const IDLE_MOVEMENT_CHARACTERISTICS: TurnCharacteristics & SpeedCharacteristics = {
  minSpeed: 0,
  maxSpeed: 10,
  speedChangeRate: 2,
  baseTurnSpeed: 2,
  maxTurnSpeed: 4,
  turnSpeedIncreaseRate: 1,
  maxTurnTilt: 0,
  tiltSmoothness: 0,
};

export const useCompanionIdleMovement = (targetRef: React.RefObject<Object3D>, config?: CompanionIdleConfig) => {
  const targetPositionRef = useRef(new Vector3());

  const getTargetPosition = (): Vector3 | undefined => {
    if (!targetRef.current) return undefined;

    targetPositionRef.current.set(
      targetRef.current.position.x,
      targetRef.current.position.y + (config?.verticalOffset ?? 0),
      targetRef.current.position.z
    );

    return targetPositionRef.current;
  };

  return {
    getTargetPosition,
  };
};
