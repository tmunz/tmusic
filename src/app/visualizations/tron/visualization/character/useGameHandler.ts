import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';

interface UseGameHandlerParams {
  enabled: boolean;
}

export const useGameHandler = ({ enabled }: UseGameHandlerParams) => {
  const updatePlayerBattlegroundStatus = useTronStore(state => state.updatePlayerBattlegroundStatus);
  const getUserPlayer = useTronStore(state => state.getUserPlayer);
  const mode = useTronStore(state => state.mode);
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);

  const checkBattlegroundStatus = (object: Object3D) => {
    if (!enabled) return;

    const userPlayer = getUserPlayer();
    if (!userPlayer || mode !== Mode.LIGHTCYCLE_BATTLE) return;

    const battlefieldPos = gamePosition;
    const bgSize = battlegroundSize;

    const isInside =
      object.position.x >= battlefieldPos.x - bgSize / 2 &&
      object.position.x <= battlefieldPos.x + bgSize / 2 &&
      object.position.z >= battlefieldPos.z - bgSize / 2 &&
      object.position.z <= battlefieldPos.z + bgSize / 2;

    if (isInside !== userPlayer.insideBattleground) {
      updatePlayerBattlegroundStatus(userPlayer.id, isInside);
    }
  };

  return {
    checkBattlegroundStatus,
  };
};
