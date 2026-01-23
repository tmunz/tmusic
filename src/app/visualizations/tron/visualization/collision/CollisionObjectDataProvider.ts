import * as THREE from 'three';

export function getCollisionObjectData({
  id,
  boundingBox,
  position,
  rotation,
  ...data
}: {
  id: string;
  boundingBox: THREE.Box3;
  position: THREE.Vector3;
  rotation: THREE.Euler | THREE.Quaternion | [number, number, number];
  [key: string]: any;
}) {
  const size = new THREE.Vector3();
  const localCenter = new THREE.Vector3();
  boundingBox.getSize(size);
  boundingBox.getCenter(localCenter);

  const halfSize = size.clone().multiplyScalar(0.5);

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

  const worldCenter = localCenter.clone().applyQuaternion(quaternion).add(position);

  const orientedCorners = localCorners.map(corner => {
    const worldCorner = corner.clone();
    worldCorner.add(localCenter);
    worldCorner.applyQuaternion(quaternion);
    worldCorner.add(position);
    return worldCorner;
  });
  const collisionBox = new THREE.Box3();
  collisionBox.setFromPoints(orientedCorners);
  return {
    id,
    position: worldCenter,
    boundingBox: collisionBox,
    orientedCorners,
    ...data,
  };
}
