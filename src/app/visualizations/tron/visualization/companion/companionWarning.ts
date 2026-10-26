import { Vector3 } from 'three';
import { Mode } from '../state/TronState';
import { SpeedCharacteristics } from '../movement/SpeedCharactersistic';

interface ArenaPosition {
  x: number;
  z: number;
}

export function getCompanionWarningLevel(
  mode: Mode,
  position: Vector3,
  arena: ArenaPosition,
  size: number,
  remaining: number,
  disintegrated: boolean
) {
  if (mode !== Mode.LIGHTCYCLE_BATTLE || disintegrated) return 0;
  if (Math.abs(position.x - arena.x) <= size / 2 && Math.abs(position.z - arena.z) <= size / 2) return 0;
  return 0.2 + 0.8 * (1 - Math.max(0, Math.min(5, remaining)) / 5);
}

export function getCompanionWarningPose(
  player: Vector3,
  arena: ArenaPosition,
  anger: number,
  time: number,
  verticalOffset: number,
  position: Vector3,
  direction: Vector3
) {
  // Keep all warning gestures on the line from the rider to the arena center.
  direction.set(arena.x - player.x, 0, arena.z - player.z).normalize();
  const frequency = 2.5 + anger * 3;
  const beckon = (1 - Math.cos(time * frequency)) / 2;
  const distance = 1.05 - anger * 0.5 + beckon * (2.5 + anger * 3);
  position.set(
    player.x + direction.x * distance,
    player.y + Math.max(0.55, verticalOffset * 0.6),
    player.z + direction.z * distance
  );
}

export function advanceCompanionWarningMovement(
  position: Vector3,
  target: Vector3,
  currentSpeed: number,
  delta: number,
  characteristics: SpeedCharacteristics,
  displacement: Vector3
) {
  const dt = Math.max(0, Math.min(delta, 0.1));
  const distance = displacement.subVectors(target, position).length();
  const { maxSpeed, acceleration, deceleration } = characteristics;
  const targetSpeed = Math.min(maxSpeed, distance * 8, Math.sqrt(2 * deceleration * distance));
  const speed =
    targetSpeed > currentSpeed
      ? Math.min(targetSpeed, currentSpeed + acceleration * dt)
      : Math.max(targetSpeed, currentSpeed - deceleration * dt);
  if (distance > 0) position.addScaledVector(displacement, Math.min(distance, speed * dt) / distance);
  return speed;
}
