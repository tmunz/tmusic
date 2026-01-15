import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, TiltShift2 } from '@react-three/postprocessing';
import { Stats } from '@react-three/drei';
import { SampleProvider, createDummySampleProvider } from '../../../audio/SampleProvider';
import { Vehicle } from './vehicle/Vehicle';
import { FollowCamera } from './camera/FollowCamera';
import { ObserverCamera } from './camera/ObserverCamera';
import { BirdsEyeCamera } from './camera/BirdsEyeCamera';
import { World } from './world/World';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CameraMode } from './camera/CameraMode';
import { useActivityToggle } from '../../../utils/useActivityToggle';
import { CollisionProvider } from './collision/CollisionContext';
import { CollisionDebugVisualizer } from './collision/CollisionDebugVisualizer';
import { useGameInput } from './TronGameInput';
import { TronStateProvider, useTronState, TronAction } from './TronContext';
import { SpeedBar } from './ui/SpeedBar';
import { useSampleProviderActive } from '../../../audio/useSampleProviderActive';
import { TronSkyBox } from './world/TronSkyBox';
import { Minimap } from './ui/Minimap';
import { DirectionIndicator } from './ui/DirectionIndicator';
import { TronStateManager } from './TronStateManager';

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
  const [debugMode, setDebugMode] = useState(0);
  const gameMode = useActivityToggle(false, true, 10000, ['keydown']);
  const colors = ['#66EEFF'];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'm' || event.key === 'M') {
        setDebugMode(prev => (prev + 1) % 3);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <TronStateProvider>
      <SceneContent
        width={width}
        height={height}
        sampleProvider={sampleProvider}
        targetRef={targetRef}
        debugMode={debugMode}
        gameMode={gameMode}
        colors={colors}
      />
    </TronStateProvider>
  );
};

interface SceneContentProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  targetRef: React.RefObject<THREE.Mesh>;
  debugMode: number;
  gameMode: boolean;
  colors: string[];
}

const SceneContent = ({ width, height, sampleProvider, targetRef, debugMode, gameMode, colors }: SceneContentProps) => {
  const { tronState, dispatch } = useTronState();
  const isActive = useSampleProviderActive(sampleProvider);
  const hasAutoAccelerated = useRef(false);
  const userVehicleControls = useGameInput();

  const fakeSampleProvider = useMemo(() => createDummySampleProvider(64), []);
  const effectiveSampleProvider = isActive ? sampleProvider : (tronState.game.active ? fakeSampleProvider : sampleProvider);

  // start game on vehicle control input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!tronState.game.active && (key === 'w' || key === 'a' || key === 's' || key === 'd')) {
        const target = targetRef.current;
        if (target) {
          hasAutoAccelerated.current = true;
          dispatch({
            type: TronAction.START_GAME,
            position: { x: target.position.x, y: target.position.y, z: target.position.z },
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tronState.game.active, dispatch, targetRef]);

  // Auto-accelerate to max speed when sampleProvider becomes active
  useEffect(() => {
    if (
      isActive &&
      !hasAutoAccelerated.current &&
      tronState.user.vehicle.speed.target < 1 &&
      tronState.user.vehicle.speed.max > 0
    ) {
      dispatch({
        type: TronAction.SET_TARGET_SPEED,
        target: tronState.user.vehicle.speed.max,
      });
      hasAutoAccelerated.current = true;
    }
  }, [isActive, dispatch, tronState.user.vehicle.speed.target, tronState.user.vehicle.speed.max]);

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
        {/* <fog attach="fog" args={['#000000', 20, 200]} /> */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.4} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.8} />
        <hemisphereLight args={['#ffffff', colors[0], 0.5]} />
        <CollisionProvider>
          {debugMode >= 2 && <CollisionDebugVisualizer />}
          {debugMode >= 1 && <Stats />}
          <TronStateManager targetRef={targetRef} />
          <Vehicle
            ref={targetRef}
            sampleProvider={effectiveSampleProvider}
            color={colors[0]}
            getControlsState={userVehicleControls}
          />
          {tronState.cameraMode === CameraMode.OBSERVER && <ObserverCamera targetRef={targetRef} />}
          {tronState.cameraMode === CameraMode.FOLLOW && (
            <FollowCamera targetRef={targetRef} drift={gameMode ? 0 : 2} />
          )}
          {tronState.cameraMode === CameraMode.BIRDS_EYE && <BirdsEyeCamera targetRef={targetRef} />}
          <World targetRef={targetRef} tileSize={tronState.world.tileSize} viewDistance={3} />
          <TronSkyBox targetRef={targetRef} />
        </CollisionProvider>
        {tronState.game.active && <>
          <Minimap targetRef={targetRef} size={150} />
          <SpeedBar color={colors[0]} width={150} />
          <DirectionIndicator targetRef={targetRef} battlefieldSize={tronState.game.battlegroundSize} />
        </>}
        <EffectComposer enableNormalPass multisampling={4}>
          <TiltShift2 blur={tronState.user.vehicle.speed.actual * 0.002} />
          <Bloom intensity={1.4} luminanceThreshold={0.02} luminanceSmoothing={0.1} mipmapBlur radius={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
