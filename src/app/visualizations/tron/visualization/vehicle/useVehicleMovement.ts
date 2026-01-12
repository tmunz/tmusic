import { useRef } from 'react';
import * as THREE from 'three';

interface MovementParams {
  speedChangeRate: number;
}

interface TurningParams {
  baseTurnSpeed: number;
  maxTurnSpeed: number;
  turnSpeedIncreaseRate: number;
  maxTurnTilt: number;
  tiltSmoothness: number;
}

export const useVehicleMovement = () => {
  const actualSpeedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const currentTurnSpeed = useRef(1);
  const currentTurnDirection = useRef(0); // 1 for left, 0 for neutral, -1 for right
  const currentTilt = useRef({ x: 0, z: 0 });

  const setTargetSpeed = (speed: number) => {
    targetSpeedRef.current = speed;
  };

  const updateTurning = (
    delta: number,
    controls: { left: boolean; right: boolean },
    mesh: THREE.Mesh,
    params: TurningParams
  ): number => {
    const { baseTurnSpeed, maxTurnSpeed, turnSpeedIncreaseRate, maxTurnTilt } = params;
    let targetTurnTilt = 0;
    const desiredDirection = controls.left ? 1 : controls.right ? -1 : 0;

    if (actualSpeedRef.current > 0 && desiredDirection !== 0) {
      if (currentTurnDirection.current !== 0 && currentTurnDirection.current !== desiredDirection) {
        currentTurnSpeed.current = Math.max(
          baseTurnSpeed,
          currentTurnSpeed.current - turnSpeedIncreaseRate * delta * 5
        );
        if (currentTurnSpeed.current <= baseTurnSpeed) {
          currentTurnSpeed.current = baseTurnSpeed;
          currentTurnDirection.current = 0;
        }
      } else {
        currentTurnDirection.current = desiredDirection;
        currentTurnSpeed.current = Math.min(maxTurnSpeed, currentTurnSpeed.current + turnSpeedIncreaseRate * delta);
        const rotationDelta = currentTurnSpeed.current * delta * desiredDirection;
        mesh.rotation.y += rotationDelta;
        targetTurnTilt = maxTurnTilt * (currentTurnSpeed.current / maxTurnSpeed) * desiredDirection;
      }
    } else {
      currentTurnSpeed.current = baseTurnSpeed;
      currentTurnDirection.current = 0;
    }

    return targetTurnTilt;
  };

  const applyTilt = (
    targetTurnTilt: number,
    delta: number,
    tiltSmoothness: number,
    mesh: THREE.Mesh,
    player: THREE.Group | null = null
  ) => {
    currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
    mesh.rotation.x = currentTilt.current.x;
    mesh.rotation.z = currentTilt.current.z;
    if (player) {
      player.rotation.x = currentTilt.current.x / 4;
      player.rotation.z = currentTilt.current.z / 4;
    }
  };

  const updateAndApplyMovement = (
    mesh: THREE.Mesh,
    delta: number,
    direction: THREE.Vector3,
    params: MovementParams,
    onPositionCalculated?: (newPosition: THREE.Vector3, previousPosition: THREE.Vector3) => boolean
  ): number => {
    const { speedChangeRate } = params;

    if (actualSpeedRef.current < targetSpeedRef.current) {
      actualSpeedRef.current = Math.min(targetSpeedRef.current, actualSpeedRef.current + speedChangeRate * delta);
    } else if (actualSpeedRef.current > targetSpeedRef.current) {
      actualSpeedRef.current = Math.max(targetSpeedRef.current, actualSpeedRef.current - speedChangeRate * delta);
    }

    const previousPosition = mesh.position.clone();
    const newPosition = mesh.position.clone();
    newPosition.addScaledVector(direction, actualSpeedRef.current * delta);

    let positionValid = true;
    if (onPositionCalculated) {
      positionValid = onPositionCalculated(newPosition, previousPosition);
    }

    if (positionValid) {
      mesh.position.copy(newPosition);
    } else {
      actualSpeedRef.current = 0.1; // needs small speed to enable movement away from collision
    }

    return actualSpeedRef.current;
  };

  const getActualSpeed = () => actualSpeedRef.current;
  const getTargetSpeed = () => targetSpeedRef.current;

  return {
    setTargetSpeed,
    updateAndApplyMovement,
    updateTurning,
    applyTilt,
    getActualSpeed,
    getTargetSpeed,
  };
};
