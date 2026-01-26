import { RefObject, useMemo } from 'react';
import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';
import { ProgramCharacter } from './ProgramCharacter';
import { TronCube } from '../object/TronCube';
import { MinimapRenderer, Minimap } from '../ui/Minimap';
import { SpeedBar } from '../ui/SpeedBar';
import { GameStatus } from '../ui/GameStatus';
import { SampleProvider } from '../../../../audio/SampleProvider';

interface LightCycleBattleProps {
  userRef: RefObject<Object3D>;
  sampleProvider: SampleProvider;
  minimapCanvas: HTMLCanvasElement | null;
  debugMode?: boolean;
}

export const LightCycleBattle = ({
  userRef,
  sampleProvider,
  minimapCanvas,
  debugMode = false,
}: LightCycleBattleProps) => {
  const mode = useTronStore(state => state.mode);
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);
  const characters = useTronStore(state => state.characters);
  const players = useTronStore(state => state.game.players);

  const programCharacters = useMemo(() => {
    if (mode !== Mode.LIGHTCYCLE_BATTLE) return [];
    return Object.keys(players)
      .filter(id => id.startsWith('program-'))
      .map(id => ({
        id,
        color: characters[id]?.color,
      }));
  }, [mode, players, characters]);

  if (mode !== Mode.LIGHTCYCLE_BATTLE) {
    return null;
  }

  return (
    <>
      {programCharacters.map((programChar, index) => {
        const angle = (index * Math.PI * 2) / 4;
        const spawnRadius = battlegroundSize * 0.3;
        const spawnX = gamePosition.x + Math.cos(angle) * spawnRadius;
        const spawnZ = gamePosition.z + Math.sin(angle) * spawnRadius;

        return (
          <ProgramCharacter
            key={programChar.id}
            id={programChar.id}
            color={programChar.color}
            sampleProvider={sampleProvider}
            position={[spawnX, 0, spawnZ]}
            rotation={[0, angle + Math.PI / 2, 0]}
            debugMode={debugMode}
          />
        );
      })}

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

      {/* Minimap Renderer (inside Canvas) */}
      <MinimapRenderer targetRef={userRef} canvasElement={minimapCanvas} />
    </>
  );
};

interface LightCycleBattleUiProps {
  userCharacterColor: string;
  userRef: RefObject<Object3D>;
  onMinimapCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const LightCycleBattleUi = ({ userCharacterColor, userRef, onMinimapCanvasReady }: LightCycleBattleUiProps) => {
  const mode = useTronStore(state => state.mode);

  if (mode !== Mode.LIGHTCYCLE_BATTLE) {
    return null;
  }

  return (
    <>
      <SpeedBar color={userCharacterColor} width={150} />
      <Minimap color={userCharacterColor} targetRef={userRef} size={150} onCanvasReady={onMinimapCanvasReady} />
      <GameStatus color={userCharacterColor} />
    </>
  );
};
