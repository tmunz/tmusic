import { RefObject } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';
import { ProgramCharacter } from './ProgramCharacter';
import { TronCube } from '../object/TronCube';
import { MinimapRenderer, Minimap } from '../ui/Minimap';
import { SpeedBar } from '../ui/SpeedBar';
import { GameStatus } from '../ui/GameStatus';
import { SampleProvider } from '../../../../sampleProvider/SampleProvider';

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
  // Subscribe only to the roster and colors, rather than every speed/timer update.
  const programColors = useTronStore(
    useShallow(state =>
      Object.fromEntries(
        Object.keys(state.game.players)
          .filter(id => id.startsWith('program-'))
          .map(id => [id, state.characters[id]?.color])
      )
    )
  );

  if (mode !== Mode.LIGHTCYCLE_BATTLE) {
    return null;
  }

  return (
    <>
      {Object.entries(programColors).map(([id, color], index) => {
        const angle = (index * Math.PI * 2) / 4;
        const spawnRadius = battlegroundSize * 0.3;
        const spawnX = gamePosition.x + Math.cos(angle) * spawnRadius;
        const spawnZ = gamePosition.z + Math.sin(angle) * spawnRadius;

        return (
          <ProgramCharacter
            key={id}
            id={id}
            color={color}
            sampleProvider={sampleProvider}
            position={[spawnX, 0, spawnZ]}
            rotation={[0, angle + Math.PI / 2, 0]}
            debugMode={debugMode}
          />
        );
      })}
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
