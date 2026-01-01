import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Stats } from '@react-three/drei';
import { SampleProvider } from '../../../audio/SampleProvider';
import { Vehicle } from './vehicle/Vehicle';
import { FollowCamera } from './camera/FollowCamera';
import { ObserverCamera } from './camera/ObserverCamera';
import { BirdsEyeCamera } from './camera/BirdsEyeCamera';
import { World } from './world/World';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { CameraMode } from './camera/CameraMode';
import { useActivityToggle } from '../../../utils/useActivityToggle';
import { CollisionProvider } from './collision/CollisionContext';
import { CollisionDebugVisualizer } from './collision/CollisionDebugVisualizer';

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
  const [currentCameraMode, setCurrentCameraMode] = useState<CameraMode>(cameraMode);
  const [debugMode, setDebugMode] = useState(false);
  const gameMode = useActivityToggle(false, true, 10000, ['keydown']);
  const colors = ['#66EEFF'];

  const cameraModes = [CameraMode.FOLLOW, CameraMode.OBSERVER, CameraMode.BIRDS_EYE];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'c' || event.key === 'C') {
        setCurrentCameraMode(prevMode => {
          const currentIndex = cameraModes.indexOf(prevMode);
          const nextIndex = (currentIndex + 1) % cameraModes.length;
          return cameraModes[nextIndex];
        });
      }
      if (event.key === 'm' || event.key === 'M') {
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 60 }}
        gl={{
          antialias: true,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 20, 200]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <hemisphereLight args={['#ffffff', colors[0], 0.5]} />
        <CollisionProvider>
          {debugMode && <CollisionDebugVisualizer />}
          {debugMode && <Stats />}
          <Vehicle ref={targetRef} sampleProvider={sampleProvider} color={colors[0]} />
          {/* <Vehicle sampleProvider={sampleProvider} color="#ff0000" position={[-1, 0, 0]} rotation={[1, 0, 0]} />
          <Vehicle sampleProvider={sampleProvider} color="#ffbf00" position={[1, 0, 0]} rotation={[0, 0, 0]} /> */}
          {currentCameraMode === CameraMode.OBSERVER && <ObserverCamera targetRef={targetRef} />}
          {currentCameraMode === CameraMode.FOLLOW && <FollowCamera targetRef={targetRef} drift={gameMode ? 0 : 2} />}
          {currentCameraMode === CameraMode.BIRDS_EYE && <BirdsEyeCamera targetRef={targetRef} />}
          <World targetRef={targetRef} tileSize={50} viewDistance={3} />
        </CollisionProvider>

        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.02} luminanceSmoothing={0.1} mipmapBlur radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
