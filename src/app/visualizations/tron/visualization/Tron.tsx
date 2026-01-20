import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { SampleProvider, createMaxSampleProvider } from '../../../audio/SampleProvider';
import { Vehicle } from './vehicle/Vehicle';
import { TronCamera } from './camera/TronCamera';
import { World } from './world/World';
import { useRef, useState, useEffect, useMemo } from 'react';
import { CollisionProvider } from './collision/CollisionContext';
import { CollisionDebugVisualizer } from './collision/CollisionDebugVisualizer';
import { useUserInput } from './UserInput';
import { SpeedBar } from './ui/SpeedBar';
import { useSampleProviderActive } from '../../../audio/useSampleProviderActive';
import { MinimapRenderer, Minimap } from './ui/Minimap';
import { TronStateManager } from './state/TronStateManager';
import { TronLightningEnvironment } from './TronLightningEnvironment';
import { Companion } from './vehicle/Companion';
import { TronStateProvider, useTronState } from './state/TronContext';
import { TronAction } from './state/TronAction';
import { GameStatus } from './ui/GameStatus';
import { Mode } from './state/TronState';
import { Object3D } from 'three';

export interface TronProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const Tron = ({ sampleProvider, canvas }: TronProps) => {
  const [debugMode, setDebugMode] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'm') {
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
        <TronScene sampleProvider={sampleProvider} debugMode={debugMode} />
      </div>
    </TronStateProvider>
  );
};

interface TronSceneProps {
  sampleProvider: SampleProvider;
  debugMode: number;
}

const TronScene = ({ sampleProvider, debugMode }: TronSceneProps) => {
  const { tronState, dispatch, getUserCharacter } = useTronState();
  const isActive = useSampleProviderActive(sampleProvider);
  const [minimapCanvas, setMinimapCanvas] = useState<HTMLCanvasElement | null>(null);
  const userRef = useRef<Object3D>(null);
  const companionRef = useRef<Object3D>(null);

  const fakeSampleProvider = useMemo(() => createMaxSampleProvider(64), []);
  const effectiveSampleProvider = isActive
    ? sampleProvider
    : tronState.mode === Mode.LIGHTCYCLE_BATTLE
    ? fakeSampleProvider
    : sampleProvider;

  // Switch from NONE to VISUALIZER
  useEffect(() => {
    if (tronState.mode === Mode.NONE) {
      const timer = setTimeout(() => {
        dispatch({
          type: TronAction.SET_GAME_MODE,
          mode: Mode.VISUALIZER,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [tronState.mode, dispatch]);

  // Enter LIGHTCYCLE_BATTLE mode on key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (tronState.mode !== Mode.LIGHTCYCLE_BATTLE && (key === 'w' || key === 'a' || key === 's' || key === 'd')) {
        const target = userRef.current;
        if (target) {
          dispatch({
            type: TronAction.START_GAME,
            position: { x: target.position.x, y: target.position.y, z: target.position.z },
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tronState.mode, dispatch, userRef]);

  // VISUALIZER mode: Control vehicle speed based on sampleProvider activity
  useEffect(() => {
    if (tronState.mode !== Mode.VISUALIZER) return;

    const userCharacter = tronState.characters[tronState.userId];
    if (!userCharacter?.vehicle?.speed || userCharacter.vehicle.speed.max <= 0) return;

    const targetSpeed = isActive ? userCharacter.vehicle.speed.max : 0;

    dispatch({
      type: TronAction.SET_TARGET_SPEED,
      characterId: userCharacter.id,
      target: targetSpeed,
    });
  }, [isActive, tronState.mode, dispatch, tronState.userId]);

  return (
    <>
      <Canvas camera={{ position: [0, 1, 3], fov: 60 }} gl={{ antialias: true }}>
        {debugMode >= 1 && <Stats />}
        <TronLightningEnvironment />
        <TronCamera vehicleRef={userRef} companionRef={companionRef} />
        <CollisionProvider>
          <TronStateManager targetRef={userRef} />
          {debugMode >= 2 && <CollisionDebugVisualizer />}
          <Vehicle
            ref={userRef}
            sampleProvider={effectiveSampleProvider}
            color={getUserCharacter()?.color ?? '#66eeff'}
            getControlsState={useUserInput()}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
          />
          <Companion ref={companionRef} vehicleRef={userRef} />
          <World tileSize={tronState.world.tileSize} viewDistance={3} />
        </CollisionProvider>
        {tronState.mode === Mode.LIGHTCYCLE_BATTLE && (
          <MinimapRenderer targetRef={userRef} canvasElement={minimapCanvas} />
        )}
      </Canvas>
      {tronState.mode === Mode.LIGHTCYCLE_BATTLE && (
        <>
          <SpeedBar color={getUserCharacter()?.color ?? '#66eeff'} width={150} />
          <Minimap
            color={getUserCharacter()?.color ?? '#66eeff'}
            targetRef={userRef}
            size={150}
            onCanvasReady={setMinimapCanvas}
          />
          <GameStatus color={getUserCharacter()?.color ?? '#66eeff'} />
        </>
      )}
    </>
  );
};
