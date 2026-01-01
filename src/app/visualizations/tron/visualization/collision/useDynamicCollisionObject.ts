import { useEffect } from 'react';
import * as THREE from 'three';
import { useCollision } from './CollisionContext';
import { getCollisionObjectData } from './CollisionObjectDataProvider';

interface UseDynamicCollisionObjectParams {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler | THREE.Quaternion;
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  type: 'vehicle' | 'wall' | 'worldObject';
}

export const useDynamicCollisionObject = ({
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  type,
}: UseDynamicCollisionObjectParams) => {
  const { registerObject, unregisterObject } = useCollision();

  useEffect(() => {
    return () => {
      unregisterObject(id);
    };
  }, [id, unregisterObject]);

  const update = () => {
    const data = getCollisionObjectData({ id, position, rotation, size, localCenter, type });
    registerObject(data);
  };

  return update;
};

export function registerDynamicCollisionObject({
  registerObject,
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  type,
}: {
  registerObject: (obj: any) => void;
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler | THREE.Quaternion;
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  type: 'vehicle' | 'wall' | 'worldObject';
}) {
  const data = getCollisionObjectData({ id, position, rotation, size, localCenter, type });
  registerObject(data);
}
