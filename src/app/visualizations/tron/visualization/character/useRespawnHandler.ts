import { useCallback, useRef } from 'react';
import { useTronStore } from '../state/TronStore';
import { TronState } from '../state/TronState';

interface RespawnHandlerDependencies {
  vehicleTransitionRef: React.RefObject<{ startTransition: (type: 'in' | 'out') => void; getObject: () => any }>;
  isDisintegratedRef: React.MutableRefObject<boolean>;
  isRespawningRef: React.MutableRefObject<boolean>;
  setTargetSpeed: (speed: number) => void;
  vehicleRef?: React.RefObject<{ playerRef?: React.RefObject<any> }>;
  lightWallRef?: React.RefObject<{ reset: () => void }>;
  resetMovement?: () => void;
}

export const useRespawnHandler = (deps?: RespawnHandlerDependencies) => {
  const setVehicleDisintegrating = useTronStore(state => state.setVehicleDisintegrating);
  const setTargetSpeed = useTronStore(state => state.setTargetSpeed);
  const getUserPlayer = useTronStore(state => state.getUserPlayer);
  const respawnTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const calculateRespawnPosition = useCallback((state: TronState) => {
    const battlegroundSize = state.game.battlegroundSize;
    const tileSize = state.world.tileSize;
    const gamePos = state.game.position;

    const tilesPerSide = Math.floor((battlegroundSize * 0.8) / tileSize);
    const randomTileX = Math.floor((Math.random() - 0.5) * tilesPerSide);
    const randomTileZ = Math.floor((Math.random() - 0.5) * tilesPerSide);

    const randomX = gamePos.x + randomTileX * tileSize + tileSize / 2;
    const randomZ = gamePos.z + randomTileZ * tileSize + tileSize / 2;

    return {
      x: randomX,
      y: gamePos.y,
      z: randomZ,
    };
  }, []);

  const applyRespawnToVehicle = useCallback(
    (vehiclePlayerId: string, position: { x: number; y: number; z: number }) => {
      // Handle user vehicle respawn
      const userPlayer = getUserPlayer();
      if (deps && userPlayer && vehiclePlayerId === userPlayer.id) {
        const object = deps.vehicleTransitionRef?.current?.getObject();

        if (object) {
          // Apply respawn position immediately
          object.position.set(position.x, position.y, position.z);
          object.rotation.set(0, 0, 0);

          // Force matrix update to ensure position is applied immediately
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

        // Small delay before starting creation animation to ensure position is applied
        setTimeout(() => {
          // Trigger creation animation after repositioning
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
    },
    [getUserPlayer, deps]
  );

  const scheduleRespawn = useCallback(
    (vehiclePlayerId: string, state: TronState, delay: number = 2100) => {
      // Clear any existing respawn timer for this vehicle
      const existingTimer = respawnTimersRef.current.get(vehiclePlayerId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        // Calculate new position and apply respawn
        const position = calculateRespawnPosition(state);
        applyRespawnToVehicle(vehiclePlayerId, position);

        // Update disintegration state
        setVehicleDisintegrating(vehiclePlayerId, false);

        // Set target speed to 0
        setTargetSpeed(vehiclePlayerId, 0);

        // Clean up timer reference
        respawnTimersRef.current.delete(vehiclePlayerId);
      }, delay);

      respawnTimersRef.current.set(vehiclePlayerId, timer);

      return timer;
    },
    [calculateRespawnPosition, applyRespawnToVehicle, setVehicleDisintegrating, setTargetSpeed]
  );

  const cancelRespawn = useCallback((vehiclePlayerId: string) => {
    const timer = respawnTimersRef.current.get(vehiclePlayerId);
    if (timer) {
      clearTimeout(timer);
      respawnTimersRef.current.delete(vehiclePlayerId);
    }
  }, []);

  const clearAllRespawns = useCallback(() => {
    respawnTimersRef.current.forEach(timer => clearTimeout(timer));
    respawnTimersRef.current.clear();
  }, []);

  return {
    scheduleRespawn,
    cancelRespawn,
    clearAllRespawns,
    calculateRespawnPosition,
    applyRespawnToVehicle,
  };
};
