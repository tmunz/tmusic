import { useFrame } from '@react-three/fiber';
import { RefObject, useLayoutEffect, useRef, useMemo } from 'react';
import {
  Color,
  Group,
  BufferGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
  Float32BufferAttribute,
} from 'three';

interface BitProps {
  position?: [number, number, number];
  scale?: number;
  activated?: boolean;
  warningLevel?: RefObject<number>;
}

export const Bit = ({ position = [0, 0, 0], scale = 1, activated = false, warningLevel }: BitProps) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh<BufferGeometry, MeshStandardMaterial>>(null);
  const extraSpikes = useRef<InstancedMesh>(null);
  const pointer = useRef<Mesh>(null);
  const calmColor = useMemo(() => new Color('#7864ff'), []);
  const angryColor = useMemo(() => new Color('#ff3b08'), []);
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

  useLayoutEffect(() => {
    if (!extraSpikes.current) return;
    const matrix = new Matrix4();
    const direction = new Vector3();
    const position = new Vector3();
    const rotation = new Quaternion();
    const up = new Vector3(0, 1, 0);
    const size = new Vector3(1, 1, 1);
    // Secondary spikes are allocated once and progressively revealed as anger rises.
    for (let i = 0; i < 20; i++) {
      const y = 1 - (2 * (i + 0.5)) / 20;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      direction.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      position.copy(direction).multiplyScalar(0.105);
      rotation.setFromUnitVectors(up, direction);
      matrix.compose(position, rotation, size);
      extraSpikes.current.setMatrixAt(i, matrix);
    }
    extraSpikes.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;
    timeRef.current += delta;
    const anger = Math.max(0, Math.min(1, warningLevel?.current ?? 0));
    const frequency = anger > 0.01 ? 5 + anger * 9 : activated ? 10 : 1;
    const pulse = (Math.sin(timeRef.current * frequency) + 1) / 2;
    const spikePulse = 0.35 + 0.65 * pulse * pulse;
    const targetActivation =
      anger > 0.01 ? 0.25 + anger * (0.5 + 3.5 * pulse * pulse) : activated ? 5 * pulse : pulse - 0.5;
    activationRef.current += (targetActivation - activationRef.current) * (1 - Math.exp(-delta * 18));
    if (meshRef.current.morphTargetInfluences) {
      meshRef.current.morphTargetInfluences[0] = activationRef.current;
    }
    const material = meshRef.current.material;
    material.color.copy(calmColor).lerp(angryColor, anger);
    material.emissive.copy(material.color);
    material.emissiveIntensity = 0.5 + anger * (0.8 + pulse);
    material.roughness = 0.2 - anger * 0.1;
    groupRef.current.rotation.x += delta * (0.1 + anger * 2);
    groupRef.current.rotation.y += delta * (0.03 + anger * 3);
    groupRef.current.scale.setScalar(1 + anger * 0.4 + pulse * anger * 0.12);
    if (extraSpikes.current) {
      extraSpikes.current.count = Math.round(20 * anger);
      extraSpikes.current.scale.setScalar(0.55 + spikePulse * (0.5 + anger * 0.7));
      const spikeMaterial = extraSpikes.current.material as MeshStandardMaterial;
      spikeMaterial.color.copy(material.color);
      spikeMaterial.emissive.copy(material.emissive);
      spikeMaterial.emissiveIntensity = material.emissiveIntensity;
    }
    if (pointer.current) {
      pointer.current.visible = anger > 0.05;
      pointer.current.scale.set(1 + anger, 0.45 + spikePulse * (0.7 + anger * 0.7), 1 + anger);
      const pointerMaterial = pointer.current.material as MeshStandardMaterial;
      pointerMaterial.color.copy(material.color);
      pointerMaterial.emissive.copy(material.emissive);
      pointerMaterial.emissiveIntensity = material.emissiveIntensity;
    }
  });

  return (
    <group position={position} scale={scale}>
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={spikyGeometry} morphTargetInfluences={[0]}>
          <meshStandardMaterial
            color="#7864ff"
            emissive="#7864ff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <instancedMesh ref={extraSpikes} args={[undefined, undefined, 20]} count={0} frustumCulled={false}>
          <coneGeometry args={[0.013, 0.11, 5]} />
          <meshStandardMaterial
            color="#7864ff"
            emissive="#7864ff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.15}
          />
        </instancedMesh>
      </group>
      {/* Keep the pointing spike outside the spinning body so it always aims toward safety. */}
      <mesh ref={pointer} position={[0, 0, -0.21]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <coneGeometry args={[0.025, 0.28, 5]} />
        <meshStandardMaterial
          color="#ff3b08"
          emissive="#ff3b08"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
};
