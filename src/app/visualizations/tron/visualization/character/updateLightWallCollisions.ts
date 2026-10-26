import { Box3, Vector3 } from 'three';
import { CollisionObject } from '../collision/CollisionContext';

export interface LightWallPoint {
  id: string;
  lower: Vector3;
  upper: Vector3;
}

interface WallCollisionUpdate {
  points: LightWallPoint[];
  spawnPosition: Vector3;
  thickness: number;
  playerId?: string;
  registeredSegments: Set<string>;
  registerObject: (object: CollisionObject) => void;
  unregisterObject: (id: string) => void;
}

export function updateLightWallCollisions({
  points,
  spawnPosition,
  thickness,
  playerId,
  registeredSegments,
  registerObject,
  unregisterObject,
}: WallCollisionUpdate) {
  const currentSegments = new Set<string>();
  const outsideExclusionZone = (point: Vector3) =>
    Math.abs(point.x - spawnPosition.x) > 1 || Math.abs(point.z - spawnPosition.z) > 1;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    if (!outsideExclusionZone(start.lower) || !outsideExclusionZone(end.lower)) continue;

    currentSegments.add(start.id);
    // Points are immutable and IDs survive eviction of the oldest trail point.
    if (registeredSegments.has(start.id)) continue;

    const offset = new Vector3()
      .subVectors(end.lower, start.lower)
      .normalize()
      .cross(new Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(thickness / 2);
    const corners = [start.lower, start.upper, end.lower, end.upper].flatMap(point => [
      new Vector3(point.x - offset.x, point.y, point.z - offset.z),
      new Vector3(point.x + offset.x, point.y, point.z + offset.z),
    ]);
    const boundingBox = new Box3().setFromPoints(corners);
    registerObject({
      id: start.id,
      position: boundingBox.getCenter(new Vector3()),
      boundingBox,
      orientedCorners: corners,
      type: 'wall',
      playerId,
    });
  }

  registeredSegments.forEach(id => {
    if (!currentSegments.has(id)) unregisterObject(id);
  });
  registeredSegments.clear();
  currentSegments.forEach(id => registeredSegments.add(id));
}
