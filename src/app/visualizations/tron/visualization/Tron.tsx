import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SampleProvider } from '../../../audio/SampleProvider';
import { Vehicle } from './vehicle/Vehicle';
import { FollowCamera } from './camera/FollowCamera';
import { ObserverCamera } from './camera/ObserverCamera';
import { BirdsEyeCamera } from './camera/BirdsEyeCamera';
import { World } from './world/World';
import { useRef } from 'react';
import * as THREE from 'three';
import { CameraMode } from './camera/CameraMode';

export interface TronProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  cameraMode?: CameraMode;
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
  cameraMode?: CameraMode;
}

export const Scene = ({ width, height, sampleProvider, cameraMode = CameraMode.FOLLOW }: SceneProps) => {
  const targetRef = useRef<THREE.Mesh>(null);

  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 20, 200]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={3} color="#00ffff" />
        <pointLight position={[5, 3, 5]} intensity={2} color="#ff00ff" />
        <pointLight position={[-5, 3, -5]} intensity={2} color="#00ff00" />
        <hemisphereLight args={['#ffffff', '#0066ff', 0.5]} />
        <Vehicle ref={targetRef} sampleProvider={sampleProvider} />
        {cameraMode === CameraMode.OBSERVER && <ObserverCamera targetRef={targetRef} />}
        {cameraMode === CameraMode.FOLLOW && <FollowCamera targetRef={targetRef} />}
        {cameraMode === CameraMode.BIRDS_EYE && <BirdsEyeCamera targetRef={targetRef} />}
        <World targetRef={targetRef} tileSize={50} viewDistance={3} />

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.02} luminanceSmoothing={0.1} mipmapBlur radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
