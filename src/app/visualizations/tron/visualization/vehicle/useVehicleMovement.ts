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
  const isInCollision = useRef(false);

  const setTargetSpeed = (speed: number) => {
    targetSpeedRef.current = speed;
  };

  const updateTurning = (
    delta: number,
    controls: { left: boolean; right: boolean },
    object: THREE.Object3D,
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
        object.rotation.y += rotationDelta;
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
    object: THREE.Object3D,
    player: THREE.Group | null = null
  ) => {
    currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
    object.rotation.x = currentTilt.current.x;
    object.rotation.z = currentTilt.current.z;
    if (player) {
      player.rotation.x = currentTilt.current.x / 4;
      player.rotation.z = currentTilt.current.z / 4;
    }
  };

  const updateAndApplyMovement = (
    object: THREE.Object3D,
    delta: number,
    direction: THREE.Vector3,
    params: MovementParams,
    onPositionCalculated?: (
      newPosition: THREE.Vector3,
      previousPosition: THREE.Vector3,
      slideDirection?: THREE.Vector3
    ) => boolean
  ): number => {
    const { speedChangeRate } = params;

    if (actualSpeedRef.current < targetSpeedRef.current) {
      actualSpeedRef.current = Math.min(targetSpeedRef.current, actualSpeedRef.current + speedChangeRate * delta);
    } else if (actualSpeedRef.current > targetSpeedRef.current) {
      actualSpeedRef.current = Math.max(targetSpeedRef.current, actualSpeedRef.current - speedChangeRate * delta);
    }

    const previousPosition = object.position.clone();
    const newPosition = object.position.clone();
    newPosition.addScaledVector(direction, actualSpeedRef.current * delta);

    let positionValid = true;
    if (onPositionCalculated) {
      positionValid = onPositionCalculated(newPosition, previousPosition);
    }

    if (positionValid) {
      object.position.copy(newPosition);
      isInCollision.current = false;
    } else {
      if (!isInCollision.current) {
        isInCollision.current = true;
        let low = 0;
        let high = 1;
        let bestValid = 0;

        for (let i = 0; i < 8; i++) {
          const mid = (low + high) / 2;
          const testPosition = previousPosition.clone();
          testPosition.addScaledVector(direction, actualSpeedRef.current * delta * mid);

          if (onPositionCalculated && onPositionCalculated(testPosition, previousPosition)) {
            bestValid = mid;
            low = mid;
          } else {
            high = mid;
          }
        }

        const movementDistance = actualSpeedRef.current * delta;
        const testSlideX = previousPosition.clone();
        testSlideX.x += direction.x * movementDistance;
        const testSlideZ = previousPosition.clone();
        testSlideZ.z += direction.z * movementDistance;

        const xBlocked = !onPositionCalculated || !onPositionCalculated(testSlideX, previousPosition);
        const zBlocked = !onPositionCalculated || !onPositionCalculated(testSlideZ, previousPosition);

        let estimatedNormal = new THREE.Vector3(0, 0, 0);
        if (xBlocked && !zBlocked) {
          estimatedNormal.set(-(Math.sign(direction.x) || 1), 0, 0);
        } else if (zBlocked && !xBlocked) {
          estimatedNormal.set(0, 0, -(Math.sign(direction.z) || 1));
        } else {
          estimatedNormal = direction.clone().negate().normalize();
        }

        const directionNormalized = direction.clone().normalize();
        const dotProduct = Math.abs(directionNormalized.dot(estimatedNormal));
        const approachAngleDegrees = Math.acos(Math.min(1, dotProduct)) * (180 / Math.PI);

        if (approachAngleDegrees > 80) {
          const maxValidPosition = previousPosition.clone();
          maxValidPosition.addScaledVector(direction, actualSpeedRef.current * delta * bestValid);
          object.position.copy(maxValidPosition);
          actualSpeedRef.current *= 0.85;
        } else {
          const maxValidDistance = actualSpeedRef.current * delta * bestValid;
          const targetDistance = actualSpeedRef.current * delta;
          const penetrationDistance = Math.min(maxValidDistance + 0.1, targetDistance);

          const collisionPosition = previousPosition.clone();
          collisionPosition.addScaledVector(direction, penetrationDistance);
          object.position.copy(collisionPosition);
        }
      } else {
        const slideDirectionX = new THREE.Vector3(direction.x, 0, 0).normalize();
        const slideDirectionZ = new THREE.Vector3(0, 0, direction.z).normalize();

        const slidePositionX = previousPosition.clone();
        slidePositionX.addScaledVector(slideDirectionX, actualSpeedRef.current * delta * 0.7);

        if (onPositionCalculated && onPositionCalculated(slidePositionX, previousPosition, slideDirectionX)) {
          object.position.copy(slidePositionX);
          actualSpeedRef.current *= 0.8;
        } else {
          const slidePositionZ = previousPosition.clone();
          slidePositionZ.addScaledVector(slideDirectionZ, actualSpeedRef.current * delta * 0.7);

          if (onPositionCalculated && onPositionCalculated(slidePositionZ, previousPosition, slideDirectionZ)) {
            object.position.copy(slidePositionZ);
            actualSpeedRef.current *= 0.8;
          } else {
            actualSpeedRef.current *= 0.3;
          }
        }
      }
    }

    return actualSpeedRef.current;
  };

  const getActualSpeed = () => actualSpeedRef.current;
  const getTargetSpeed = () => targetSpeedRef.current;

  const reset = () => {
    actualSpeedRef.current = 0;
    targetSpeedRef.current = 0;
    currentTurnSpeed.current = 1;
    currentTurnDirection.current = 0;
    currentTilt.current = { x: 0, z: 0 };
    isInCollision.current = false;
  };

  return {
    setTargetSpeed,
    updateAndApplyMovement,
    updateTurning,
    applyTilt,
    getActualSpeed,
    getTargetSpeed,
    reset,
  };
};
