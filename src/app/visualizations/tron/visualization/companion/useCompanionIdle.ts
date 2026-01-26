import { RefObject, useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { SpeedCharacteristics } from '../movement/SpeedCharactersistic';
import { TurnCharacteristics } from '../movement/TurnCharacteristics';

export interface CompanionIdleConfig {
  verticalOffset?: number;
}

export const IDLE_MOVEMENT_CHARACTERISTICS: TurnCharacteristics & SpeedCharacteristics = {
  minSpeed: 5,
  maxSpeed: 120,
  acceleration: 20,
  deceleration: 60,
  baseTurnSpeed: 2,
  maxTurnSpeed: 8,
  turnSpeedIncreaseRate: 0,
  maxTurnTilt: 0.4,
  tiltSmoothness: 5,
};

export const useCompanionIdle = (
  companionRef: RefObject<Object3D>,
  targetRef: RefObject<Object3D>,
  config?: CompanionIdleConfig
) => {
  const targetBasePositionRef = useRef(new Vector3());
  const targetOffsetRef = useRef(new Vector3());

  const getTargetOffset = (time: number): Vector3 => {
    const orbitRadius = 1;
    const orbitSpeed = 2;
    const verticalAmplitude = 0.6;
    const verticalSpeed = 0.8;
    const angle = time * orbitSpeed;
    return targetOffsetRef.current.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(time * verticalSpeed) * verticalAmplitude,
      Math.sin(angle) * orbitRadius
    );
  };

  const getTargetBasePosition = (): Vector3 => {
    if (!targetRef.current) return targetBasePositionRef.current;

    return targetBasePositionRef.current.set(
      targetRef.current.position.x,
      targetRef.current.position.y + (config?.verticalOffset ?? 0),
      targetRef.current.position.z
    );
  };

  const getTargetSpeed = (angleDiff: number): number => {
    const targetPosition = targetRef.current?.position;
    const companionPosition = companionRef.current?.position;
    if (!targetPosition || !companionPosition) return 0;
    const distance = companionPosition.distanceTo(targetPosition);
    let targetSpeed = Math.min(
      (distance * IDLE_MOVEMENT_CHARACTERISTICS.acceleration) / 14,
      IDLE_MOVEMENT_CHARACTERISTICS.maxSpeed
    );
    const alignmentMultiplier = Math.max(0.3, 1 - Math.abs(angleDiff) / Math.PI);
    return Math.max(
      IDLE_MOVEMENT_CHARACTERISTICS.minSpeed,
      Math.min(targetSpeed * alignmentMultiplier, IDLE_MOVEMENT_CHARACTERISTICS.maxSpeed)
    );
  };

  const isActivated = (): boolean => {
    return false;
  };

  return (time: number, angleDiff: number) => {
    const position = new Vector3().addVectors(getTargetBasePosition(), getTargetOffset(time));
    return {
      position,
      speed: getTargetSpeed(angleDiff),
      activated: isActivated(),
    };
  };
};
