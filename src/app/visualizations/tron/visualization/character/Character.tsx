import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D } from 'three';
import { useLightWallCollision } from './useLightWallCollision';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { Vehicle, VehicleHandle } from '../object/vehicle/Vehicle';
import { LightWall, LightWallHandle } from './LightWall';
import { useTronStore } from '../state/TronStore';
import { useMovement } from '../movement/useMovement';
import { useLightCycleBattleHandler } from '../game/useLightCycleBattleHandler';
import { Mode } from '../state/TronState';
import { ControlsState } from '../userInput/useUserInput';
import { applySpeedControls } from '../movement/applySpeedControls';

export interface CharacterProps {
  id: string; // don't change during lifecycle
  sampleProvider?: SampleProvider;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  getControlsState?: () => ControlsState;
  vehicleRef?: React.RefObject<VehicleHandle>;
}

export const Character = forwardRef<Object3D, CharacterProps>(
  (
    {
      id,
      sampleProvider,
      color,
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      getControlsState,
      vehicleRef: externalVehicleRef,
    },
    ref
  ) => {
    const internalVehicleRef = useRef<VehicleHandle>(null);
    const vehicleRef = externalVehicleRef || internalVehicleRef;
    const lightWallRef = useRef<LightWallHandle>(null);
    const respawnTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isRespawningRef = useRef<boolean>(false);
    const movement = useMovement(id);
    
    const handleDisintegration = (wallPlayerId?: string) => {
      if (isRespawningRef.current) return;
      isRespawningRef.current = true;
      const handleLightCycleBattleDisintegration = useTronStore.getState().handleLightCycleBattleDisintegration;
      handleLightCycleBattleDisintegration(id, wallPlayerId);
      const applyRespawn = () => {
        const vehicle = vehicleRef.current?.getObject();
        if (!vehicle) return;
        const { position, rotation } = getBattlegroundSpawnPosition();
        vehicle.position.set(position.x, position.y, position.z);
        vehicle.rotation.set(rotation.x, rotation.y, rotation.z);
        vehicle.updateMatrix();
        vehicle.updateMatrixWorld(true);
        const playerRef = vehicleRef.current?.getPlayerRef();
        if (playerRef?.current) {
          playerRef.current.rotation.x = 0;
          playerRef.current.rotation.z = 0;
        }
        lightWallRef.current?.reset();
        movement.reset();
        setTargetSpeedAction(id, 0, 0);
        resetPlayerOutsideTimer(id);
        setDisintegration(id, false);
        isRespawningRef.current = false;
      };
      respawnTimerRef.current = setTimeout(() => {
        applyRespawn();
        respawnTimerRef.current = null;
      }, 2100);
    };
    
    const { checkBattlegroundStatus, getBattlegroundSpawnPosition } = useLightCycleBattleHandler({
      onDisintegration: handleDisintegration,
    });
    const { checkCollisionAtPosition } = useLightWallCollision({
      id,
      ref: vehicleRef,
      onCollision: (wallOwnerId: string) => handleDisintegration(wallOwnerId),
    });
    const characterState = useTronStore(state => state.characters[id]);
    const mode = useTronStore(state => state.mode);
    const setSpeed = useTronStore(state => state.setSpeed);
    const updateSpeed = useTronStore(state => state.updateSpeed);
    const setVehicleParams = useTronStore(state => state.setVehicleParams);
    const setDisintegration = useTronStore(state => state.setDisintegration);
    const setTargetSpeedAction = useTronStore(state => state.setSpeed);
    const resetPlayerOutsideTimer = useTronStore(state => state.resetPlayerOutsideTimer);

    useImperativeHandle(ref, () => vehicleRef.current?.getObject() || ({} as Object3D), [vehicleRef]);

    useEffect(() => {
      const vehicle = vehicleRef.current?.getObject();
      const movementCharacteritics = vehicleRef.current?.getParams();

      if (vehicle && movementCharacteritics) {
        vehicle.position.set(...position);
        vehicle.rotation.set(...rotation);

        if (getControlsState) {
          setVehicleParams(id, movementCharacteritics.maxSpeed, movementCharacteritics.minSpeed);
        }
      }
    }, []);

    useFrame((_state, delta) => {
      const vehicle = vehicleRef.current?.getObject();
      const movementCharacteristics = vehicleRef.current?.getParams();

      if (!vehicle || !movementCharacteristics) return;

      const { movementControlState } = applySpeedControls(
        id,
        delta,
        {
          targetSpeed: characterState?.speed.target ?? 0,
          actualSpeed: characterState?.speed.actual ?? 0,
        },
        { setSpeed, updateSpeed },
        getControlsState?.(),
        movementCharacteristics
      );

      movement.updateFrame({
        delta,
        controls: movementControlState,
        object: vehicle,
        movementCharacteristics,
        checkCollision: checkCollisionAtPosition,
        isDisintegrated: characterState?.isDisintegrated ?? false,
      });

      lightWallRef.current?.update();

      if (mode === Mode.LIGHTCYCLE_BATTLE) {
        checkBattlegroundStatus(vehicle, id, delta);
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
