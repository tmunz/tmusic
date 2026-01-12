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
import { useGameInput } from './TronGameInput';
import { TronGameProvider, useTronGameState, TronGameAction } from './TronGameContext';
import { SpeedBar } from './ui/SpeedBar';
import { useSampleProviderActive } from '../../../audio/useSampleProviderActive';
import { TronSkyBox } from './world/TronSkyBox';

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
  const [debugMode, setDebugMode] = useState(false);
  const gameMode = useActivityToggle(false, true, 10000, ['keydown']);
  const colors = ['#66EEFF'];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'm' || event.key === 'M') {
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <TronGameProvider>
      <SceneContent
        width={width}
        height={height}
        sampleProvider={sampleProvider}
        targetRef={targetRef}
        debugMode={debugMode}
        gameMode={gameMode}
        colors={colors}
      />
    </TronGameProvider>
  );
};

interface SceneContentProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  targetRef: React.RefObject<THREE.Mesh>;
  debugMode: boolean;
  gameMode: boolean;
  colors: string[];
}

const SceneContent = ({ width, height, sampleProvider, targetRef, debugMode, gameMode, colors }: SceneContentProps) => {
  const { tronGameState, dispatch } = useTronGameState();
  const isActive = useSampleProviderActive(sampleProvider);
  const hasAutoAccelerated = useRef(false);
  const userVehicleControls = useGameInput();

  // start game on vehicle control input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!tronGameState.userVehicle.game.active && (key === 'w' || key === 'a' || key === 's' || key === 'd')) {
        const target = targetRef.current;
        if (target) {
          dispatch({
            type: TronGameAction.START_GAME,
            position: { x: target.position.x, y: target.position.y, z: target.position.z },
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tronGameState.userVehicle.game.active, dispatch, targetRef]);

  // Auto-accelerate to max speed when sampleProvider becomes active
  useEffect(() => {
    if (
      isActive &&
      !hasAutoAccelerated.current &&
      tronGameState.userVehicle.speed.target < 1 &&
      tronGameState.userVehicle.speed.max > 0
    ) {
      dispatch({
        type: TronGameAction.SET_TARGET_SPEED,
        target: tronGameState.userVehicle.speed.max,
      });
      hasAutoAccelerated.current = true;
    }
  }, [isActive, dispatch, tronGameState.userVehicle.speed.target, tronGameState.userVehicle.speed.max]);

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
        <directionalLight position={[10, 10, 5]} intensity={1.4} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <hemisphereLight args={['#ffffff', colors[0], 0.5]} />
        <CollisionProvider>
          {debugMode && <CollisionDebugVisualizer />}
          {debugMode && <Stats />}
          <Vehicle
            ref={targetRef}
            sampleProvider={sampleProvider}
            color={colors[0]}
            getControlsState={userVehicleControls}
          />
          {/* <Vehicle color="#ff0000" position={[-1, 0, 0]} rotation={[1, 0, 0]} />
          <Vehicle color="#ffbf00" position={[1, 0, 0]} rotation={[0, 0, 0]} /> */}
          {tronGameState.cameraMode === CameraMode.OBSERVER && <ObserverCamera targetRef={targetRef} />}
          {tronGameState.cameraMode === CameraMode.FOLLOW && (
            <FollowCamera targetRef={targetRef} drift={gameMode ? 0 : 2} />
          )}
          {tronGameState.cameraMode === CameraMode.BIRDS_EYE && <BirdsEyeCamera targetRef={targetRef} />}
          <World targetRef={targetRef} tileSize={50} viewDistance={3} />
          <TronSkyBox targetRef={targetRef} />
        </CollisionProvider>

        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.02} luminanceSmoothing={0.1} mipmapBlur radius={0.3} />
        </EffectComposer>
      </Canvas>
      <SpeedBar
        actual={tronGameState.userVehicle.speed.actual}
        target={tronGameState.userVehicle.speed.target}
        min={tronGameState.userVehicle.speed.min}
        max={tronGameState.userVehicle.speed.max}
        color={colors[0]}
      />
    </div>
  );
};
