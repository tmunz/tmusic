import { useCallback, useRef, useEffect } from 'react';
import { useTronState } from '../state/TronContext';
import { TronAction } from '../state/TronAction';
import { Mode } from '../state/TronState';

interface CrashHandlerDependencies {
  vehicleTransitionRef: React.RefObject<{ startTransition: (type: 'in' | 'out') => void }>;
  isDisintegratedRef: React.MutableRefObject<boolean>;
  isRespawningRef: React.MutableRefObject<boolean>;
  setTargetSpeed: (speed: number) => void;
}

export const useVehicleCrashHandler = (deps?: CrashHandlerDependencies) => {
  const { dispatch, getUserPlayer, tronState } = useTronState();
  const crashedPlayersRef = useRef<Set<string>>(new Set());
  const respawnTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const tronStateRef = useRef(tronState);

  useEffect(() => {
    tronStateRef.current = tronState;
  }, [tronState]);

  useEffect(() => {
    return () => {
      respawnTimersRef.current.forEach(timer => clearTimeout(timer));
      respawnTimersRef.current.clear();
    };
  }, []);

  const handleVehicleCrash = useCallback(
    (vehiclePlayerId: string, wallPlayerId: string) => {
      if (crashedPlayersRef.current.has(vehiclePlayerId) || respawnTimersRef.current.has(vehiclePlayerId)) {
        return;
      }
      crashedPlayersRef.current.add(vehiclePlayerId);

      dispatch({
        type: TronAction.VEHICLE_CRASH,
        crashingPlayerId: vehiclePlayerId,
        wallOwnerId: wallPlayerId,
      });

      dispatch({
        type: TronAction.SET_VEHICLE_DISINTEGRATING,
        characterId: vehiclePlayerId,
        isDisintegrated: true,
      });

      dispatch({
        type: TronAction.SET_TARGET_SPEED,
        characterId: vehiclePlayerId,
        target: 0,
      });

      const userPlayer = getUserPlayer();
      if (deps && userPlayer && vehiclePlayerId === userPlayer.id) {
        if (deps.isDisintegratedRef) {
          deps.isDisintegratedRef.current = true;
        }
        if (deps.isRespawningRef) {
          deps.isRespawningRef.current = true;
        }
        if (deps.setTargetSpeed) {
          deps.setTargetSpeed(0);
        }
        if (deps.vehicleTransitionRef?.current) {
          deps.vehicleTransitionRef.current.startTransition('out');
        }
      }

      const timer = setTimeout(() => {
        const currentState = tronStateRef.current;
        const player = currentState.game.players[vehiclePlayerId];

        if (player && currentState.mode === Mode.LIGHTCYCLE_BATTLE) {
          const battlegroundSize = currentState.game.battlegroundSize;
          const tileSize = currentState.world.tileSize;
          const gamePos = currentState.game.position;

          const tilesPerSide = Math.floor((battlegroundSize * 0.8) / tileSize);
          const randomTileX = Math.floor((Math.random() - 0.5) * tilesPerSide);
          const randomTileZ = Math.floor((Math.random() - 0.5) * tilesPerSide);

          const randomX = gamePos.x + randomTileX * tileSize + tileSize / 2;
          const randomZ = gamePos.z + randomTileZ * tileSize + tileSize / 2;

          dispatch({
            type: TronAction.RESPAWN_PLAYER,
            playerId: vehiclePlayerId,
            position: { x: randomX, y: gamePos.y, z: randomZ },
          });

          dispatch({
            type: TronAction.SET_TARGET_SPEED,
            characterId: vehiclePlayerId,
            target: 0,
          });

          setTimeout(() => {
            dispatch({
              type: TronAction.SET_VEHICLE_DISINTEGRATING,
              characterId: vehiclePlayerId,
              isDisintegrated: false,
            });
          }, 400);
        }

        crashedPlayersRef.current.delete(vehiclePlayerId);
        respawnTimersRef.current.delete(vehiclePlayerId);
      }, 2100);

      respawnTimersRef.current.set(vehiclePlayerId, timer);
    },
    [dispatch, getUserPlayer, deps, tronState]
  );

  return { handleVehicleCrash };
};
