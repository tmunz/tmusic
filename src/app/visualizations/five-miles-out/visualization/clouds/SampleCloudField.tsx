import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Vector3 } from 'three';
import { useReferenceObject } from '../../../../utils/ReferenceObjectContext';
import { createDummySampleProvider, SampleProvider } from '../../../../audio/SampleProvider';
import { random } from '../../../../utils/Random';
import { useSampleProviderActive } from '../../../../audio/useSampleProviderActive';

export interface SampleCloudFieldProps {
  position?: [number, number, number];
  size?: number;
  sampleProvider?: SampleProvider;
  heightScale?: number;
}

export const SampleCloudField = ({
  position = [0, 0, 0],
  size = 1000,
  sampleProvider,
  heightScale = 1
}: SampleCloudFieldProps) => {
  const isActive = useSampleProviderActive(sampleProvider ?? createDummySampleProvider(1, 1));

  const groupRef = useRef<any>(null);
  const { referenceObjectRef } = useReferenceObject();
  const cloudRefs = useRef<any[]>([]);
  const cloudMaterialRefs = useRef<any[]>([]);
  const gridSize = 10;
  const itemSize = size / gridSize;

  const cloudGrid = useMemo(() => {
    const clouds = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const normalizedX = x / (gridSize - 1);
        const normalizedZ = z / (gridSize - 1);
        clouds.push({
          id: `${x}-${z}`,
          x,
          z,
          posX: (normalizedX - 0.5) * size + random(x * gridSize + z) * itemSize,
          posZ: (normalizedZ - 0.5) * size + random(0.1 + (x * gridSize + z)) * itemSize,
          normalizedX,
          normalizedZ,
        });
      }
    }
    return clouds;
  }, [gridSize, size]);

  const positionDisformation = (x: number, y: number): number => {
    return (Math.pow(1.3 - x, 10) - y) * 100.0;
  };

  useFrame(() => {
    if (!groupRef.current || !referenceObjectRef.current) return;

    const worldPos = new Vector3();
    referenceObjectRef.current.getWorldPosition(worldPos);

    const offsetX = worldPos.x - position[0];
    const offsetZ = worldPos.z - position[2];

    cloudRefs.current.forEach((cloudRef, index) => {
      if (!cloudRef) return;
      const cloud = cloudGrid[index];

      const newX = cloud.posX - offsetX;
      const newZ = cloud.posZ - offsetZ;
      cloudRef.position.x = ((newX + size / 2) % size + size) % size - size / 2;
      cloudRef.position.z = ((newZ + size / 2) % size + size) % size - size / 2;

      const normalizedX = (cloudRef.position.x + size / 2) / size;
      const normalizedZ = (cloudRef.position.z + size / 2) / size;

      const zDistance = cloudRef.position.z + size / 2;
      const fadeThreshold = size * 0.8;
      const opacity = Math.min(1, Math.max(0, zDistance / fadeThreshold));

      let sampleValue = 0;

      if (sampleProvider) {
        const sampleSize = sampleProvider.sampleSize;
        const frequencyBands = sampleProvider.frequencyBands;
        const sampleIndex = Math.max(0, Math.floor(normalizedZ * (sampleSize - 1)));
        const frequencyIndex = Math.max(0, Math.floor(normalizedX * (frequencyBands - 1)));
        sampleValue = sampleProvider.get(sampleIndex)[frequencyIndex] / 255;
      }

      if (cloudMaterialRefs.current[index]) {
        cloudMaterialRefs.current[index].forEach((material: any) => {
          material.opacity = opacity;
          const colorX = 1 - Math.pow(normalizedX - 0.9, 6);
          const lightX = normalizedX - 0.2;
          material.color.setHSL(
            (normalizedX / 4.) % 1,
            Math.max(1.4 - 1.2 * normalizedZ - colorX * 0.6, 0),
            Math.max(lightX + colorX * 0.5 - normalizedZ, 0)
          );
        });
      }

      // (positionDisformation(normalizedX, normalizedZ)
      cloudRef.position.y = -itemSize + (1 - normalizedZ) * -position[1] + Math.pow(sampleValue, 4) * 200 * heightScale;
    });

    groupRef.current.position.set(worldPos.x + position[0], position[1], worldPos.z + position[2]);
  });

  return (
    <group ref={groupRef} position={position}>
      {cloudGrid.map((cloud, index) => (
        <group
          key={cloud.id}
          position={[cloud.posX, -itemSize, cloud.posZ]}
          ref={(el) => {
            cloudRefs.current[index] = el;
            if (el && el.children[0]) {
              const materials: any[] = [];
              el.children[0].traverse((child: any) => {
                if (child.material) {
                  child.material.transparent = true;
                  materials.push(child.material);
                }
              });
              cloudMaterialRefs.current[index] = materials;
            }
          }}
        >
          <Cloud
            seed={index}
            segments={2}
            concentrate='inside'
            bounds={[itemSize, 1, itemSize]}
            opacity={0.4}
            speed={isActive ? 0.2 : 0}
            color='#ffffff' // `#${Math.floor(random(index) * 16777215).toString(16).padStart(6, '0')}`
            volume={itemSize * 0.2}
            smallestVolume={itemSize * 0.1}
            growth={0.5}
            
          />
        </group>
      ))}
    </group>
  );
};
