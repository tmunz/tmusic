import { useCallback, useRef, useEffect } from 'react';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';

interface CrashHandlerDependencies {
  vehicleTransitionRef: React.RefObject<{ startTransition: (type: 'in' | 'out') => void; getObject: () => any }>;
  isDisintegratedRef: React.MutableRefObject<boolean>;
  isRespawningRef: React.MutableRefObject<boolean>;
  setTargetSpeed: (speed: number) => void;
  vehicleRef?: React.RefObject<{ playerRef?: React.RefObject<any> }>;
  lightWallRef?: React.RefObject<{ reset: () => void }>;
  resetMovement?: () => void;
}

export const useCrashHandler = (deps?: CrashHandlerDependencies) => {
  const crash = useTronStore(state => state.crash);
  const setVehicleDisintegrating = useTronStore(state => state.setVehicleDisintegrating);
  const setTargetSpeed = useTronStore(state => state.setTargetSpeed);
  const getUserPlayer = useTronStore(state => state.getUserPlayer);
  const getTronState = useTronStore.getState;
  const crashedPlayersRef = useRef<Set<string>>(new Set());
  const respawnTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      respawnTimersRef.current.forEach(timer => clearTimeout(timer));
      respawnTimersRef.current.clear();
    };
  }, []);

  const handleCrash = useCallback(
    (vehiclePlayerId: string, wallPlayerId: string) => {
      if (crashedPlayersRef.current.has(vehiclePlayerId) || respawnTimersRef.current.has(vehiclePlayerId)) {
        return;
      }
      crashedPlayersRef.current.add(vehiclePlayerId);

      crash(vehiclePlayerId, wallPlayerId);

      setVehicleDisintegrating(vehiclePlayerId, true);

      setTargetSpeed(vehiclePlayerId, 0);

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
        const currentState = getTronState();
        const player = currentState.game.players[vehiclePlayerId];

        if (player && currentState.mode === Mode.LIGHTCYCLE_BATTLE) {
          // Calculate respawn position
          const battlegroundSize = currentState.game.battlegroundSize;
          const tileSize = currentState.world.tileSize;
          const gamePos = currentState.game.position;

          const tilesPerSide = Math.floor((battlegroundSize * 0.8) / tileSize);
          const randomTileX = Math.floor((Math.random() - 0.5) * tilesPerSide);
          const randomTileZ = Math.floor((Math.random() - 0.5) * tilesPerSide);

          const randomX = gamePos.x + randomTileX * tileSize + tileSize / 2;
          const randomZ = gamePos.z + randomTileZ * tileSize + tileSize / 2;

          // Handle user vehicle respawn
          if (deps && userPlayer && vehiclePlayerId === userPlayer.id) {
            const object = deps.vehicleTransitionRef?.current?.getObject();

            if (object) {
              // Apply respawn position
              object.position.set(randomX, gamePos.y, randomZ);
              object.rotation.set(0, 0, 0);
              object.updateMatrix();
              object.updateMatrixWorld(true);

              // Reset tilt on player model
              if (deps.vehicleRef?.current?.playerRef?.current) {
                deps.vehicleRef.current.playerRef.current.rotation.x = 0;
                deps.vehicleRef.current.playerRef.current.rotation.z = 0;
              }

              // Reset wall trail
              if (deps.lightWallRef?.current) {
                deps.lightWallRef.current.reset();
              }

              // Reset movement state
              if (deps.resetMovement) {
                deps.resetMovement();
              }
              if (deps.setTargetSpeed) {
                deps.setTargetSpeed(0);
              }
            }

            // Trigger creation animation
            setTimeout(() => {
              if (deps.vehicleTransitionRef?.current) {
                deps.vehicleTransitionRef.current.startTransition('in');
              }

              // Clear respawn and disintegration flags after creation animation
              setTimeout(() => {
                if (deps.isDisintegratedRef) {
                  deps.isDisintegratedRef.current = false;
                }
                if (deps.isRespawningRef) {
                  deps.isRespawningRef.current = false;
                }
              }, 2500);
            }, 50);
          }

          setVehicleDisintegrating(vehiclePlayerId, false);
        }

        crashedPlayersRef.current.delete(vehiclePlayerId);
        respawnTimersRef.current.delete(vehiclePlayerId);
      }, 2100);

      respawnTimersRef.current.set(vehiclePlayerId, timer);
    },
    [crash, setVehicleDisintegrating, setTargetSpeed, getUserPlayer, deps]
  );

  return { handleCrash };
};
