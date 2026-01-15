import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { LightWall, LightWallHandle } from './LightWall';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { useCollision } from '../collision/CollisionContext';
import { registerDynamicCollisionObject } from '../collision/useDynamicCollisionObject';
import { useVehicleMovement } from './useVehicleMovement';
import { useTronState, TronAction } from '../TronContext';

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

export const Vehicle = forwardRef<THREE.Mesh, VehicleProps>(
  ({ sampleProvider, color, position = [0, 0, 0], rotation = [0, 0, 0], getControlsState }, ref) => {
    const lightCycleRef = useRef<LightCycleHandle>(null);
    const lightWallRef = useRef<LightWallHandle>(null);
    const { unregisterObject, checkCollision, registerObject, getAllObjects } = useCollision();
    const movement = useVehicleMovement();
    const { dispatch, tronState } = useTronState();

    const direction = useRef(new THREE.Vector3());
    const vehicleId = useRef(`vehicle-${Math.random()}`);
    const modelBoundingBoxSize = useRef(new THREE.Vector3(1, 1, 1));
    const modelBoundingBoxCenter = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
      const vehicleModel = lightCycleRef.current?.vehicleModel;
      const mesh = lightCycleRef.current?.meshRef.current;
      if (!vehicleModel || !mesh) return;

      // Calculate bounding box in local space
      const originalPosition = mesh.position.clone();
      const originalRotation = mesh.rotation.clone();

      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.updateMatrixWorld(true);

      const bbox = new THREE.Box3().setFromObject(vehicleModel);
      bbox.getSize(modelBoundingBoxSize.current);
      bbox.getCenter(modelBoundingBoxCenter.current);

      mesh.position.copy(originalPosition);
      mesh.rotation.copy(originalRotation);
      mesh.updateMatrixWorld(true);
    }, [lightCycleRef.current?.vehicleModel]);

    useImperativeHandle(ref, () => lightCycleRef.current?.meshRef.current!, []);

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
        dispatch({
          type: TronAction.SET_TARGET_SPEED,
          target: newTarget,
        });
      }
    };

    useFrame((state, delta) => {
      const cycle = lightCycleRef.current;
      const mesh = cycle?.meshRef.current;
      if (!mesh) return;

      if (!mesh.userData.initialized) {
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.userData.initialized = true;
        if (getControlsState) {
          dispatch({
            type: TronAction.SET_VEHILE_PARAMS,
            min: cycle.params.minSpeed,
            max: cycle.params.maxSpeed,
          });
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
      } = cycle.params;

      const currentTargetSpeed = getControlsState ? tronState.user.vehicle.speed.target : 0;
      updateTargetSpeed(delta, { maxSpeed, minSpeed }, controls, currentTargetSpeed);
      movement.setTargetSpeed(currentTargetSpeed);

      const actualSpeed = movement.getActualSpeed();
      if (getControlsState) {
        dispatch({
          type: TronAction.UPDATE_VEHICLE_SPEED,
          actual: actualSpeed,
        });
      }

      const targetTurnTilt = movement.updateTurning(delta, controls, mesh, {
        baseTurnSpeed,
        maxTurnSpeed,
        turnSpeedIncreaseRate,
        maxTurnTilt,
        tiltSmoothness,
      });

      movement.applyTilt(targetTurnTilt, delta, tiltSmoothness, mesh, cycle?.playerRef?.current);

      direction.current.set(0, 0, -1);
      direction.current.applyQuaternion(mesh.quaternion);

      const checkVehicleCollision = (newPosition: THREE.Vector3): boolean => {
        const collisionQuaternion = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          mesh.rotation.y
        );

        registerDynamicCollisionObject({
          registerObject,
          id: vehicleId.current,
          position: newPosition,
          rotation: collisionQuaternion,
          size: modelBoundingBoxSize.current,
          localCenter: modelBoundingBoxCenter.current,
          type: 'vehicle',
        });

        const allObjects = getAllObjects();
        const registeredVehicle = allObjects.find(obj => obj.id === vehicleId.current);
        if (registeredVehicle) {
          const collisions = checkCollision(registeredVehicle);
          return collisions.length === 0;
        }
        return true;
      };

      movement.updateAndApplyMovement(mesh, delta, direction.current, { speedChangeRate }, checkVehicleCollision);

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
        <LightCycle ref={lightCycleRef} color={color} />
        <LightWall
          ref={lightWallRef}
          getSpawnPoints={() => lightCycleRef.current?.getLightWallSpawnPoints() ?? null}
          fadeSegments={1.5}
          sampleProvider={sampleProvider}
          color={color}
        />
      </>
    );
  }
);
