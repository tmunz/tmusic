import { useEffect } from 'react';
import * as THREE from 'three';
import { useCollision } from './CollisionContext';
import { getCollisionObjectData } from './CollisionObjectDataProvider';

interface UseCollisionObjectParams {
  id: string;
  position: THREE.Vector3 | [number, number, number];
  rotation: THREE.Euler | THREE.Quaternion | [number, number, number];
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  type: 'vehicle' | 'wall' | 'worldObject';
}

export const useCollisionObject = ({
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  type,
}: UseCollisionObjectParams) => {
  const { registerObject, unregisterObject } = useCollision();

  useEffect(() => {
    const data = getCollisionObjectData({ id, position, rotation, size, localCenter, type });
    registerObject(data);
    return () => {
      unregisterObject(id);
    };
  }, [id, position, rotation, size, localCenter, type, registerObject, unregisterObject]);
};
