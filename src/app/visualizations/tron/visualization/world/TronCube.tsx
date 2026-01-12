import * as THREE from 'three';
import { useCollisionObject } from '../collision/useCollisionObject';

interface TronCubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  color?: string;
  baseColor?: string;
  id: string;
}

export const TronCube = ({
  position,
  rotation = [0, 0, 0],
  size = 1,
  color = 'white',
  baseColor = 'black',
  id,
}: TronCubeProps) => {
  useCollisionObject({
    id,
    position,
    rotation,
    size: new THREE.Vector3(size, size, size),
    type: 'worldObject',
  });

  return (
    <>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      <lineSegments position={position} rotation={rotation}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>
    </>
  );
};
