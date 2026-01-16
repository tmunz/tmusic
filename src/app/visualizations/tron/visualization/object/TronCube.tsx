import * as THREE from 'three';
import { useMemo } from 'react';
import { useCollisionObject } from '../collision/useCollisionObject';

interface TronCubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  color?: string;
  baseColor?: string;
  id: string;
  lineWidth?: number;
}

export const TronCube = ({
  position,
  rotation = [0, 0, 0],
  size = 1,
  color = '#ffffff',
  baseColor = '#000000',
  id,
  lineWidth = 0.01,
}: TronCubeProps) => {
  useCollisionObject({
    id,
    position,
    rotation,
    size: new THREE.Vector3(size, size, size),
    type: 'worldObject',
  });

  const edges = useMemo(() => {
    const halfSize = size / 2;
    const edgePositions = [
      // Bottom square
      [
        [-halfSize, -halfSize, -halfSize],
        [halfSize, -halfSize, -halfSize],
      ],
      [
        [halfSize, -halfSize, -halfSize],
        [halfSize, -halfSize, halfSize],
      ],
      [
        [halfSize, -halfSize, halfSize],
        [-halfSize, -halfSize, halfSize],
      ],
      [
        [-halfSize, -halfSize, halfSize],
        [-halfSize, -halfSize, -halfSize],
      ],
      // Top square
      [
        [-halfSize, halfSize, -halfSize],
        [halfSize, halfSize, -halfSize],
      ],
      [
        [halfSize, halfSize, -halfSize],
        [halfSize, halfSize, halfSize],
      ],
      [
        [halfSize, halfSize, halfSize],
        [-halfSize, halfSize, halfSize],
      ],
      [
        [-halfSize, halfSize, halfSize],
        [-halfSize, halfSize, -halfSize],
      ],
      // Vertical edges
      [
        [-halfSize, -halfSize, -halfSize],
        [-halfSize, halfSize, -halfSize],
      ],
      [
        [halfSize, -halfSize, -halfSize],
        [halfSize, halfSize, -halfSize],
      ],
      [
        [halfSize, -halfSize, halfSize],
        [halfSize, halfSize, halfSize],
      ],
      [
        [-halfSize, -halfSize, halfSize],
        [-halfSize, halfSize, halfSize],
      ],
    ];

    return edgePositions.map(([start, end]) => {
      const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      const direction = new THREE.Vector3().subVectors(endVec, startVec);
      const length = direction.length();
      const center = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

      return { center, direction: direction.normalize(), length };
    });
  }, [size]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      {edges.map(({ center, direction, length }, i) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        return (
          <mesh key={i} position={center} quaternion={quaternion}>
            <cylinderGeometry args={[lineWidth, lineWidth, length, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};
