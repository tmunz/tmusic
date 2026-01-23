import { useMemo } from 'react';
import { useCollisionObject } from '../collision/useCollisionObject';
import { Quaternion, Vector3, Box3 } from 'three';

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
  const boundingBox = useMemo(() => {
    const sizeVector = new Vector3(size, size, size);
    return new Box3().setFromCenterAndSize(new Vector3(0, 0, 0), sizeVector);
  }, [size]);

  const posVector = useMemo(() => new Vector3(...position), [position]);

  useCollisionObject({
    id,
    boundingBox,
    position: posVector,
    rotation,
    data: {
      type: 'worldObject',
    },
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
      const startVec = new Vector3(...start);
      const endVec = new Vector3(...end);
      const direction = new Vector3().subVectors(endVec, startVec);
      const length = direction.length();
      const center = new Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

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
        const quaternion = new Quaternion();
        quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);

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
