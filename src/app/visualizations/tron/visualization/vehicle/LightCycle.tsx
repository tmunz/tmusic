import { useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useLightCycleB, usePlayer } from './VehicleModelLoader';
import { VehicleParams } from './VehicleParams';

interface LightCycleProps {
  color?: string;
}

export interface LightCycleHandle {
  meshRef: React.RefObject<THREE.Mesh>;
  playerRef: React.RefObject<THREE.Group>;
  vehicleModel: THREE.Object3D | null;
  params: VehicleParams;
  getLightWallSpawnPoints: () => { lower: THREE.Vector3; upper: THREE.Vector3 } | null;
}

export const LightCycle = forwardRef<LightCycleHandle, LightCycleProps>(({ color = '#00ffff' }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const playerRef = useRef<THREE.Group>(null);

  const player = usePlayer(color);
  const vehicle = useLightCycleB(color);

  const params: VehicleParams = {
    minSpeed: 0,
    maxSpeed: 60,
    speedChangeRate: 30,
    baseTurnSpeed: 1,
    maxTurnSpeed: 2,
    turnSpeedIncreaseRate: 4,
    maxTurnTilt: 0.4,
    tiltSmoothness: 5,
    lightWallOffset: 0.0,
    lightWallHeight: 0.75,
  };

  const getLightWallSpawnPoints = () => {
    if (!meshRef.current) return null;
    const backwardOffset = new THREE.Vector3(0, 0, params.lightWallOffset);
    backwardOffset.applyQuaternion(meshRef.current.quaternion);
    const lower = meshRef.current.position.clone().add(backwardOffset);

    const upperOffset = new THREE.Vector3(0, params.lightWallHeight, 0);
    upperOffset.applyQuaternion(meshRef.current.quaternion);
    const upper = lower.clone().add(upperOffset);

    return { lower, upper };
  };

  useImperativeHandle(ref, () => ({
    meshRef,
    playerRef,
    vehicleModel: vehicle,
    getLightWallSpawnPoints,
    params,
  }));

  return (
    <group ref={meshRef as any}>
      {player && (
        <group ref={playerRef}>
          <primitive object={player} />
        </group>
      )}
      {vehicle && <primitive object={vehicle} />}
    </group>
  );
});
