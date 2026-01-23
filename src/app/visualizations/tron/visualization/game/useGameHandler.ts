import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';

interface UseGameHandlerParams {}

export const useGameHandler = ({}: UseGameHandlerParams = {}) => {
  const updatePlayerBattlegroundStatus = useTronStore(state => state.updatePlayerBattlegroundStatus);
  const getUserPlayer = useTronStore(state => state.getUserPlayer);
  const getTronState = useTronStore.getState;
  const mode = useTronStore(state => state.mode);
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);

  const checkBattlegroundStatus = (object: Object3D) => {
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

  const getBattlegroundRespawnPosition = () => {
    const state = getTronState();
    const battlegroundSize = state.game.battlegroundSize;
    const tileSize = state.world.tileSize;
    const gamePos = state.game.position;

    const tilesPerSide = Math.floor((battlegroundSize * 0.8) / tileSize);
    const randomTileX = Math.floor((Math.random() - 0.5) * tilesPerSide);
    const randomTileZ = Math.floor((Math.random() - 0.5) * tilesPerSide);

    const randomX = gamePos.x + randomTileX * tileSize + tileSize / 2;
    const randomZ = gamePos.z + randomTileZ * tileSize + tileSize / 2;

    return { x: randomX, y: gamePos.y, z: randomZ };
  };

  return {
    checkBattlegroundStatus,
    getBattlegroundRespawnPosition,
  };
};
