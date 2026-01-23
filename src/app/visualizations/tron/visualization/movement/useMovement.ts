import { useRef } from 'react';
import { TurnCharacteristics } from './TurnCharacteristics';
import { SpeedCharacteristics } from './SpeedCharactersistic';
import { Object3D, Quaternion, Vector3 } from 'three';
import { MovementControlState } from './MovementControlState';

export const useMovement = () => {
  const currentTurnSpeed = useRef(1);
  const currentTurnDirection = useRef(0);
  const currentTilt = useRef({ x: 0, z: 0 });
  const isInCollision = useRef(false);

  // Reusable Three.js objects
  const directionRef = useRef(new Vector3(0, 0, -1));
  const previousPositionRef = useRef(new Vector3());
  const newPositionRef = useRef(new Vector3());
  const testPositionRef = useRef(new Vector3());
  const testSlideXRef = useRef(new Vector3());
  const testSlideZRef = useRef(new Vector3());
  const estimatedNormalRef = useRef(new Vector3());
  const directionNormalizedRef = useRef(new Vector3());
  const maxValidPositionRef = useRef(new Vector3());
  const collisionPositionRef = useRef(new Vector3());
  const slideDirectionXRef = useRef(new Vector3());
  const slideDirectionZRef = useRef(new Vector3());
  const slidePositionXRef = useRef(new Vector3());
  const slidePositionZRef = useRef(new Vector3());

  const updateTurning = (
    delta: number,
    object: Object3D,
    characteristics: TurnCharacteristics,
    controls?: MovementControlState
  ): number => {
    const { baseTurnSpeed, maxTurnSpeed, turnSpeedIncreaseRate, maxTurnTilt } = characteristics;
    let targetTurnTilt = 0;
    const desiredDirection = controls?.direction ?? 0;
    const actualSpeed = controls?.speed ?? 0;

    if (actualSpeed > 0 && desiredDirection !== 0) {
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
        const rotationDelta = currentTurnSpeed.current * delta * -desiredDirection;
        object.rotation.y += rotationDelta;
        targetTurnTilt = maxTurnTilt * (currentTurnSpeed.current / maxTurnSpeed) * -desiredDirection;
      }
    } else {
      currentTurnSpeed.current = baseTurnSpeed;
      currentTurnDirection.current = 0;
    }

    return targetTurnTilt;
  };

  const applyTilt = (targetTurnTilt: number, delta: number, tiltSmoothness: number, object: Object3D) => {
    currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
    object.rotation.x = currentTilt.current.x;
    object.rotation.z = currentTilt.current.z;
  };

  const updateAndApplyMovement = (
    object: Object3D,
    delta: number,
    direction: Vector3,
    actualSpeed: number,
    onPositionCalculated?: (newPosition: Vector3, previousPosition: Vector3, slideDirection?: Vector3) => boolean
  ): void => {
    previousPositionRef.current.copy(object.position);
    newPositionRef.current.copy(object.position);
    newPositionRef.current.addScaledVector(direction, actualSpeed * delta);

    let positionValid = true;
    if (onPositionCalculated) {
      positionValid = onPositionCalculated(newPositionRef.current, previousPositionRef.current);
    }

    if (positionValid) {
      object.position.copy(newPositionRef.current);

      isInCollision.current = false;
    } else {
      if (!isInCollision.current) {
        isInCollision.current = true;
        let low = 0;
        let high = 1;
        let bestValid = 0;

        for (let i = 0; i < 8; i++) {
          const mid = (low + high) / 2;
          testPositionRef.current.copy(previousPositionRef.current);
          testPositionRef.current.addScaledVector(direction, actualSpeed * delta * mid);

          if (onPositionCalculated && onPositionCalculated(testPositionRef.current, previousPositionRef.current)) {
            bestValid = mid;
            low = mid;
          } else {
            high = mid;
          }
        }

        const movementDistance = actualSpeed * delta;
        testSlideXRef.current.copy(previousPositionRef.current);
        testSlideXRef.current.x += direction.x * movementDistance;
        testSlideZRef.current.copy(previousPositionRef.current);
        testSlideZRef.current.z += direction.z * movementDistance;

        const xBlocked =
          !onPositionCalculated || !onPositionCalculated(testSlideXRef.current, previousPositionRef.current);
        const zBlocked =
          !onPositionCalculated || !onPositionCalculated(testSlideZRef.current, previousPositionRef.current);

        if (xBlocked && !zBlocked) {
          estimatedNormalRef.current.set(-(Math.sign(direction.x) || 1), 0, 0);
        } else if (zBlocked && !xBlocked) {
          estimatedNormalRef.current.set(0, 0, -(Math.sign(direction.z) || 1));
        } else {
          estimatedNormalRef.current.copy(direction).negate().normalize();
        }

        directionNormalizedRef.current.copy(direction).normalize();
        const dotProduct = Math.abs(directionNormalizedRef.current.dot(estimatedNormalRef.current));
        const approachAngleDegrees = Math.acos(Math.min(1, dotProduct)) * (180 / Math.PI);

        if (approachAngleDegrees > 80) {
          maxValidPositionRef.current.copy(previousPositionRef.current);
          maxValidPositionRef.current.addScaledVector(direction, actualSpeed * delta * bestValid);
          object.position.copy(maxValidPositionRef.current);
        } else {
          const maxValidDistance = actualSpeed * delta * bestValid;
          const targetDistance = actualSpeed * delta;
          const penetrationDistance = Math.min(maxValidDistance + 0.1, targetDistance);

          collisionPositionRef.current.copy(previousPositionRef.current);
          collisionPositionRef.current.addScaledVector(direction, penetrationDistance);
          object.position.copy(collisionPositionRef.current);
        }
      } else {
        slideDirectionXRef.current.set(direction.x, 0, 0).normalize();
        slideDirectionZRef.current.set(0, 0, direction.z).normalize();

        slidePositionXRef.current.copy(previousPositionRef.current);
        slidePositionXRef.current.addScaledVector(slideDirectionXRef.current, actualSpeed * delta * 0.7);

        if (
          onPositionCalculated &&
          onPositionCalculated(slidePositionXRef.current, previousPositionRef.current, slideDirectionXRef.current)
        ) {
          object.position.copy(slidePositionXRef.current);
        } else {
          slidePositionZRef.current.copy(previousPositionRef.current);
          slidePositionZRef.current.addScaledVector(slideDirectionZRef.current, actualSpeed * delta * 0.7);

          if (
            onPositionCalculated &&
            onPositionCalculated(slidePositionZRef.current, previousPositionRef.current, slideDirectionZRef.current)
          ) {
            object.position.copy(slidePositionZRef.current);
          }
        }
      }
    }
  };

  const reset = () => {
    currentTurnSpeed.current = 1;
    currentTurnDirection.current = 0;
    currentTilt.current = { x: 0, z: 0 };
    isInCollision.current = false;
  };

  const updateFrame = (params: {
    delta: number;
    controls?: MovementControlState;
    object: Object3D;
    movementCharacteristics: TurnCharacteristics & SpeedCharacteristics;
    checkCollision: (newPosition: Vector3, rotation: Quaternion) => boolean;
    isDisintegrated: boolean;
  }) => {
    if (params.isDisintegrated) {
      return {};
    }

    const actualSpeed = params.controls?.speed ?? 0;
    const tilt = updateTurning(params.delta, params.object, params.movementCharacteristics, params.controls);
    applyTilt(tilt, params.delta, params.movementCharacteristics.tiltSmoothness, params.object);

    directionRef.current.set(0, 0, -1);
    directionRef.current.applyQuaternion(params.object.quaternion);

    const checkCollisionWrapper = (newPosition: Vector3) => {
      return params.checkCollision(newPosition, params.object.quaternion);
    };

    updateAndApplyMovement(params.object, params.delta, directionRef.current, actualSpeed, checkCollisionWrapper);
  };

  return {
    reset,
    updateFrame,
  };
};
