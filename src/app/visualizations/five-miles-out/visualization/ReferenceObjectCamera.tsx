import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useReferenceObject } from '../../../utils/ReferenceObjectContext';

export interface ReferenceObjectCameraProps {
  offset?: [number, number, number];
  targetOffset?: [number, number, number];
}

export const ReferenceObjectCamera = ({ offset = [0, 0, 1], targetOffset = [0, 0, 0] }: ReferenceObjectCameraProps) => {
  const { referenceObjectRef } = useReferenceObject();
  const { camera } = useThree();

  useFrame(() => {
    if (!referenceObjectRef.current) return;

    const worldPos = new Vector3();
    referenceObjectRef.current.getWorldPosition(worldPos);

    camera.position.x = worldPos.x + offset[0];
    camera.position.y = worldPos.y + offset[1];
    camera.position.z = worldPos.z + offset[2];
    camera.lookAt(worldPos.x + targetOffset[0], worldPos.y + targetOffset[1], worldPos.z + targetOffset[2]);
  });

  return null;
};
