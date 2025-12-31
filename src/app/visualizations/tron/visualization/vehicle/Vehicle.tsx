import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LightCycle, LightCycleHandle } from './LightCycle';
import { LightWall, LightWallHandle } from './LightWall';
import { useVehicleControls } from './VehicleControls';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { useSampleProviderActive } from '../../../../audio/useSampleProviderActive';

interface VehicleProps {
  sampleProvider: SampleProvider;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Vehicle = forwardRef<THREE.Mesh, VehicleProps>(
  ({ sampleProvider, color, position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
    const lightCycleRef = useRef<LightCycleHandle>(null);
    const lightWallRef = useRef<LightWallHandle>(null);
    const getControlsState = useVehicleControls();
    const isActive = useSampleProviderActive(sampleProvider);

    const speedRef = useRef(0);
    const currentTurnSpeed = useRef(1);
    const currentTurnDirection = useRef(0); // 1 for left, 0 for neutral, -1 for right
    const currentTilt = useRef({ x: 0, z: 0 });
    const direction = useRef(new THREE.Vector3());
    const shouldAutoAccelerate = useRef(false);

    useEffect(() => {
      if (isActive && speedRef.current < 1) {
        shouldAutoAccelerate.current = true;
      }
    }, [isActive]);

    useImperativeHandle(ref, () => lightCycleRef.current?.meshRef.current!, []);

    const updateSpeed = (delta: number, maxSpeed: number, speedChangeRate: number, minSpeed: number, controls: any) => {
      if (shouldAutoAccelerate.current) {
        speedRef.current = Math.min(maxSpeed, speedRef.current + speedChangeRate * delta);
        if (speedRef.current >= maxSpeed) {
          shouldAutoAccelerate.current = false;
        }
      } else if (controls.accelerate) {
        speedRef.current = Math.min(maxSpeed, speedRef.current + speedChangeRate * delta);
      }
      if (controls.decelerate) {
        speedRef.current = Math.max(minSpeed, speedRef.current - speedChangeRate * delta);
      }
    };

    const updateTurning = (
      delta: number,
      controls: any,
      mesh: THREE.Mesh,
      maxSpeed: number,
      baseTurnSpeed: number,
      maxTurnSpeed: number,
      turnSpeedIncreaseRate: number,
      maxTurnTilt: number
    ) => {
      let targetTurnTilt = 0;
      const desiredDirection = controls.left ? 1 : controls.right ? -1 : 0;
      Math.pow(speedRef.current / maxSpeed, 0.2);

      if (speedRef.current > 0 && desiredDirection !== 0) {
        if (currentTurnDirection.current !== 0 && currentTurnDirection.current !== desiredDirection) {
          currentTurnSpeed.current = Math.max(
            baseTurnSpeed,
            currentTurnSpeed.current - turnSpeedIncreaseRate * delta * 5
          );
          if (currentTurnSpeed.current <= baseTurnSpeed) {
            currentTurnSpeed.current = baseTurnSpeed;
            currentTurnDirection.current = 0;
          }
        } else {
          currentTurnDirection.current = desiredDirection;
          currentTurnSpeed.current = Math.min(maxTurnSpeed, currentTurnSpeed.current + turnSpeedIncreaseRate * delta);
          const rotationDelta = currentTurnSpeed.current * delta * desiredDirection;
          mesh.rotation.y += rotationDelta;
          targetTurnTilt = maxTurnTilt * (currentTurnSpeed.current / maxTurnSpeed) * desiredDirection;
        }
      } else {
        currentTurnSpeed.current = baseTurnSpeed;
        currentTurnDirection.current = 0;
      }

      return targetTurnTilt;
    };

    const applyTilt = (
      targetTurnTilt: number,
      delta: number,
      tiltSmoothness: number,
      player: THREE.Group | null = null
    ) => {
      currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
      if (player) {
        player.rotation.x = currentTilt.current.x / 4;
        player.rotation.z = currentTilt.current.z / 4;
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
      }

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

      updateSpeed(delta, maxSpeed, speedChangeRate, minSpeed, controls);

      const targetTurnTilt = updateTurning(
        delta,
        controls,
        mesh,
        maxSpeed,
        baseTurnSpeed,
        maxTurnSpeed,
        turnSpeedIncreaseRate,
        maxTurnTilt
      );

      mesh.rotation.x = currentTilt.current.x;
      mesh.rotation.z = currentTilt.current.z;

      applyTilt(targetTurnTilt, delta, tiltSmoothness, cycle?.playerRef?.current);

      direction.current.set(0, 0, -1);
      direction.current.applyQuaternion(mesh.quaternion);
      mesh.position.addScaledVector(direction.current, speedRef.current * delta);

      if (lightWallRef.current) {
        lightWallRef.current.update();
      }
    });

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
