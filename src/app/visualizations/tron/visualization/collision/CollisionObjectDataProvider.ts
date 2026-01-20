import * as THREE from 'three';

export function getCollisionObjectData({
  id,
  position,
  rotation,
  size,
  localCenter = new THREE.Vector3(0, 0, 0),
  type,
  playerId,
}: {
  id: string;
  position: THREE.Vector3 | [number, number, number];
  rotation: THREE.Euler | THREE.Quaternion | [number, number, number];
  size: THREE.Vector3;
  localCenter?: THREE.Vector3;
  type: 'vehicle' | 'wall' | 'worldObject';
  playerId?: string;
}) {
  const halfSize = size.clone().multiplyScalar(0.5);
  const worldPosition = position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(...position);
  let quaternion: THREE.Quaternion;
  if (rotation instanceof THREE.Quaternion) {
    quaternion = rotation.clone();
  } else if (rotation instanceof THREE.Euler) {
    quaternion = new THREE.Quaternion().setFromEuler(rotation);
  } else {
    quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation));
  }
  const localCorners = [
    new THREE.Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
    new THREE.Vector3(halfSize.x, -halfSize.y, -halfSize.z),
    new THREE.Vector3(-halfSize.x, halfSize.y, -halfSize.z),
    new THREE.Vector3(halfSize.x, halfSize.y, -halfSize.z),
    new THREE.Vector3(-halfSize.x, -halfSize.y, halfSize.z),
    new THREE.Vector3(halfSize.x, -halfSize.y, halfSize.z),
    new THREE.Vector3(-halfSize.x, halfSize.y, halfSize.z),
    new THREE.Vector3(halfSize.x, halfSize.y, halfSize.z),
  ];

  const worldCenter = localCenter.clone().applyQuaternion(quaternion).add(worldPosition);

  const orientedCorners = localCorners.map(corner => {
    const worldCorner = corner.clone();
    worldCorner.add(localCenter);
    worldCorner.applyQuaternion(quaternion);
    worldCorner.add(worldPosition);
    return worldCorner;
  });
  const boundingBox = new THREE.Box3();
  boundingBox.setFromPoints(orientedCorners);
  return {
    id,
    position: worldCenter,
    boundingBox,
    orientedCorners,
    type,
    playerId,
  };
}
