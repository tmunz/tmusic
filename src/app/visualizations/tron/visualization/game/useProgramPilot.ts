import { RefObject, useRef } from 'react';
import { Vector3 } from 'three';
import { VehicleHandle } from '../object/vehicle/Vehicle';

interface ProgramPilotParams {
  characterId: string;
  characterRef: RefObject<VehicleHandle>;
}

export const useProgramPilot = ({ characterId, characterRef }: ProgramPilotParams) => {
  const targetPositionRef = useRef(new Vector3());

  return () => {
    const vehicle = characterRef.current?.getObject();
    if (!vehicle) return { position: null, speed: 0 };

    const movementCharacteristics = characterRef.current?.getParams();
    const currentSpeed = movementCharacteristics?.maxSpeed ?? 0;

    const lookAheadTime = 0.1;
    const targetDistance = currentSpeed * lookAheadTime;
    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(vehicle.quaternion);
    forward.normalize();
    const targetPosition = new Vector3(
      vehicle.position.x + forward.x * targetDistance,
      vehicle.position.y + forward.y * targetDistance,
      vehicle.position.z + forward.z * targetDistance
    );

    // console.log(`[${characterId}] Vehicle: (${vehicle.position.x.toFixed(1)}, ${vehicle.position.z.toFixed(1)}) -> Target: (${targetPosition.x.toFixed(1)}, ${targetPosition.z.toFixed(1)}), dist=${targetDistance.toFixed(1)}, delta=${delta.toFixed(4)}, speed=${currentSpeed}`);

    targetPositionRef.current.copy(targetPosition);

    return {
      position: targetPositionRef.current,
      speed: currentSpeed,
    };
  };
};
