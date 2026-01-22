import { useRef, forwardRef, useImperativeHandle, useEffect, MutableRefObject } from 'react';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { useCollision } from '../../collision/CollisionContext';
import { registerCollisionObject } from '../../collision/useCollisionObject';
import { Box3, Mesh, Object3D, Quaternion, Vector3, Group } from 'three';
import { VehicleParams } from './VehicleParams';
import { ControlsState } from '../../UserInput';

interface VehicleProps {
  color?: string;
  getControlsState?: () => ControlsState;
  isDisintegrated: MutableRefObject<boolean>;
  onCollision?: (wallOwnerId: string) => void;
}

export interface VehicleHandle {
  getObject: () => Object3D;
  getParams: () => VehicleParams;
  getPlayerRef: () => React.RefObject<Group> | undefined;
  getLightWallSpawnPoints: () => { lower: Vector3; upper: Vector3 } | null;
  checkCollision: (newPosition: Vector3, rotation: Quaternion) => boolean;
}

export const Vehicle = forwardRef<VehicleHandle, VehicleProps>(
  ({ color, getControlsState, isDisintegrated, onCollision }, ref) => {
    const vehicleRef = useRef<LightCycleHandle>(null);
    const targetMeshRef = useRef<Mesh>(null);
    const { unregisterObject, checkCollision, registerObject, getAllObjects } = useCollision();
    const vehicleId = useRef(`vehicle-${Math.random()}`);
    const modelBoundingBoxSize = useRef(new Vector3(1, 1, 1));
    const modelBoundingBoxCenter = useRef(new Vector3(0, 0, 0));

    useEffect(() => {
      const vehicleModel = vehicleRef.current?.vehicleModel;
      const mesh = vehicleRef.current?.meshRef.current;
      if (!vehicleModel || !mesh) return;

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

    useImperativeHandle(
      ref,
      () => ({
        getObject: () => {
          const meshObject = vehicleRef.current?.meshRef.current!;
          (targetMeshRef as React.MutableRefObject<Mesh | null>).current =
            meshObject && meshObject instanceof Mesh ? meshObject : null;
          return meshObject;
        },
        getParams: () => vehicleRef.current?.params!,
        getPlayerRef: () => vehicleRef.current?.playerRef,
        getLightWallSpawnPoints: () => vehicleRef.current?.getLightWallSpawnPoints() ?? null,
        checkCollision: (newPosition: Vector3, rotation: Quaternion) => {
          if (isDisintegrated.current) return true;

          registerCollisionObject({
            registerObject,
            id: vehicleId.current,
            position: newPosition,
            rotation: rotation,
            size: modelBoundingBoxSize.current,
            localCenter: modelBoundingBoxCenter.current,
            data: {
              type: 'vehicle',
              playerId: getControlsState ? 'user' : undefined,
            },
          });

          const allObjects = getAllObjects();
          const registeredVehicle = allObjects.find(obj => obj.id === vehicleId.current);
          if (registeredVehicle) {
            const collisions = checkCollision(registeredVehicle);

            if (collisions.length > 0) {
              const wallCollision = collisions.find(c => c.type === 'wall');
              if (!isDisintegrated.current && getControlsState && wallCollision) {
                onCollision?.(wallCollision.playerId || 'unknown');
              }
              return false;
            }
          }
          return true;
        },
      }),
      [isDisintegrated, getControlsState, onCollision, registerObject, getAllObjects, checkCollision]
    );

    useEffect(() => {
      return () => {
        unregisterObject(vehicleId.current);
      };
    }, [unregisterObject]);

    return <LightCycle ref={vehicleRef} color={color} />;
  }
);
