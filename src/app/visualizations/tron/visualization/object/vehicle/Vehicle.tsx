import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { Box3, Vector3, Group, Quaternion, Object3D } from 'three';
import { VehicleParams } from './VehicleParams';
import { WireframeTransitionObject, WireframeTransitionHandle } from '../WireframeTransitionObject';

interface VehicleProps {
  id: string;
  color?: string;
  disintegrated?: boolean;
}

export interface VehicleHandle {
  getParams: () => VehicleParams;
  getPlayerRef: () => React.RefObject<Group> | undefined;
  getLightWallSpawnPoints: () => { lower: Vector3; upper: Vector3 } | null;
  getBoundingBox: () => Box3 | null;
  getObject: () => Object3D | null;
}

export const Vehicle = forwardRef<VehicleHandle, VehicleProps>(({ id, color, disintegrated }, ref) => {
  const vehicleRef = useRef<LightCycleHandle>(null);
  const wireframeRef = useRef<WireframeTransitionHandle>(null);
  const modelBoundingBox = useRef(new Box3());

  useEffect(() => {
    const vehicleModel = vehicleRef.current?.vehicleModel;
    if (!vehicleModel) return;
    modelBoundingBox.current.setFromObject(vehicleModel);
  }, [vehicleRef.current?.vehicleModel]);

  useEffect(() => {
    if (disintegrated) {
      wireframeRef.current?.disintegrate();
    } else {
      wireframeRef.current?.integrate();
    }
  }, [disintegrated]);

  useFrame(() => {
    const vehicle = wireframeRef.current?.getObject();
    const player = vehicleRef.current?.playerRef.current;
    if (player && vehicle) {
      player.rotation.x = vehicle.rotation.x / 4;
      player.rotation.z = vehicle.rotation.z / 4;
    }
  });

  const getLightWallSpawnPoints = (): { lower: Vector3; upper: Vector3 } | null => {
    const objectRef = vehicleRef.current?.lightCycleRef;
    const params = vehicleRef.current?.params;
    if (!objectRef?.current || !params) return null;

    const worldPosition = new Vector3();
    const worldQuaternion = new Quaternion();
    objectRef.current.getWorldPosition(worldPosition);
    objectRef.current.getWorldQuaternion(worldQuaternion);

    const backwardOffset = new Vector3(0, 0, params.lightWallOffset);
    backwardOffset.applyQuaternion(worldQuaternion);
    const lower = worldPosition.clone().add(backwardOffset);

    const upperOffset = new Vector3(0, params.lightWallHeight, 0);
    upperOffset.applyQuaternion(worldQuaternion);
    const upper = lower.clone().add(upperOffset);

    return { lower, upper };
  };

  useImperativeHandle(
    ref,
    () => ({
      getParams: () => vehicleRef.current?.params!,
      getPlayerRef: () => vehicleRef.current?.playerRef,
      getLightWallSpawnPoints,
      getBoundingBox: () => modelBoundingBox.current,
      getObject: () => wireframeRef.current?.getObject() ?? null,
    }),
    []
  );

  return (
    <WireframeTransitionObject ref={wireframeRef} color={color} autoStart>
      <LightCycle ref={vehicleRef} color={color} />
    </WireframeTransitionObject>
  );
});
