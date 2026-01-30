import { RefObject, useRef } from 'react';
import { Vector3 } from 'three';
import { VehicleHandle } from '../object/vehicle/Vehicle';
import { useCollision } from '../collision/CollisionContext';
import { useTronStore } from '../state/TronStore';

interface ProgramPilotParams {
  characterId: string;
  characterRef: RefObject<VehicleHandle>;
  difficulty?: number;
}

export interface ProgramPilotDebugInfo {
  checkedCells: Vector3[];
  forwardDirection: Vector3 | null;
}

export const useProgramPilot = ({ characterId, characterRef, difficulty = 1 }: ProgramPilotParams) => {
  const targetPositionRef = useRef(new Vector3());
  const checkedCellsRef = useRef<Vector3[]>([]);
  const { isCellOccupied, getCellSize } = useCollision();
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);
  const gamePosition = useTronStore(state => state.game.position);

  const isOutsideBoundary = (x: number, z: number): boolean => {
    const halfSize = battlegroundSize / 2;
    const minX = gamePosition.x - halfSize;
    const maxX = gamePosition.x + halfSize;
    const minZ = gamePosition.z - halfSize;
    const maxZ = gamePosition.z + halfSize;
    return x < minX || x > maxX || z < minZ || z > maxZ;
  };

  const isCellBlocked = (x: number, z: number): boolean => {
    return isOutsideBoundary(x, z) || isCellOccupied(x, z);
  };

  const findBestDirection = (
    currentPos: Vector3,
    forward: Vector3,
    cellSize: number,
    maxSteps: number
  ): { direction: Vector3; straightClearDistance: number; turnAngle: number } => {
    const straightCheckedCells: Vector3[] = [];
    let straightBlocked = false;
    let straightClearDistance = maxSteps;

    for (let step = 2; step <= maxSteps; step++) {
      const testX = currentPos.x + forward.x * cellSize * step;
      const testZ = currentPos.z + forward.z * cellSize * step;

      straightCheckedCells.push(new Vector3(testX, 0, testZ));

      if (isCellBlocked(testX, testZ)) {
        straightBlocked = true;
        straightClearDistance = straightCheckedCells.length;
        break;
      }
    }

    if (!straightBlocked) {
      checkedCellsRef.current = straightCheckedCells;
      return { direction: forward.normalize(), straightClearDistance, turnAngle: 0 };
    }

    const scanAngles = [Math.PI / 12, -Math.PI / 12, Math.PI / 6, -Math.PI / 6]; // Right 15°, Left 15°, Right 30°, Left 30°

    for (const angle of scanAngles) {
      const testDir = forward.clone().applyAxisAngle(new Vector3(0, 1, 0), angle);
      const direcionDir = forward.clone().applyAxisAngle(new Vector3(0, 1, 0), 3 * angle);
      const checkedCells: Vector3[] = [];
      let blocked = false;

      // Check cells along this direction
      for (let step = 2; step <= maxSteps; step++) {
        const testX = currentPos.x + testDir.x * cellSize * step;
        const testZ = currentPos.z + testDir.z * cellSize * step;

        checkedCells.push(new Vector3(testX, 0, testZ));

        if (isCellBlocked(testX, testZ)) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        checkedCellsRef.current = checkedCells;
        return { direction: direcionDir.normalize(), straightClearDistance, turnAngle: Math.abs(angle * 3) };
      }
    }

    checkedCellsRef.current = [];
    return {
      direction: forward
        .clone()
        .applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
        .normalize(),
      straightClearDistance,
      turnAngle: Math.PI / 2,
    };
  };

  return () => {
    const vehicle = characterRef.current?.getObject();
    if (!vehicle) return { position: null, speed: 0, debugInfo: { checkedCells: [], forwardDirection: null } };

    const movementCharacteristics = characterRef.current?.getParams();
    const maxSpeed = movementCharacteristics?.maxSpeed ?? 0;
    const cellSize = getCellSize();

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(vehicle.quaternion);
    forward.normalize();

    const maxSteps = 24 * difficulty;
    const {
      direction: bestDirection,
      straightClearDistance,
      turnAngle,
    } = findBestDirection(vehicle.position, forward, cellSize, maxSteps);

    const distanceMultiplier = Math.min(1, Math.pow(straightClearDistance / maxSteps, 2));
    const angleMultiplier = 1 - turnAngle / Math.PI;
    const speedMultiplier = distanceMultiplier * angleMultiplier;
    const targetSpeed = maxSpeed * Math.max(0.1, speedMultiplier);
    const targetDistance = targetSpeed;

    const targetPosition = new Vector3(
      vehicle.position.x + bestDirection.x * targetDistance,
      vehicle.position.y + bestDirection.y * targetDistance,
      vehicle.position.z + bestDirection.z * targetDistance
    );

    targetPositionRef.current.copy(targetPosition);

    const forwardPos = new Vector3(
      vehicle.position.x + forward.x * cellSize * 3,
      vehicle.position.y,
      vehicle.position.z + forward.z * cellSize * 3
    );

    return {
      position: targetPositionRef.current,
      speed: targetSpeed,
      debugInfo: {
        checkedCells: [...checkedCellsRef.current],
        forwardDirection: forwardPos,
      },
    };
  };
};
