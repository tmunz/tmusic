import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Object3D } from 'three';
import { useTronState } from './TronContext';
import { TronAction } from './TronAction';
import { Mode } from './TronState';

interface TronStateManagerProps {
  targetRef: React.RefObject<Object3D>;
}

export const TronStateManager = ({ targetRef }: TronStateManagerProps) => {
  const { tronState, dispatch, getUserPlayer } = useTronState();
  const lastPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const lastCharacterPositionsRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const tronStateRef = useRef(tronState);

  // Update ref whenever state changes
  useEffect(() => {
    tronStateRef.current = tronState;
  }, [tronState]);

  // Monitor character position changes to track positions
  useEffect(() => {
    Object.keys(tronState.characters).forEach(characterId => {
      const character = tronState.characters[characterId];
      if (!character || !character.position) return;

      lastCharacterPositionsRef.current.set(characterId, { ...character.position });
    });
  }, [tronState.characters]);

  useFrame(() => {
    if (!targetRef.current) return;

    const currentPos = targetRef.current.position;
    const userPlayer = getUserPlayer();
    if (!userPlayer) return;

    if (
      lastPositionRef.current.x !== currentPos.x ||
      lastPositionRef.current.y !== currentPos.y ||
      lastPositionRef.current.z !== currentPos.z
    ) {
      dispatch({
        type: TronAction.UPDATE_CHARACTER_POSITION,
        characterId: userPlayer.id,
        position: { x: currentPos.x, y: currentPos.y, z: currentPos.z },
      });

      lastPositionRef.current = { x: currentPos.x, y: currentPos.y, z: currentPos.z };
    }

    if (tronState.mode === Mode.LIGHTCYCLE_BATTLE) {
      const battlefieldPos = tronState.game.position;
      const battlegroundSize = tronState.game.battlegroundSize;

      const isInside =
        currentPos.x >= battlefieldPos.x - battlegroundSize / 2 &&
        currentPos.x <= battlefieldPos.x + battlegroundSize / 2 &&
        currentPos.z >= battlefieldPos.z - battlegroundSize / 2 &&
        currentPos.z <= battlefieldPos.z + battlegroundSize / 2;

      if (isInside !== userPlayer.insideBattleground) {
        dispatch({
          type: TronAction.UPDATE_PLAYER_BATTLEGROUND_STATUS,
          playerId: userPlayer.id,
          inside: isInside,
        });
      }
    }
  });

  return null;
};
