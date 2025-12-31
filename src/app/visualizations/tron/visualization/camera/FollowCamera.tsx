import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RefObject, useEffect, useRef } from 'react';

interface FollowCameraProps {
  targetRef: RefObject<THREE.Mesh>;
  fov?: number;
  drift?: number;
}

const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(0, 1, 5);

export const FollowCamera = ({ targetRef, fov = 60, drift = 0 }: FollowCameraProps) => {
  const { camera } = useThree();
  const currentRotation = useRef(0);
  const currentDrift = useRef(new THREE.Vector3());
  const targetDrift = useRef(new THREE.Vector3());
  const driftTime = useRef(0);

  const rotatedOffset = useRef(new THREE.Vector3());
  const yAxis = useRef(new THREE.Vector3(0, 1, 0));
  const xAxis = useRef(new THREE.Vector3(1, 0, 0));
  const lookAtTarget = useRef(new THREE.Vector3());
  const driftSmoothness = 2;

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

      // Update drift target based on sine/cosine for smooth left-right and up-down movement
      driftTime.current += delta;
      targetDrift.current.x = Math.sin(driftTime.current * 0.5) * drift;
      targetDrift.current.y = Math.sin(driftTime.current * 0.3) * drift * 0.3;
      targetDrift.current.z = 0;

      // Smoothly interpolate current drift to target drift
      currentDrift.current.lerp(targetDrift.current, driftSmoothness * delta);

      rotatedOffset.current.copy(DEFAULT_CAMERA_OFFSET);
      rotatedOffset.current.applyAxisAngle(yAxis.current, currentRotation.current);

      // Apply drift in camera-relative space
      const driftOffset = new THREE.Vector3();
      driftOffset.copy(xAxis.current).multiplyScalar(currentDrift.current.x);
      driftOffset.applyAxisAngle(yAxis.current, currentRotation.current);
      driftOffset.y += currentDrift.current.y;

      state.camera.position.x = targetRef.current.position.x + rotatedOffset.current.x + driftOffset.x;
      state.camera.position.y = targetRef.current.position.y + rotatedOffset.current.y + driftOffset.y;
      state.camera.position.z = targetRef.current.position.z + rotatedOffset.current.z + driftOffset.z;

      lookAtTarget.current.copy(targetRef.current.position);
      lookAtTarget.current.y += 0.8;

      state.camera.lookAt(lookAtTarget.current);
    }
  });

  return null;
};
