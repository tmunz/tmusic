import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useCollision } from './CollisionContext';
import { getCollisionObjectData } from './CollisionObjectDataProvider';

interface UseCollisionObjectParams {
  id: string;
  position: THREE.Vector3 | [number, number, number];
  rotation: THREE.Euler | THREE.Quaternion | [number, number, number];
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  data: Record<string, any>;
  dynamic?: boolean;
}

export const useCollisionObject = ({
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  data,
  dynamic = false,
}: UseCollisionObjectParams) => {
  const { registerObject, unregisterObject } = useCollision();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!dynamic && !registeredRef.current) {
      const objectData = getCollisionObjectData({ id, position, rotation, size, localCenter, ...data });
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
      const objectData = getCollisionObjectData({ id, position, rotation, size, localCenter, ...data });
      registerObject(objectData);
    }
  }, [dynamic, id, position, rotation, size, localCenter, data, registerObject]);

  return dynamic ? update : undefined;
};

// Helper function for direct registration without hook
export function registerCollisionObject({
  registerObject,
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  data,
}: {
  registerObject: (obj: any) => void;
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler | THREE.Quaternion;
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  data: Record<string, any>;
}) {
  const objectData = getCollisionObjectData({ id, position, rotation, size, localCenter, ...data });
  registerObject(objectData);
}
