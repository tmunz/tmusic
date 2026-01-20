import { useRef, RefObject, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D, Vector3 } from 'three';
import { Bit } from '../object/Bit';
import { WireframeTransitionObject } from '../object/WireframeTransitionObject';
import { useTronState } from '../state/TronContext';

interface CompanionProps {
  vehicleRef: RefObject<Object3D>;
  maxAcceleration?: number;
  maxDeceleration?: number;
}

export const Companion = forwardRef<Object3D, CompanionProps>(
  ({ vehicleRef, maxAcceleration = 25.0, maxDeceleration = 35.0 }, ref) => {
    const { tronState, getUserCharacter, getUserPlayer } = useTronState();
    const groupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => groupRef.current!);

    const timeRef = useRef(0);
    const prevSpeedRef = useRef(0);
    const speedLagRef = useRef(0);
    const pulsePhaseRef = useRef(0);
    const smoothedVehiclePosRef = useRef(new Vector3());
    const prevVehiclePosRef = useRef(new Vector3());

    const currentPositionRef = useRef(new Vector3());
    const currentVelocityRef = useRef(new Vector3());
    const targetPositionRef = useRef(new Vector3());
    const initializedRef = useRef(false);

    useFrame((state, delta) => {
      if (!groupRef.current) return;

      timeRef.current += delta;
      const userPlayer = getUserPlayer();
      const isOutside = userPlayer ? !userPlayer.insideBattleground : true;
      const userCharacter = getUserCharacter();
      if (!userCharacter || !userCharacter.position) return;

      const speedChange = userCharacter.vehicle.speed.actual - prevSpeedRef.current;
      prevSpeedRef.current = userCharacter.vehicle.speed.actual;

      if (speedChange > 0) {
        speedLagRef.current = Math.min(speedLagRef.current + speedChange * 0.3, 1.5);
      }

      speedLagRef.current = Math.max(0, speedLagRef.current - delta * 1.5);

      const targetVehiclePos = new Vector3(
        userCharacter.position.x,
        userCharacter.position.y,
        userCharacter.position.z
      );

      if (prevVehiclePosRef.current.length() === 0) {
        smoothedVehiclePosRef.current.copy(targetVehiclePos);
        prevVehiclePosRef.current.copy(targetVehiclePos);
      }

      const smoothFactor = Math.min(1, delta * 15);
      smoothedVehiclePosRef.current.lerp(targetVehiclePos, smoothFactor);
      prevVehiclePosRef.current.copy(targetVehiclePos);

      const vehiclePos = smoothedVehiclePosRef.current;

      // STAGE 1: Calculate target position based on mode
      if (isOutside && tronState.game.position) {
        const battlefieldPosition = new Vector3(
          tronState.game.position.x,
          tronState.game.position.y,
          tronState.game.position.z
        );

        const toTargetWorld = new Vector3(
          battlefieldPosition.x - vehiclePos.x,
          0,
          battlefieldPosition.z - vehiclePos.z
        );
        toTargetWorld.normalize();

        const vehicleRotation = vehicleRef.current?.rotation.y ?? 0;
        const vehicleForward = new Vector3(-Math.sin(vehicleRotation), 0, Math.cos(vehicleRotation));

        pulsePhaseRef.current += delta * 2.0;
        const oscillation = Math.sin(pulsePhaseRef.current) * 0.5 + 0.5; // 0 to 1, stays forward

        const frontOffset = 2.5;
        const baseX = vehiclePos.x + vehicleForward.x * frontOffset;
        const baseZ = vehiclePos.z + vehicleForward.z * frontOffset;

        // Direction offset toward battle grid (only moves forward from base)
        const oscillationAmount = 2.0; // How far it moves toward grid
        const targetX = baseX + toTargetWorld.x * oscillationAmount * oscillation;
        const targetZ = baseZ + toTargetWorld.z * oscillationAmount * oscillation;

        const height = 1.2 + Math.sin(timeRef.current * 3) * 0.15;
        const sideOffset = Math.sin(timeRef.current * 2) * 0.2;

        targetPositionRef.current.set(
          targetX + toTargetWorld.z * sideOffset,
          vehiclePos.y + height,
          targetZ - toTargetWorld.x * sideOffset
        );

        groupRef.current.rotation.y = Math.sin(timeRef.current * 1.5) * 0.3;
        groupRef.current.rotation.x = Math.cos(timeRef.current * 2) * 0.1;
      } else {
        const orbitRadius = 0.8 + speedLagRef.current * 0.3;
        const orbitSpeed = 1.5;
        const height = 1.0 + Math.sin(timeRef.current * 2.5) * 0.3;

        const angle = timeRef.current * orbitSpeed;
        const x = Math.cos(angle) * orbitRadius - speedLagRef.current * 0.5;
        const z = Math.sin(angle) * orbitRadius * 0.6;
        const y = height + Math.sin(angle * 2) * 0.15;

        targetPositionRef.current.set(vehiclePos.x + x, vehiclePos.y + y, vehiclePos.z + z);

        groupRef.current.rotation.y = angle + Math.PI / 2;
        groupRef.current.rotation.z = Math.sin(timeRef.current * 3) * 0.15;
      }

      if (!initializedRef.current) {
        currentPositionRef.current.copy(targetPositionRef.current);
        initializedRef.current = true;
      }
      const toTarget = new Vector3().subVectors(targetPositionRef.current, currentPositionRef.current);
      const distance = toTarget.length();

      if (distance > 0.001) {
        const direction = toTarget.clone().normalize();
        const currentSpeed = currentVelocityRef.current.length();

        const effectiveAcceleration = isOutside ? maxAcceleration * 3 : maxAcceleration;
        const effectiveDeceleration = isOutside ? maxDeceleration * 3 : maxDeceleration;

        const stoppingDistance = (currentSpeed * currentSpeed) / (2 * effectiveDeceleration);

        const shouldDecelerate = stoppingDistance >= distance;

        if (shouldDecelerate) {
          const newSpeed = Math.max(0, currentSpeed - effectiveDeceleration * delta);
          currentVelocityRef.current.copy(direction).multiplyScalar(newSpeed);
        } else {
          const newSpeed = currentSpeed + effectiveAcceleration * delta;
          currentVelocityRef.current.copy(direction).multiplyScalar(newSpeed);
        }

        const movement = currentVelocityRef.current.clone().multiplyScalar(delta);
        currentPositionRef.current.add(movement);

        if (currentPositionRef.current.distanceTo(targetPositionRef.current) < 0.01) {
          currentPositionRef.current.copy(targetPositionRef.current);
          currentVelocityRef.current.set(0, 0, 0);
        }
      } else {
        currentVelocityRef.current.set(0, 0, 0);
      }

      groupRef.current.position.copy(currentPositionRef.current);
    });

    const userPlayer = getUserPlayer();

    return (
      <group ref={groupRef}>
        <WireframeTransitionObject autoStart>
          <Bit position={[0, 0, 0]} activated={userPlayer ? !userPlayer.insideBattleground : true} />
        </WireframeTransitionObject>
      </group>
    );
  }
);
