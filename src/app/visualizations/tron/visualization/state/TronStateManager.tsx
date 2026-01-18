import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useTronState } from './TronContext';
import { TronAction } from './TronAction';

interface TronStateManagerProps {
  targetRef: React.RefObject<Mesh>;
}

export const TronStateManager = ({ targetRef }: TronStateManagerProps) => {
  const { tronState, dispatch, getUserPlayer } = useTronState();
  const lastPositionRef = useRef({ x: 0, y: 0, z: 0 });

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

    if (tronState.game.active) {
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
