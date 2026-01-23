import { useEffect, useRef, useCallback } from 'react';
import { Box3, Euler, Quaternion, Vector3 } from 'three';
import { useCollision } from './CollisionContext';
import { getCollisionObjectData } from './CollisionObjectDataProvider';

interface UseCollisionObjectParams {
  id: string;
  boundingBox: Box3;
  position: Vector3;
  rotation: Euler | Quaternion | [number, number, number];
  data: Record<string, any>;
  dynamic?: boolean;
}

export const useCollisionObject = ({
  id,
  boundingBox,
  position,
  rotation,
  data,
  dynamic = false,
}: UseCollisionObjectParams) => {
  const { registerObject, unregisterObject } = useCollision();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!dynamic && !registeredRef.current) {
      const objectData = getCollisionObjectData({ id, boundingBox, position, rotation, ...data });
      registerObject(objectData);
      registeredRef.current = true;
    }
    return () => {
      if (registeredRef.current) {
        unregisterObject(id);
        registeredRef.current = false;
      } else if (dynamic) {
        unregisterObject(id);
      }
    };
  }, [id, dynamic]);

  const update = useCallback(() => {
    if (dynamic) {
      const objectData = getCollisionObjectData({ id, boundingBox, position, rotation, ...data });
      registerObject(objectData);
    }
  }, [dynamic, id, boundingBox, position, rotation, data, registerObject]);

  return dynamic ? update : undefined;
};

export function registerCollisionObject({
  registerObject,
  id,
  boundingBox,
  position,
  rotation,
  data,
}: {
  registerObject: (obj: any) => void;
  id: string;
  boundingBox: Box3;
  position: Vector3;
  rotation: Euler | Quaternion;
  data: Record<string, any>;
}) {
  const objectData = getCollisionObjectData({ id, boundingBox, position, rotation, ...data });
  registerObject(objectData);
}
