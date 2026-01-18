import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { Bit } from '../object/Bit';
import { WireframeTransitionObject } from '../object/WireframeTransitionObject';
import { useTronState } from '../state/TronContext';

interface CompanionProps { }

export const Companion = ({ }: CompanionProps) => {
  const { tronState, getUserCharacter, getUserPlayer } = useTronState();
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(0);
  const prevSpeedRef = useRef(0);
  const speedLagRef = useRef(0);
  const pulsePhaseRef = useRef(0);
  const smoothedVehiclePosRef = useRef(new Vector3());
  const prevVehiclePosRef = useRef(new Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;
    const userPlayer = getUserPlayer();
    const isOutside = userPlayer ? !userPlayer.insideBattleground : true;
    const userChar = getUserCharacter();
    if (!userChar) return;

    const speedChange = userChar.vehicle.speed.actual - prevSpeedRef.current;
    prevSpeedRef.current = userChar.vehicle.speed.actual;

    if (speedChange > 0) {
      speedLagRef.current = Math.min(speedLagRef.current + speedChange * 0.3, 1.5);
    }

    speedLagRef.current = Math.max(0, speedLagRef.current - delta * 1.5);

    const targetVehiclePos = new Vector3(
      userChar.position.x,
      userChar.position.y,
      userChar.position.z
    );

    if (prevVehiclePosRef.current.length() === 0) {
      smoothedVehiclePosRef.current.copy(targetVehiclePos);
      prevVehiclePosRef.current.copy(targetVehiclePos);
    }

    const smoothFactor = Math.min(1, delta * 15);
    smoothedVehiclePosRef.current.lerp(targetVehiclePos, smoothFactor);
    prevVehiclePosRef.current.copy(targetVehiclePos);

    const vehiclePos = smoothedVehiclePosRef.current;

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

      pulsePhaseRef.current += delta * 2.0;
      const pulseAmount = (Math.sin(pulsePhaseRef.current) * 0.5 + 0.5) * 2.5;

      const height = 1.2 + Math.sin(timeRef.current * 3) * 0.15;
      const sideOffset = Math.sin(timeRef.current * 2) * 0.2;

      groupRef.current.position.set(
        vehiclePos.x + toTargetWorld.x * pulseAmount + toTargetWorld.z * sideOffset - speedLagRef.current * 0.5,
        vehiclePos.y + height,
        vehiclePos.z + toTargetWorld.z * pulseAmount - toTargetWorld.x * sideOffset
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

      groupRef.current.position.set(
        vehiclePos.x + x,
        vehiclePos.y + y,
        vehiclePos.z + z
      );

      groupRef.current.rotation.y = angle + Math.PI / 2;
      groupRef.current.rotation.z = Math.sin(timeRef.current * 3) * 0.15;
    }
  });

  const userPlayer = getUserPlayer();

  return (
    <group ref={groupRef}>
      <WireframeTransitionObject>
        <Bit position={[0, 0, 0]} activated={userPlayer ? !userPlayer.insideBattleground : true} />
      </WireframeTransitionObject>
    </group>
  );
};
