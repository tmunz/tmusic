import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D } from 'three';
import { useLightWallCollision } from './useLightWallCollision';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { Vehicle, VehicleHandle } from '../object/vehicle/Vehicle';
import { LightWall, LightWallHandle } from './LightWall';
import { useTronStore } from '../state/TronStore';
import { useMovement } from '../movement/useMovement';
import { useGameHandler } from '../game/useGameHandler';
import { Mode } from '../state/TronState';
import { ControlsState } from '../userInput/UserInput';
import { useUserInputForMovement } from '../userInput/useUserInputForMovement';
import { useSpeedControl } from '../movement/useSpeedControl';

interface CharacterProps {
  id: string; // don't change during lifecycle
  sampleProvider?: SampleProvider;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  getControlsState?: () => ControlsState;
}

export const Character = forwardRef<Object3D, CharacterProps>(
  ({ id, sampleProvider, color, position = [0, 0, 0], rotation = [0, 0, 0], getControlsState }, ref) => {
    const vehicleRef = useRef<VehicleHandle>(null);
    const lightWallRef = useRef<LightWallHandle>(null);
    const respawnTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isRespawningRef = useRef<boolean>(false);
    const movement = useMovement();
    const speedControl = useSpeedControl();
    const { checkBattlegroundStatus, getBattlegroundRespawnPosition } = useGameHandler();
    const { checkCollisionAtPosition } = useLightWallCollision({
      id,
      ref: vehicleRef,
      onCollision: (wallOwnerId: string) => onLightWallCollision(wallOwnerId),
    });
    const store = useTronStore();
    const characterState = store.characters[id];

    useImperativeHandle(ref, () => vehicleRef.current?.getObject() || ({} as Object3D), []);

    useEffect(() => {
      const vehicle = vehicleRef.current?.getObject();
      const movementCharacteritics = vehicleRef.current?.getParams();

      if (vehicle && movementCharacteritics) {
        vehicle.position.set(...position);
        vehicle.rotation.set(...rotation);

        if (getControlsState) {
          store.setVehicleParams(id, movementCharacteritics.maxSpeed, movementCharacteritics.minSpeed);
        }
      }
    }, []);

    const applyRespawn = () => {
      const vehicle = vehicleRef.current?.getObject();
      if (!vehicle) return;
      const position = getBattlegroundRespawnPosition();
      vehicle.position.set(position.x, position.y, position.z);
      vehicle.rotation.set(0, 0, 0);
      vehicle.updateMatrix();
      vehicle.updateMatrixWorld(true);
      const playerRef = vehicleRef.current?.getPlayerRef();
      if (playerRef?.current) {
        playerRef.current.rotation.x = 0;
        playerRef.current.rotation.z = 0;
      }
      lightWallRef.current?.reset();
      movement.reset();
      speedControl.reset();
      store.setDisintegration(id, false);
      isRespawningRef.current = false;
    };

    const onLightWallCollision = (wallPlayerId: string) => {
      if (isRespawningRef.current) return;
      isRespawningRef.current = true;
      store.handleLightWallCollision(id, wallPlayerId);
      respawnTimerRef.current = setTimeout(() => {
        applyRespawn();
        respawnTimerRef.current = null;
      }, 2100);
    };

    useFrame((_state, delta) => {
      const vehicle = vehicleRef.current?.getObject();
      const movementCharacteristics = vehicleRef.current?.getParams();

      if (!vehicle || !movementCharacteristics) return;

      const { movementControlState, targetSpeed } = useUserInputForMovement(
        delta,
        speedControl,
        getControlsState?.(),
        movementCharacteristics
      );
      store.setTargetSpeed(id, targetSpeed);
      store.updateVehicleSpeed(id, movementControlState?.speed ?? 0);

      movement.updateFrame({
        delta,
        controls: movementControlState,
        object: vehicle,
        movementCharacteristics,
        checkCollision: checkCollisionAtPosition,
        isDisintegrated: characterState?.isDisintegrated ?? false,
      });

      lightWallRef.current?.update();

      if (store.mode === Mode.LIGHTCYCLE_BATTLE) {
        checkBattlegroundStatus(vehicle);
      }
    });

    return (
      <>
        <Vehicle ref={vehicleRef} id={id} color={color} disintegrated={characterState?.isDisintegrated ?? false} />
        <LightWall
          ref={lightWallRef}
          getSpawnPoints={() => vehicleRef.current?.getLightWallSpawnPoints() ?? null}
          fadeSegments={1.5}
          sampleProvider={sampleProvider}
          color={color}
          playerId={id}
        />
      </>
    );
  }
);
