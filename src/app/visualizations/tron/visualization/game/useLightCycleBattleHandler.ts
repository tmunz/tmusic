import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';

export interface useLightCycleBattleHandlerParams {
  onDisintegration?: () => void;
}

export const useLightCycleBattleHandler = ({ onDisintegration }: useLightCycleBattleHandlerParams = {}) => {
  const updatePlayerBattlegroundStatus = useTronStore(state => state.updatePlayerBattlegroundStatus);
  const updatePlayerOutsideTimer = useTronStore(state => state.updatePlayerOutsideTimer);
  const getPlayer = useTronStore(state => state.getPlayer);
  const getTronState = useTronStore.getState;
  const mode = useTronStore(state => state.mode);
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);

  const checkBattlegroundStatus = (object: Object3D, playerId: string, delta: number) => {
    const player = getPlayer(playerId);
    if (!player || mode !== Mode.LIGHTCYCLE_BATTLE) return;

    const battlefieldPos = gamePosition;
    const bgSize = battlegroundSize;

    const isInside =
      object.position.x >= battlefieldPos.x - bgSize / 2 &&
      object.position.x <= battlefieldPos.x + bgSize / 2 &&
      object.position.z >= battlefieldPos.z - bgSize / 2 &&
      object.position.z <= battlefieldPos.z + bgSize / 2;

    if (isInside !== player.insideBattleground) {
      updatePlayerBattlegroundStatus(playerId, isInside);
    }
    if (!isInside) {
      const timeRemaining = player.outsideTimeRemaining;
      updatePlayerOutsideTimer(playerId, delta);
      
      if (timeRemaining <= delta) {
        onDisintegration?.();
      }
    }
  };

  const getBattlegroundSpawnPosition = () => {
    const state = getTronState();
    const battlegroundSize = state.game.battlegroundSize;
    const tileSize = state.world.tileSize;
    const gamePos = state.game.position;

    const tilesPerSide = Math.floor((battlegroundSize * 0.8) / tileSize);
    const randomTileX = Math.floor((Math.random() - 0.5) * tilesPerSide);
    const randomTileZ = Math.floor((Math.random() - 0.5) * tilesPerSide);

    const randomX = gamePos.x + randomTileX * tileSize + tileSize / 2;
    const randomZ = gamePos.z + randomTileZ * tileSize + tileSize / 2;
    const dx = gamePos.x - randomX;
    const dz = gamePos.z - randomZ;
    const angleToCenter = Math.atan2(dx, dz) + Math.PI;

    return { 
      position: { x: randomX, y: gamePos.y, z: randomZ },
      rotation: { x: 0, y: angleToCenter, z: 0 },
    };
  };

  return {
    checkBattlegroundStatus,
    getBattlegroundSpawnPosition,
  };
};
