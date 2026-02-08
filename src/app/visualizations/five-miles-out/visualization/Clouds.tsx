import { useRef, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';
import { Group } from 'three';
import { SampleProvider } from '../../../audio/SampleProvider';

export interface CloudsProps {
  sampleProvider: SampleProvider;
  airplaneRef?: RefObject<Group>;
}

const CLOUD_POSITIONS = [
  // // Dark storm clouds on the left - spread throughout depth
  // { x: -15, y: 3, z: -20, opacity: 0.8, color: '#4a5568', scale: 1.2 },
  // { x: -12, y: 1, z: -50, opacity: 0.9, color: '#2d3748', scale: 1.5 },
  // { x: -18, y: 2.5, z: -80, opacity: 0.85, color: '#3a4556', scale: 1.3 },
  // { x: -10, y: 4, z: -110, opacity: 0.75, color: '#4a5568', scale: 1.4 },
  // { x: -16, y: 2, z: -140, opacity: 0.8, color: '#2d3748', scale: 1.6 },
  // { x: -14, y: 1.5, z: -170, opacity: 0.85, color: '#3a4556', scale: 1.5 },
  // { x: -20, y: 3.5, z: -200, opacity: 0.75, color: '#4a5568', scale: 1.8 },
  
  // // Lighter golden clouds on the right
  // { x: 10, y: 2, z: -30, opacity: 0.6, color: '#f7fafc', scale: 1.1 },
  // { x: 15, y: 1.5, z: -60, opacity: 0.65, color: '#edf2f7', scale: 1.3 },
  // { x: 12, y: 3.5, z: -90, opacity: 0.7, color: '#e2e8f0', scale: 1.2 },
  // { x: 18, y: 2.8, z: -120, opacity: 0.55, color: '#f7fafc', scale: 1.4 },
  // { x: 14, y: 1.8, z: -150, opacity: 0.6, color: '#edf2f7', scale: 1.5 },
  // { x: 16, y: 3.2, z: -180, opacity: 0.65, color: '#e2e8f0', scale: 1.3 },
  // { x: 20, y: 2.5, z: -210, opacity: 0.6, color: '#f7fafc', scale: 1.6 },
  
  // // Middle clouds
  // { x: 2, y: 1, z: -40, opacity: 0.6, color: '#cbd5e0', scale: 1.2 },
  // { x: -3, y: 2.5, z: -70, opacity: 0.65, color: '#a0aec0', scale: 1.3 },
  // { x: 1, y: 3, z: -100, opacity: 0.6, color: '#cbd5e0', scale: 1.4 },
  // { x: -2, y: 1.5, z: -130, opacity: 0.65, color: '#a0aec0', scale: 1.3 },
  // { x: 3, y: 2.8, z: -160, opacity: 0.6, color: '#cbd5e0', scale: 1.5 },
  // { x: -1, y: 3.5, z: -190, opacity: 0.65, color: '#a0aec0', scale: 1.4 },
  
  // Low "ground" clouds - very large and spread out
  { x: -5, y: -150, z: -50, opacity: 0.5, color: '#0066ff', scale: 30.0 },
  { x: 8, y: -150, z: -100, opacity: 0.55, color: '#ff9100', scale: 30.5 },
  { x: -10, y: -150, z: -150, opacity: 0.5, color: '#ff00d4', scale: 30.2 },
  { x: 5, y: -150, z: -200, opacity: 0.6, color: '#fbff00', scale: 40.0 },
  { x: 0, y: -150, z: -250, opacity: 0.55, color: '#00ff11', scale: 30.8 },
];

export const Clouds = ({ sampleProvider, airplaneRef }: CloudsProps) => {
  const cloudRefs = useRef<(Group | null)[]>([]);
  const cloudBasePositions = useRef<{ x: number; y: number; z: number }[]>(
    CLOUD_POSITIONS.map(pos => ({ x: pos.x, y: pos.y, z: pos.z }))
  );

  useFrame((state, delta) => {
    // const samples = sampleProvider.getAvg();
    // const avgVolume = samples.reduce((a, b) => a + b, 0) / samples.length / 255;
    // const bass = samples.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;

    // const airplanePosition = airplaneRef?.current?.position;

    // cloudRefs.current.forEach((cloud, index) => {
    //   if (!cloud || !airplanePosition) return;

    //   // Calculate if cloud is behind airplane (airplane has moved past it)
    //   const relativeZ = cloud.position.z - airplanePosition.z;

    //   // If cloud is behind airplane units, recycle it ahead
    //   if (relativeZ > 1) {
    //     const originalPos = CLOUD_POSITIONS[index];
    //     // Place cloud ahead of airplane in the direction of travel (negative Z relative to airplane)
    //     const newZ = airplanePosition.z - 200 - Math.random() * 100;
    //     const newX = originalPos.x + (Math.random() - 0.5) * 15;
    //     const newY = originalPos.y + (Math.random() - 0.5) * 5;
        
    //     cloud.position.z = newZ;
    //     cloud.position.x = newX;
    //     // Store the new base Y for floating animation
    //     cloudBasePositions.current[index].y = newY;
    //   }

    //   // Gentle floating animation based on stored base position
    //   const baseY = cloudBasePositions.current[index].y;
    //   cloud.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.5;
      
    //   // Very slow rotation - capped to prevent spinning
    //   const rotationSpeed = Math.min(bass, 0.3); // Cap bass influence
    //   cloud.rotation.y += delta * 0.01 * (1 + rotationSpeed * 0.2);
      
    //   // Audio-reactive scaling with base scale from config
    //   const baseScale = CLOUD_POSITIONS[index].scale;
    //   const scale = baseScale * (1 + avgVolume * 0.15);
    //   cloud.scale.setScalar(scale);
    // });
  });

  return (
    <group>
      {CLOUD_POSITIONS.map((pos, index) => (
        <group 
          key={index} 
          ref={(el) => (cloudRefs.current[index] = el)} 
          position={[pos.x, pos.y, pos.z]}
          scale={pos.scale}
        >
          <Cloud 
            speed={0.1 + index * 0.02} 
            opacity={pos.opacity} 
            color={pos.color}
            segments={pos.scale > 2 ? 30 : 20} // More segments for larger clouds
          />
        </group>
      ))}
    </group>
  );
};
