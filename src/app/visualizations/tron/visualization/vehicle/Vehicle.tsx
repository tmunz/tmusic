import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { LightWall, LightWallHandle } from './LightWall';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { useCollision } from '../collision/CollisionContext';
import { registerDynamicCollisionObject } from '../collision/useDynamicCollisionObject';
import { useVehicleMovement } from './useVehicleMovement';
import { WireframeTransitionObject, WireframeTransitionHandle } from '../object/WireframeTransitionObject';
import { Box3, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { useTronState } from '../state/TronContext';
import { TronAction } from '../state/TronAction';
import { useVehicleCrashHandler } from './useVehicleCrashHandler';

interface ControlsState {
  accelerate: boolean;
  decelerate: boolean;
  left: boolean;
  right: boolean;
}

interface VehicleProps {
  sampleProvider?: SampleProvider;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  getControlsState?: () => ControlsState;
}

export const Vehicle = forwardRef<Object3D, VehicleProps>(
  ({ sampleProvider, color, position = [0, 0, 0], rotation = [0, 0, 0], getControlsState }, ref) => {
    const vehicleRef = useRef<LightCycleHandle>(null);
    const lightWallRef = useRef<LightWallHandle>(null);
    const vehicleTransitionRef = useRef<WireframeTransitionHandle>(null);
    const targetMeshRef = useRef<Mesh>(null);
    const { unregisterObject, checkCollision, registerObject, getAllObjects } = useCollision();
    const movement = useVehicleMovement();
    const { dispatch, getUserCharacter, getUserPlayer, tronState } = useTronState();
    const direction = useRef(new Vector3());
    const vehicleId = useRef(`vehicle-${Math.random()}`);
    const modelBoundingBoxSize = useRef(new Vector3(1, 1, 1));
    const modelBoundingBoxCenter = useRef(new Vector3(0, 0, 0));
    const isRespawning = useRef(false);
    const isDisintegrated = useRef(false);
    const lastCharacterPositionRef = useRef<{ x: number; y: number; z: number } | null>(null);
    const { handleVehicleCrash } = useVehicleCrashHandler({
      vehicleTransitionRef,
      isDisintegratedRef: isDisintegrated,
      isRespawningRef: isRespawning,
      setTargetSpeed: movement.setTargetSpeed,
    });

    useEffect(() => {
      const vehicleModel = vehicleRef.current?.vehicleModel;
      const mesh = vehicleRef.current?.meshRef.current;
      if (!vehicleModel || !mesh) return;

      // Calculate bounding box in local space
      const originalPosition = mesh.position.clone();
      const originalRotation = mesh.rotation.clone();

      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.updateMatrixWorld(true);

      const bbox = new Box3().setFromObject(vehicleModel);
      bbox.getSize(modelBoundingBoxSize.current);
      bbox.getCenter(modelBoundingBoxCenter.current);

      mesh.position.copy(originalPosition);
      mesh.rotation.copy(originalRotation);
      mesh.updateMatrixWorld(true);
    }, [vehicleRef.current?.vehicleModel]);

    // React to respawns from state changes
    useEffect(() => {
      if (!getControlsState) return; // Only for user-controlled vehicle

      const userCharacter = getUserCharacter();
      if (!userCharacter || !userCharacter.position) return;

      const object = vehicleTransitionRef.current?.getObject();
      if (!object) return;

      const currentPos = userCharacter.position;
      const lastPos = lastCharacterPositionRef.current;

      if (isRespawning.current && lastPos) {
        // Check if state position differs from last known position (respawn occurred)
        const positionChanged = currentPos.x !== lastPos.x || currentPos.y !== lastPos.y || currentPos.z !== lastPos.z;

        if (positionChanged && !userCharacter.isDisintegrated) {
          // Wait for disintegration animation to complete before moving vehicle
          setTimeout(() => {
            // Apply respawn position from state and trigger creation animation
            object.position.set(currentPos.x, currentPos.y, currentPos.z);
            object.rotation.set(0, 0, 0); // Reset to neutral orientation

            // Reset tilt on player model
            if (vehicleRef.current?.playerRef?.current) {
              vehicleRef.current.playerRef.current.rotation.x = 0;
              vehicleRef.current.playerRef.current.rotation.z = 0;
            }

            // Reset wall trail
            if (lightWallRef.current) {
              lightWallRef.current.reset();
            }

            // Reset movement (this resets internal tilt state)
            movement.reset();
            movement.setTargetSpeed(0);

            // Trigger creation animation
            if (vehicleTransitionRef.current) {
              vehicleTransitionRef.current.startTransition('in');
            }

            // Clear collision state after creation animation completes
            setTimeout(() => {
              isDisintegrated.current = false;
              isRespawning.current = false;
            }, 2500); // Wait for full creation animation
          }, 100); // Small delay to ensure disintegration state is cleared

          // Update reference after detecting respawn
          lastCharacterPositionRef.current = { ...currentPos };
        }
      } else if (!isRespawning.current) {
        // Only track position when not respawning to avoid race conditions
        lastCharacterPositionRef.current = { ...currentPos };
      }
    }, [tronState.characters, getControlsState, getUserCharacter, movement]);

    useImperativeHandle(
      ref,
      () => {
        const object = vehicleTransitionRef.current?.getObject();
        const meshObject = object || vehicleRef.current?.meshRef.current!;
        (targetMeshRef as React.MutableRefObject<Mesh | null>).current =
          meshObject && meshObject instanceof Mesh ? meshObject : null;
        return meshObject;
      },
      []
    );

    const TARGET_SPEED_CHANGE_RATE = 60; // Units per second for target speed changes

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
        const userPlayer = getUserPlayer();
        if (userPlayer) {
          dispatch({
            type: TronAction.SET_TARGET_SPEED,
            characterId: userPlayer.id,
            target: newTarget,
          });
        }
      }
    };

    useFrame((state, delta) => {
      const vehicle = vehicleRef.current;
      const mesh = vehicle?.meshRef.current;
      const object = vehicleTransitionRef.current?.getObject();
      if (!mesh || !object) return;

      if (!object.userData.initialized) {
        object.position.set(...position);
        object.rotation.set(...rotation);
        object.userData.initialized = true;
        if (getControlsState) {
          const userPlayer = getUserPlayer();
          if (userPlayer) {
            dispatch({
              type: TronAction.SET_VEHILE_PARAMS,
              characterId: userPlayer.id,
              min: vehicle.params.minSpeed,
              max: vehicle.params.maxSpeed,
            });
          }
        }
      }

      const controls = getControlsState?.() ?? { accelerate: false, decelerate: false, left: false, right: false };
      const {
        minSpeed,
        maxSpeed,
        speedChangeRate,
        baseTurnSpeed,
        maxTurnSpeed,
        turnSpeedIncreaseRate,
        maxTurnTilt,
        tiltSmoothness,
      } = vehicle.params;

      const userCharacter = getUserCharacter();
      const currentTargetSpeed = getControlsState && userCharacter ? userCharacter.vehicle.speed.target : 0;
      updateTargetSpeed(delta, { maxSpeed, minSpeed }, controls, currentTargetSpeed);
      movement.setTargetSpeed(currentTargetSpeed);

      // Prevent steering during disintegration
      if (!isDisintegrated.current) {
        const targetTurnTilt = movement.updateTurning(delta, controls, object, {
          baseTurnSpeed,
          maxTurnSpeed,
          turnSpeedIncreaseRate,
          maxTurnTilt,
          tiltSmoothness,
        });

        movement.applyTilt(targetTurnTilt, delta, tiltSmoothness, object, vehicle?.playerRef?.current);
      }

      const actualSpeed = movement.getActualSpeed();
      if (getControlsState) {
        const userPlayer = getUserPlayer();
        if (userPlayer) {
          dispatch({
            type: TronAction.UPDATE_VEHICLE_SPEED,
            characterId: userPlayer.id,
            actual: actualSpeed,
          });
        }
      }

      direction.current.set(0, 0, -1);
      direction.current.applyQuaternion(object.quaternion);

      const collisionQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), object.rotation.y);

      const userPlayer = getUserPlayer();

      const checkVehicleCollision = (newPosition: Vector3): boolean => {
        if (isDisintegrated.current) return false;

        // Register at new position for movement collision check
        registerDynamicCollisionObject({
          registerObject,
          id: vehicleId.current,
          position: newPosition,
          rotation: collisionQuaternion,
          size: modelBoundingBoxSize.current,
          localCenter: modelBoundingBoxCenter.current,
          type: 'vehicle',
          playerId: userPlayer?.id,
        });

        const allObjects = getAllObjects();
        const registeredVehicle = allObjects.find(obj => obj.id === vehicleId.current);
        if (registeredVehicle) {
          const collisions = checkCollision(registeredVehicle);

          if (collisions.length > 0) {
            // Find the wall we collided with to get its owner
            const wallCollision = collisions.find(c => c.type === 'wall');
            if (!isDisintegrated.current && getControlsState && wallCollision && userPlayer) {
              // Set flag immediately to prevent duplicate calls
              isDisintegrated.current = true;
              isRespawning.current = true;
              handleVehicleCrash(userPlayer.id, wallCollision.playerId || 'unknown');
            }
            return false;
          }
        }
        return true;
      };

      // Skip movement updates during disintegration to allow respawn teleportation
      if (!isDisintegrated.current) {
        movement.updateAndApplyMovement(object, delta, direction.current, { speedChangeRate }, checkVehicleCollision);
      }

      if (lightWallRef.current) {
        lightWallRef.current.update();
      }
    });

    useEffect(() => {
      return () => {
        unregisterObject(vehicleId.current);
      };
    }, [unregisterObject]);

    return (
      <>
        <WireframeTransitionObject ref={vehicleTransitionRef} color={color} autoStart>
          <LightCycle ref={vehicleRef} color={color} />
        </WireframeTransitionObject>
        <LightWall
          ref={lightWallRef}
          getSpawnPoints={() => vehicleRef.current?.getLightWallSpawnPoints() ?? null}
          fadeSegments={1.5}
          sampleProvider={sampleProvider}
          color={color}
          playerId={getUserPlayer()?.id}
        />
      </>
    );
  }
);
