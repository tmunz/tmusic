import { useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useLightCycleB, usePlayer } from './VehicleModelLoader';
import { VehicleParams } from './VehicleParams';

interface LightCycleProps {}

export interface LightCycleHandle {
  meshRef: React.RefObject<THREE.Mesh>;
  playerRef: React.RefObject<THREE.Group>;
  params: VehicleParams;
  getLightWallSpawnPoints: () => { lower: THREE.Vector3; upper: THREE.Vector3 } | null;
}

export const LightCycle = forwardRef<LightCycleHandle, LightCycleProps>((props, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const playerRef = useRef<THREE.Group>(null);

  const player = usePlayer();
  const vehicle = useLightCycleB();

  const getLightWallSpawnPoints = () => {
    if (!meshRef.current) return null;

    const lightWallOffset = 0.85;
    const lightWallHeight = 0.75;

    const backwardOffset = new THREE.Vector3(0, 0, lightWallOffset);
    backwardOffset.applyQuaternion(meshRef.current.quaternion);
    const lower = meshRef.current.position.clone().add(backwardOffset);

    const upperOffset = new THREE.Vector3(0, lightWallHeight, 0);
    upperOffset.applyQuaternion(meshRef.current.quaternion);
    const upper = lower.clone().add(upperOffset);

    return { lower, upper };
  };

  useImperativeHandle(ref, () => ({
    meshRef,
    playerRef,
    getLightWallSpawnPoints,
    params: {
      minSpeed: 1,
      maxSpeed: 50,
      speedChangeRate: 10,
      baseTurnSpeed: 1,
      maxTurnSpeed: 1.5,
      turnSpeedIncreaseRate: 2,
      maxTurnTilt: 0.4,
      tiltSmoothness: 5,
      lightWallOffset: 0.87,
      lightWallHeight: 0.75,
    },
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
