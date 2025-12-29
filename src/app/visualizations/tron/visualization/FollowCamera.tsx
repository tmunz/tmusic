import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RefObject, useEffect, useRef } from 'react';

interface FollowCameraProps {
  targetRef: RefObject<THREE.Mesh>;
  fov?: number;
}

const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(0, 1, 5);

export const FollowCamera = ({ targetRef, fov = 60 }: FollowCameraProps) => {
  const { camera } = useThree();
  const currentRotation = useRef(0);
  
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);
  
  useFrame((state, delta) => {
    if (targetRef.current) {
      const targetRotation = targetRef.current.rotation.y;
      const rotationDiff = targetRotation - currentRotation.current;
      const smoothFactor = 5;
      
      currentRotation.current += rotationDiff * smoothFactor * delta;
      
      const rotatedOffset = DEFAULT_CAMERA_OFFSET.clone();
      rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), currentRotation.current);
      
      state.camera.position.x = targetRef.current.position.x + rotatedOffset.x;
      state.camera.position.y = targetRef.current.position.y + rotatedOffset.y;
      state.camera.position.z = targetRef.current.position.z + rotatedOffset.z;
      
      state.camera.lookAt(targetRef.current.position);
    }
  });
  
  return null;
};
