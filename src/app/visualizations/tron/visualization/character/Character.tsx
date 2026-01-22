import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Quaternion, Vector3 } from 'three';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { WireframeTransitionObject, WireframeTransitionHandle } from '../object/WireframeTransitionObject';
import { Vehicle, VehicleHandle } from '../object/vehicle/Vehicle';
import { LightWall, LightWallHandle } from './LightWall';
import { useGameHandler } from './useGameHandler';
import { useTronStore } from '../state/TronStore';
import { ControlsState } from '../UserInput';
import { useMovement } from './useMovement';
import { useCrashHandler } from './useCrashHandler';

interface CharacterProps {
  id: string;
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
    const wireframeRef = useRef<WireframeTransitionHandle>(null);
    const isRespawning = useRef(false);
    const isDisintegrated = useRef(false);
    const direction = useRef(new Vector3());

    const movement = useMovement();
    const setTargetSpeed = useTronStore(state => state.setTargetSpeed);
    const setVehicleParams = useTronStore(state => state.setVehicleParams);
    const updateVehicleSpeed = useTronStore(state => state.updateVehicleSpeed);
    const getUserCharacter = useTronStore(state => state.getUserCharacter);
    const gameHandler = useGameHandler({ enabled: !!getControlsState });

    const { handleCrash } = useCrashHandler({
      vehicleTransitionRef: wireframeRef,
      isDisintegratedRef: isDisintegrated,
      isRespawningRef: isRespawning,
      setTargetSpeed: movement.setTargetSpeed,
      lightWallRef,
      resetMovement: movement.reset,
    });

    useImperativeHandle(
      ref,
      () => {
        return wireframeRef.current?.getObject() || ({} as Object3D);
      },
      []
    );

    const TARGET_SPEED_CHANGE_RATE = 60;

    const updateTargetSpeed = (
      delta: number,
      params: { maxSpeed: number; minSpeed: number },
      controls: ControlsState,
      currentTarget: number
    ) => {
      const { maxSpeed, minSpeed } = params;
      const speedDelta = TARGET_SPEED_CHANGE_RATE * delta;
      let newTarget = currentTarget;

      if (controls.accelerate) {
        newTarget = Math.min(maxSpeed, currentTarget + speedDelta);
      }

      if (controls.decelerate) {
        newTarget = Math.max(minSpeed, currentTarget - speedDelta);
      }

      if (newTarget !== currentTarget && getControlsState) {
        setTargetSpeed(id, newTarget);
      }
    };

    useFrame((_state, delta) => {
      const wireframeObject = wireframeRef.current?.getObject();
      const vehicleParams = vehicleRef.current?.getParams();

      if (!wireframeObject || !vehicleParams) return;

      if (!wireframeObject.userData.initialized) {
        wireframeObject.position.set(...position);
        wireframeObject.rotation.set(...rotation);
        wireframeObject.userData.initialized = true;
        if (getControlsState) {
          setVehicleParams(id, vehicleParams.maxSpeed, vehicleParams.minSpeed);
        }
      }

      const controls: ControlsState = getControlsState?.() ?? {
        accelerate: false,
        decelerate: false,
        left: false,
        right: false,
        camera: 0,
      };
      const {
        minSpeed,
        maxSpeed,
        speedChangeRate,
        baseTurnSpeed,
        maxTurnSpeed,
        turnSpeedIncreaseRate,
        maxTurnTilt,
        tiltSmoothness,
      } = vehicleParams;

      const userCharacter = getUserCharacter();
      const currentTargetSpeed = getControlsState && userCharacter ? userCharacter.vehicle.speed.target : 0;
      updateTargetSpeed(delta, { maxSpeed, minSpeed }, controls, currentTargetSpeed);
      movement.setTargetSpeed(currentTargetSpeed);

      // Handle steering and tilt on the wrapper
      if (!isDisintegrated.current) {
        const targetTurnTilt = movement.updateTurning(delta, controls, wireframeObject, {
          baseTurnSpeed,
          maxTurnSpeed,
          turnSpeedIncreaseRate,
          maxTurnTilt,
          tiltSmoothness,
        });

        const playerRef = vehicleRef.current?.getPlayerRef();
        movement.applyTilt(targetTurnTilt, delta, tiltSmoothness, wireframeObject, playerRef?.current);
      }

      const actualSpeed = movement.getActualSpeed();
      if (getControlsState) {
        updateVehicleSpeed(id, actualSpeed);
      }

      direction.current.set(0, 0, -1);
      direction.current.applyQuaternion(wireframeObject.quaternion);

      if (!isDisintegrated.current) {
        const checkCollision = (newPosition: Vector3): boolean => {
          return (
            vehicleRef.current?.checkCollision(
              newPosition,
              new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), wireframeObject.rotation.y)
            ) ?? true
          );
        };

        movement.updateAndApplyMovement(wireframeObject, delta, direction.current, { speedChangeRate }, checkCollision);
      }

      gameHandler.checkBattlegroundStatus(wireframeObject);
      if (lightWallRef.current) {
        lightWallRef.current.update();
      }
    });

    const handleCollision = (wallOwnerId: string) => {
      if (!isDisintegrated.current && getControlsState) {
        isDisintegrated.current = true;
        isRespawning.current = true;
        handleCrash(id, wallOwnerId);
      }
    };

    return (
      <>
        <WireframeTransitionObject ref={wireframeRef} color={color} autoStart>
          <Vehicle
            ref={vehicleRef}
            color={color}
            getControlsState={getControlsState}
            isDisintegrated={isDisintegrated}
            onCollision={handleCollision}
          />
        </WireframeTransitionObject>
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
