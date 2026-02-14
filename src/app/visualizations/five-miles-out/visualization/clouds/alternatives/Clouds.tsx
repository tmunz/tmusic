import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group } from 'three';
import { random } from '../../../../../utils/Random';

export interface CloudsProps {
  amount?: number;
  basePosition?: [number, number, number];
  density?: number;
}

interface CloudData {
  position: [number, number, number];
  opacity: number;
  color: string;
  scale: number;
}

export const Clouds = ({ amount = 10, basePosition = [0, 0, 0], density = 1.0 }: CloudsProps) => {
  const BASE_DISTANCE = 50;

  const CLOUDS: CloudData[] = Array.from({ length: amount }, (_, i) => ({
    position: [basePosition[0], basePosition[1], basePosition[2] - i * BASE_DISTANCE * density],
    opacity: 0.6,
    color: `#${Math.floor((random(i) / 8 + 0.2) * 255)
      .toString(16)
      .padStart(2, '0')
      .repeat(3)}`,
    scale: 10.0 + (random(i + 1982 - 3 - 19) - 0.5) * 5.0,
  }));

  const spawnDistance = BASE_DISTANCE * density * CLOUDS.length;

  const cloudRefs = useRef<(Group | null)[]>([]);
  const cloudBasePositions = useRef<[number, number, number][]>(CLOUDS.map(c => c.position));
  const cloudData = useRef(
    CLOUDS.map((c, i) => ({
      opacity: 0.0,
      seed: i,
    }))
  );
  const lastSpawnPoint = useRef<number>(basePosition[2]);

  const updateCloudOpacity = useCallback((cloud: Group, index: number, opacity: number, delta: number = 0) => {
    cloudData.current[index].opacity = opacity + delta * 0.01;
    cloud.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.opacity = cloudData.current[index].opacity;
      }
    });
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera;

    cloudRefs.current.forEach((cloud, index) => {
      if (!cloud) return;
      const relativeZ = cloud.position.z - camera.position.z;
      const distanceFromLastSpawn = camera.position.z - lastSpawnPoint.current;
      const respawnThreshold = BASE_DISTANCE * density;

      if (relativeZ > 0 && Math.abs(distanceFromLastSpawn) >= respawnThreshold) {
        const originalPos = CLOUDS[index].position;
        updateCloudOpacity(cloud, index, 0.0);
        const newZ = camera.position.z - spawnDistance;
        const newX = originalPos[0] + (Math.random() - 0.5) * 30;
        const newY = originalPos[1] + (Math.random() - 0.5) * 10;
        cloud.position.set(newX, newY, newZ);
        cloudBasePositions.current[index] = [newX, newY, newZ];
        lastSpawnPoint.current = camera.position.z;
        cloudData.current[index].seed += amount;
      }

      const currentOpacity = cloudData.current[index].opacity;
      if (currentOpacity < CLOUDS[index].opacity) {
        updateCloudOpacity(cloud, index, currentOpacity, delta);
      }
    });
  });

  return (
    <>
      {CLOUDS.map((c, index) => (
        <group key={index} ref={el => (cloudRefs.current[index] = el)} position={c.position} scale={c.scale}>
          <Cloud color={c.color} segments={c.scale > 2 ? 30 : 20} seed={cloudData.current[index].seed} />
        </group>
      ))}
    </>
  );
};
