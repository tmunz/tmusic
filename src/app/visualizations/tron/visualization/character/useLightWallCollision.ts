import { useCallback } from 'react';
import { Quaternion, Vector3 } from 'three';
import { useCollision as useCollisionSystem } from '../collision/CollisionContext';
import { registerCollisionObject } from '../collision/useCollisionObject';
import { VehicleHandle } from '../object/vehicle/Vehicle';

interface UseLightWallCollisionParams {
  id: string;
  ref: React.RefObject<VehicleHandle>;
  onCollision: (wallPlayerId: string) => void;
}

export const useLightWallCollision = ({ id, ref, onCollision }: UseLightWallCollisionParams) => {
  const { registerObject, checkCollision, getObjectById } = useCollisionSystem();

  const checkCollisionAtPosition = useCallback(
    (position: Vector3, rotation: Quaternion): boolean => {
      const boundingBox = ref.current?.getBoundingBox();
      if (!boundingBox) return true;

      registerCollisionObject({
        registerObject,
        id,
        boundingBox: boundingBox,
        position,
        rotation: rotation,
        data: { type: 'player', playerId: id },
      });

      const regigsterdCollicionObject = getObjectById(id);
      if (regigsterdCollicionObject) {
        const collisions = checkCollision(regigsterdCollicionObject);

        if (collisions.length > 0) {
          const wallCollision = collisions.find(c => c.type === 'wall');
          if (wallCollision) {
            onCollision(wallCollision.playerId);
          }
          return false;
        }
      }
      return true;
    },
    [id, ref, onCollision, registerObject, checkCollision, getObjectById]
  );

  return { checkCollisionAtPosition };
};
