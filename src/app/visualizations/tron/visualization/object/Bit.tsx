import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Group, BufferGeometry, Vector3, Float32BufferAttribute } from 'three';

interface BitProps {
  position?: [number, number, number];
  scale?: number;
  activated?: boolean;
}

export const Bit = ({ position = [0, 0, 0], scale = 1, activated = false }: BitProps) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<any>(null);
  const activationRef = useRef(0);
  const timeRef = useRef(0);

  const spikyGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = 0.04;
    const baseSpikeHeight = 0.01;
    const extendedSpikeHeight = 0.07;

    const vertices = [
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, 1],
      [1, -1, -1],
      [-1, 1, 1],
      [-1, 1, -1],
      [-1, -1, 1],
      [-1, -1, -1],
      [0, 1 / phi, phi],
      [0, 1 / phi, -phi],
      [0, -1 / phi, phi],
      [0, -1 / phi, -phi],
      [1 / phi, phi, 0],
      [1 / phi, -phi, 0],
      [-1 / phi, phi, 0],
      [-1 / phi, -phi, 0],
      [phi, 0, 1 / phi],
      [phi, 0, -1 / phi],
      [-phi, 0, 1 / phi],
      [-phi, 0, -1 / phi],
    ].map(v => v.map(c => c * scale));

    const faces = [
      [0, 16, 2, 10, 8],
      [0, 8, 4, 14, 12],
      [0, 12, 1, 17, 16],
      [1, 9, 11, 3, 17],
      [1, 12, 14, 5, 9],
      [2, 13, 15, 6, 10],
      [2, 16, 17, 3, 13],
      [3, 11, 7, 15, 13],
      [4, 8, 10, 6, 18],
      [4, 18, 19, 5, 14],
      [5, 19, 7, 11, 9],
      [6, 15, 7, 19, 18],
    ];

    const positions: number[] = [];
    const morphPositions: number[] = [];

    faces.forEach(face => {
      // Calculate center of pentagon face
      const center = new Vector3();
      face.forEach(idx => {
        center.add(new Vector3(vertices[idx][0], vertices[idx][1], vertices[idx][2]));
      });
      center.divideScalar(face.length);

      // Calculate spike tips with different heights
      const normal = center.clone().normalize();
      const baseTip = center.clone().add(normal.clone().multiplyScalar(baseSpikeHeight));
      const extendedTip = center.clone().add(normal.clone().multiplyScalar(extendedSpikeHeight));

      // Create triangles from pentagon edges to spike tip
      for (let i = 0; i < face.length; i++) {
        const v1 = vertices[face[i]];
        const v2 = vertices[face[(i + 1) % face.length]];

        // Base geometry positions
        positions.push(v1[0], v1[1], v1[2]);
        positions.push(baseTip.x, baseTip.y, baseTip.z);
        positions.push(v2[0], v2[1], v2[2]);

        // Morph target positions (extended spikes)
        morphPositions.push(v1[0], v1[1], v1[2]);
        morphPositions.push(extendedTip.x, extendedTip.y, extendedTip.z);
        morphPositions.push(v2[0], v2[1], v2[2]);
      }
    });

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.morphAttributes.position = [new Float32BufferAttribute(morphPositions, 3)];
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    timeRef.current += delta;
    const frequency = activated ? 10 : 1;
    const pulseAmount = Math.sin(timeRef.current * frequency) * 0.5;
    const targetActivation = activated ? 2.5 + 5 * pulseAmount : pulseAmount;
    activationRef.current += (targetActivation - activationRef.current) * delta * 5;
    if (meshRef.current.morphTargetInfluences) {
      meshRef.current.morphTargetInfluences[0] = activationRef.current;
    }
    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.03;
  });

  const getColor = (t: number) => {
    const r = Math.floor(120 + t * 135);
    const g = Math.floor(100 - t * 100);
    const b = Math.floor(255 - t * 155);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh ref={meshRef} geometry={spikyGeometry} morphTargetInfluences={[0]}>
        <meshStandardMaterial
          color={getColor(activationRef.current)}
          emissive={getColor(activationRef.current)}
          emissiveIntensity={0.5 + activationRef.current * 0.3}
          metalness={0.8 + activationRef.current * 0.1}
          roughness={0.2 - activationRef.current * 0.1}
        />
      </mesh>
    </group>
  );
};
