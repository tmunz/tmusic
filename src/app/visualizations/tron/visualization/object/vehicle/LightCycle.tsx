import { useRef, forwardRef, useImperativeHandle } from 'react';
import { VehicleParams } from './VehicleParams';
import { Group, Object3D } from 'three';
import * as vehicleModelLoader from './VehicleModelLoader';

interface LightCycleProps {
  color?: string;
}

export interface LightCycleHandle {
  lightCycleRef: React.RefObject<Object3D>;
  playerRef: React.RefObject<Group>;
  vehicleModel: Object3D | null;
  params: VehicleParams;
}

export const LightCycle = forwardRef<LightCycleHandle, LightCycleProps>(({ color = '#00ffff' }, ref) => {
  const lightCycleRef = useRef<Object3D>(null);
  const playerRef = useRef<Group>(null);

  const player = vehicleModelLoader.usePlayer(color);
  const vehicle = vehicleModelLoader.useLightCycleB(color);

  const params: VehicleParams = {
    minSpeed: 0,
    maxSpeed: 60,
    speedChangeRate: 20,
    baseTurnSpeed: 1,
    maxTurnSpeed: 2,
    turnSpeedIncreaseRate: 4,
    maxTurnTilt: 0.4,
    tiltSmoothness: 5,
    lightWallOffset: 0.0,
    lightWallHeight: 0.75,
  };

  useImperativeHandle(ref, () => ({
    lightCycleRef,
    playerRef,
    vehicleModel: vehicle,
    params,
  }));

  return (
    <group ref={lightCycleRef as any}>
      {player && (
        <group ref={playerRef}>
          <primitive object={player} />
        </group>
      )}
      {vehicle && <primitive object={vehicle} />}
    </group>
  );
});
