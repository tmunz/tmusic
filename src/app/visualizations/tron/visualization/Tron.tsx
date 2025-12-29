import { Canvas } from '@react-three/fiber';
import { SampleProvider } from '../../../audio/SampleProvider';
import { LightCycle } from './light-cycle/LightCycle';
import { FollowCamera } from './FollowCamera';
import { TronGrid } from './TronGrid';
import { useRef } from 'react';
import * as THREE from 'three';

export interface TronProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const Tron = ({ sampleProvider, canvas }: TronProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Scene width={canvas.width} height={canvas.height} sampleProvider={sampleProvider} />
    </div>
  );
};

export interface SceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const Scene = ({ width, height, sampleProvider }: SceneProps) => {
  const lightCycleRef = useRef<THREE.Mesh>(null);

  return (
    <div style={{ width, height }}>
      <Canvas>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#00ffff" />
        <LightCycle ref={lightCycleRef} />
        <FollowCamera targetRef={lightCycleRef} />
        <TronGrid />
      </Canvas>
    </div>
  );
};
