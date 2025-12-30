import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { LightWall, LightWallHandle } from './LightWall';
import { useVehicleControls } from './VehicleControls';
import { SampleProvider } from '../../../../audio/SampleProvider';

interface VehicleProps {
  sampleProvider: SampleProvider;
}

export const Vehicle = forwardRef<THREE.Mesh, VehicleProps>(({ sampleProvider }, ref) => {
  const lightCycleRef = useRef<LightCycleHandle>(null);
  const lightWallRef = useRef<LightWallHandle>(null);
  const getControlsState = useVehicleControls();

  const speedRef = useRef(0);
  const currentTurnSpeed = useRef(1);
  const currentTilt = useRef({ x: 0, z: 0 });
  const direction = useRef(new THREE.Vector3());

  useImperativeHandle(ref, () => lightCycleRef.current?.meshRef.current!, []);

  useFrame((state, delta) => {
    const cycle = lightCycleRef.current;
    if (!cycle?.meshRef.current) return;

    const controls = getControlsState();
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

    const { meshRef, playerRef } = cycle;

    if (controls.accelerate) {
      speedRef.current = Math.min(maxSpeed, speedRef.current + speedChangeRate * delta);
    }
    if (controls.decelerate) {
      speedRef.current = Math.max(minSpeed, speedRef.current - speedChangeRate * delta);
    }

    let targetTurnTilt = 0;

    if (controls.left) {
      currentTurnSpeed.current = Math.min(maxTurnSpeed, currentTurnSpeed.current + turnSpeedIncreaseRate * delta);
      meshRef.current!.rotation.y += currentTurnSpeed.current * delta;
      targetTurnTilt = maxTurnTilt * (currentTurnSpeed.current / maxTurnSpeed);
    } else if (controls.right) {
      currentTurnSpeed.current = Math.min(maxTurnSpeed, currentTurnSpeed.current + turnSpeedIncreaseRate * delta);
      meshRef.current!.rotation.y -= currentTurnSpeed.current * delta;
      targetTurnTilt = -maxTurnTilt * (currentTurnSpeed.current / maxTurnSpeed);
    } else {
      currentTurnSpeed.current = baseTurnSpeed;
    }

    currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
    meshRef.current!.rotation.x = currentTilt.current.x;
    meshRef.current!.rotation.z = currentTilt.current.z;

    if (playerRef.current) {
      playerRef.current.rotation.x = currentTilt.current.x / 2;
      playerRef.current.rotation.z = currentTilt.current.z / 2;
    }

    direction.current.set(0, 0, -1);
    direction.current.applyQuaternion(meshRef.current!.quaternion);
    meshRef.current!.position.addScaledVector(direction.current, speedRef.current * delta);

    if (lightWallRef.current) {
      lightWallRef.current.update();
    }
  });

  return (
    <>
      <LightCycle ref={lightCycleRef} />
      <LightWall
        ref={lightWallRef}
        getSpawnPoints={() => lightCycleRef.current?.getLightWallSpawnPoints() ?? null}
        fadeSegments={3}
        sampleProvider={sampleProvider}
      />
    </>
  );
});
