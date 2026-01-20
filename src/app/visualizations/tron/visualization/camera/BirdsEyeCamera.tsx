import { useFrame, useThree } from '@react-three/fiber';
import { RefObject, useEffect } from 'react';
import { Object3D } from 'three';

interface BirdsEyeCameraProps {
  targetRef: RefObject<Object3D>;
  height?: number;
}

export const BirdsEyeCamera = ({ targetRef, height = 30 }: BirdsEyeCameraProps) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, height, 0);
    camera.lookAt(0, 0, 0);
  }, [camera, height]);

  useFrame(() => {
    if (targetRef?.current) {
      const targetPosition = targetRef.current.position;
      camera.position.x = targetPosition.x;
      camera.position.y = targetPosition.y + height;
      camera.position.z = targetPosition.z;
      camera.lookAt(targetPosition);
    }
  });

  return null;
};
