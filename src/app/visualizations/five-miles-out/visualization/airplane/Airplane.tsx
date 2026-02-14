import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useReferenceObject } from '../../../../utils/ReferenceObjectContext';
import { Lockheed10 } from './Lockheed10';

export interface AirplaneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isReferenceObject?: boolean;
  speed?: number;
  landingGear?: boolean;
  locked?: boolean;
}

export const Airplane = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isReferenceObject,
  speed = 20,
  landingGear = false,
  locked = true,
}: AirplaneProps) => {
  const groupRef = useRef<Group>(null);
  const { referenceObjectRef } = useReferenceObject();
  const { pointer } = useThree();
  const targetRotation = useRef({ x: rotation[0], y: rotation[1], z: rotation[2] });

  useEffect(() => {
    if (isReferenceObject && referenceObjectRef && groupRef.current) {
      (referenceObjectRef as any).current = groupRef.current;
    }
  }, [referenceObjectRef, isReferenceObject]);

  useFrame((state, delta) => {
    if (!groupRef.current || speed === 0) return;

    if (!locked) {
      targetRotation.current.z = -pointer.x * 0.6; // Banking (roll)
      targetRotation.current.x = -pointer.y * 0.3; // Pitch
      targetRotation.current.y = -pointer.x * 0.2; // Yaw (turning)
    }

    groupRef.current.rotation.z += (targetRotation.current.z - groupRef.current.rotation.z) * delta * 4;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * delta * 4;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * delta * 3;

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(groupRef.current.quaternion);
    groupRef.current.position.addScaledVector(forward, speed * delta);
  });

  return (
    <group ref={groupRef} position={position}>
      <Lockheed10 speed={speed} landingGear={landingGear} />
    </group>
  );
};
