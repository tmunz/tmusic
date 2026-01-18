import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { SampleProvider, createMaxSampleProvider } from '../../../audio/SampleProvider';
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
import { SpeedBar } from './ui/SpeedBar';
import { useSampleProviderActive } from '../../../audio/useSampleProviderActive';
import { MinimapRenderer, Minimap } from './ui/Minimap';
import { TronStateManager } from './state/TronStateManager';
import { TronLightningEnvironment } from './TronLightningEnvironment';
import { Companion } from './vehicle/Companion';
import { TronStateProvider, useTronState } from './state/TronContext';
import { TronAction } from './state/TronAction';

export interface TronProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  cameraMode?: CameraMode;
}

export const Tron = ({ sampleProvider, canvas }: TronProps) => {
  const targetRef = useRef<THREE.Mesh>(null);
  const [debugMode, setDebugMode] = useState(0);
  const gameMode = useActivityToggle(false, true, 10000, ['keydown']);

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
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <TronScene
          sampleProvider={sampleProvider}
          targetRef={targetRef}
          debugMode={debugMode}
          gameMode={gameMode}
        />
      </div>
    </TronStateProvider>
  );
};

interface TronSceneProps {
  sampleProvider: SampleProvider;
  targetRef: React.RefObject<THREE.Mesh>;
  debugMode: number;
  gameMode: boolean;
}

const TronScene = ({ sampleProvider, targetRef, debugMode, gameMode }: TronSceneProps) => {
  const { tronState, dispatch, getUserCharacter, getUserPlayer } = useTronState();
  const isActive = useSampleProviderActive(sampleProvider);
  const hasAutoAccelerated = useRef(false);
  const userVehicleControls = useGameInput();
  const [minimapCanvas, setMinimapCanvas] = useState<HTMLCanvasElement | null>(null);

  const fakeSampleProvider = useMemo(() => createMaxSampleProvider(64), []);
  const effectiveSampleProvider = isActive
    ? sampleProvider
    : tronState.game.active
      ? fakeSampleProvider
      : sampleProvider;

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
    const userChar = getUserCharacter();
    const userPlayer = getUserPlayer();
    if (
      isActive &&
      !hasAutoAccelerated.current &&
      userChar &&
      userPlayer &&
      userChar.vehicle.speed.target < 1 &&
      userChar.vehicle.speed.max > 0
    ) {
      dispatch({
        type: TronAction.SET_TARGET_SPEED,
        characterId: userPlayer.id,
        target: userChar.vehicle.speed.max,
      });
      hasAutoAccelerated.current = true;
    }
  }, [isActive, dispatch, tronState]);

  return (
    <>
      <Canvas camera={{ position: [0, 1, 3], fov: 60 }} gl={{ antialias: true }}>
        <TronLightningEnvironment />
        <TronStateManager targetRef={targetRef} />
        {debugMode >= 1 && <Stats />}
        <CollisionProvider>
          {debugMode >= 2 && <CollisionDebugVisualizer />}
          <Vehicle
            ref={targetRef}
            sampleProvider={effectiveSampleProvider}
            color={getUserCharacter()?.color ?? '#66eeff'}
            getControlsState={userVehicleControls}
          />
          <Companion />
          {tronState.cameraMode === CameraMode.OBSERVER && <ObserverCamera targetRef={targetRef} />}
          {tronState.cameraMode === CameraMode.FOLLOW && (<FollowCamera targetRef={targetRef} drift={gameMode ? 0 : 2} />)}
          {tronState.cameraMode === CameraMode.BIRDS_EYE && <BirdsEyeCamera targetRef={targetRef} />}
          <World tileSize={tronState.world.tileSize} viewDistance={3} />
        </CollisionProvider>
        {tronState.game.active && <MinimapRenderer targetRef={targetRef} canvasElement={minimapCanvas} />}
      </Canvas>
      {tronState.game.active && (
        <>
          <SpeedBar color={getUserCharacter()?.color ?? '#66eeff'} width={150} />
          <Minimap color={getUserCharacter()?.color ?? '#66eeff'} targetRef={targetRef} size={150} onCanvasReady={setMinimapCanvas} />
        </>
      )}
    </>
  );
};
