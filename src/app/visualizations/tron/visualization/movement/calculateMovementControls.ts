import { Object3D, Vector3 } from 'three';
import { MovementControlState } from './MovementControlState';

export const calculateMovementControls = (
  object: Object3D,
  targetPosition: Vector3,
  currentSpeed: number,
  includePitch: boolean = false
): MovementControlState => {
  const directionToTarget = new Vector3().subVectors(targetPosition, object.position);
  const targetAngle = Math.atan2(-directionToTarget.x, -directionToTarget.z);
  let angleDiff = targetAngle - object.rotation.y;
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
  const direction = Math.max(-1, Math.min(1, angleDiff));

  const movementControls: MovementControlState = {
    speed: currentSpeed,
    direction,
  };

  if (includePitch) {
    const horizontalDistance = Math.sqrt(directionToTarget.x ** 2 + directionToTarget.z ** 2);
    const targetPitch = Math.atan2(directionToTarget.y, horizontalDistance);
    let pitchDiff = targetPitch - object.rotation.x;
    pitchDiff = Math.atan2(Math.sin(pitchDiff), Math.cos(pitchDiff));
    movementControls.pitch = Math.max(-1, Math.min(1, pitchDiff * 2));
  }

  return movementControls;
};
