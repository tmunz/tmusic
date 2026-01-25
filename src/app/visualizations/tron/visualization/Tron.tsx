import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { SampleProvider, createMaxSampleProvider } from '../../../audio/SampleProvider';
import { TronCamera } from './camera/TronCamera';
import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { CollisionProvider } from './collision/CollisionContext';
import { useUserInput } from './userInput/useUserInput';
import { SpeedBar } from './ui/SpeedBar';
import { useSampleProviderActive } from '../../../audio/useSampleProviderActive';
import { MinimapRenderer, Minimap } from './ui/Minimap';
import { Companion } from './companion/Companion';
import { useTronStore } from './state/TronStore';
import { GameStatus } from './ui/GameStatus';
import { Mode } from './state/TronState';
import { Object3D } from 'three';
import { Character } from './character/Character';
import { CollisionDebugVisualizer } from './collision/CollisionDebugVisualizer';
import { TronCube } from './object/TronCube';
import { TronEnvironment } from './environment/TronEnvironment';

enum DebugMode {
  NONE = 0,
  STATS = 1,
  COLLISION = 2,
  ALL = 3,
}

export interface TronProps {
  sampleProvider: SampleProvider;
}

export const Tron = ({ sampleProvider }: TronProps) => {
  const [debugMode, setDebugMode] = useState(DebugMode.NONE);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'm') {
        setDebugMode(prev => (prev + 1) % (Object.values(DebugMode).length / 2));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
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
  );
};

interface TronSceneProps {
  sampleProvider: SampleProvider;
  debugMode: DebugMode;
}

const TronScene = ({ sampleProvider, debugMode }: TronSceneProps) => {
  const mode = useTronStore(state => state.mode);
  const userId = useTronStore(state => state.userId);
  const tileSize = useTronStore(state => state.world.tileSize);
  const userCharacterColor = useTronStore(state => state.characters[state.userId]?.color ?? '#66eeff');
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);
  const setGameMode = useTronStore(state => state.setGameMode);
  const startGame = useTronStore(state => state.startGame);
  const setTargetSpeed = useTronStore(state => state.setTargetSpeed);
  const userCharacterMaxSpeed = useTronStore(state => state.getUserCharacter()?.speed?.max ?? 0);
  const companionId = useTronStore(state => state.getUserCharacter()?.companionId ?? '');

  const isActive = useSampleProviderActive(sampleProvider);
  const [minimapCanvas, setMinimapCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const userRef = useRef<Object3D>(null);
  const companionRef = useRef<Object3D>(null);
  const controlsState = useUserInput();

  const fakeSampleProvider = useMemo(() => createMaxSampleProvider(64), []);
  const effectiveSampleProvider = isActive ? sampleProvider : fakeSampleProvider;

  // Track window focus
  useEffect(() => {
    const handleFocus = () => setIsWindowActive(true);
    const handleBlur = () => setIsWindowActive(false);
    const handleVisibilityChange = () => {
      setIsWindowActive(!document.hidden);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Switch from NONE to VISUALIZER
  useEffect(() => {
    if (mode === Mode.NONE) {
      const timer = setTimeout(() => {
        setGameMode(Mode.VISUALIZER);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [mode, setGameMode]);

  // Enter LIGHTCYCLE_BATTLE mode on key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (mode !== Mode.LIGHTCYCLE_BATTLE && (key === 'w' || key === 'a' || key === 's' || key === 'd')) {
        const target = userRef.current;
        if (target) {
          startGame({ x: target.position.x, y: target.position.y, z: target.position.z });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, startGame, userRef]);

  // VISUALIZER mode: Control vehicle speed based on sampleProvider activity
  useEffect(() => {
    if (mode !== Mode.VISUALIZER) return;

    if (userCharacterMaxSpeed <= 0) return;

    const targetSpeed = isActive ? userCharacterMaxSpeed : 0;

    setTargetSpeed(userId, targetSpeed);
  }, [isActive, mode, setTargetSpeed, userId, userCharacterMaxSpeed]);

  return (
    <>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 60 }}
        gl={{ antialias: true }}
        frameloop={isWindowActive ? 'always' : 'never'}
      >
        {debugMode >= DebugMode.STATS && <Stats />}
        <TronCamera userRef={userRef} companionRef={companionRef} />
        <TronEnvironment tileSize={tileSize} viewDistance={3} />
        <Suspense fallback={null}>
          <CollisionProvider>
            {debugMode >= DebugMode.COLLISION && <CollisionDebugVisualizer />}
            <Character
              ref={userRef}
              id={userId}
              sampleProvider={effectiveSampleProvider}
              color={userCharacterColor}
              getControlsState={controlsState}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
            />
            <Companion
              id={companionId}
              ref={companionRef}
              targetRef={userRef}
              characterId={userId}
              verticalOffset={1.4}
              debugMode={debugMode >= DebugMode.ALL}
            />
            {mode === Mode.LIGHTCYCLE_BATTLE && (
              <>
                <TronCube
                  id="cube-0"
                  position={[gamePosition.x + battlegroundSize / 2, 0.5, gamePosition.z + battlegroundSize / 2]}
                  rotation={[0, Math.PI / 4, 0]}
                />
                <TronCube
                  id="cube-1"
                  position={[gamePosition.x - battlegroundSize / 2, 0.5, gamePosition.z + battlegroundSize / 2]}
                />
                <TronCube
                  id="cube-2"
                  position={[gamePosition.x + battlegroundSize / 2, 0.5, gamePosition.z - battlegroundSize / 2]}
                />
                <TronCube
                  id="cube-3"
                  position={[gamePosition.x - battlegroundSize / 2, 0.5, gamePosition.z - battlegroundSize / 2]}
                />
              </>
            )}
          </CollisionProvider>
          {mode === Mode.LIGHTCYCLE_BATTLE && <MinimapRenderer targetRef={userRef} canvasElement={minimapCanvas} />}
        </Suspense>
      </Canvas>
      {mode === Mode.LIGHTCYCLE_BATTLE && (
        <>
          <SpeedBar color={userCharacterColor} width={150} />
          <Minimap color={userCharacterColor} targetRef={userRef} size={150} onCanvasReady={setMinimapCanvas} />
          <GameStatus color={userCharacterColor} />
        </>
      )}
    </>
  );
};
