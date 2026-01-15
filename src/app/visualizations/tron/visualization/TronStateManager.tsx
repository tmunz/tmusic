import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useTronState, TronAction } from './TronContext';

interface TronStateManagerProps {
  targetRef: React.RefObject<Mesh>;
}

export const TronStateManager = ({ targetRef }: TronStateManagerProps) => {
  const { tronState, dispatch } = useTronState();
  const lastPositionRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    if (!targetRef.current) return;

    const currentPos = targetRef.current.position;
    
    if (
      lastPositionRef.current.x !== currentPos.x ||
      lastPositionRef.current.y !== currentPos.y ||
      lastPositionRef.current.z !== currentPos.z
    ) {
      dispatch({
        type: TronAction.UPDATE_USER_POSITION,
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

      if (isInside !== tronState.game.userInsideBattleground) {
        dispatch({
          type: TronAction.UPDATE_USER_BATTLEGROUND_STATUS,
          inside: isInside,
        });
      }
    }
  });

  return null;
};
