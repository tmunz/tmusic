import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

interface TronGridProps {
}

export const TronGrid = ({}: TronGridProps) => {
  const gridRef = useRef<THREE.Group>(null);
  const sectionSize = 5;
  
  return (
    <group ref={gridRef}>
      <Grid
        args={[100, 100]}
        sectionSize={sectionSize}
        position={[0, 0, 0]}
        cellColor="#004444"
        sectionColor="#00ffff"
        fadeDistance={50}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
};
