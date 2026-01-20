import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RefObject, useEffect, useRef } from 'react';

interface FollowCameraProps {
  targetRef: RefObject<THREE.Object3D>;
  fov?: number;
  offset?: THREE.Vector3;
  lookAtOffset?: THREE.Vector3;
  stiffness?: number;
  drift?: number;
}

export const FollowCamera = ({
  targetRef,
  fov = 60,
  offset = new THREE.Vector3(0, 1, 5),
  lookAtOffset = new THREE.Vector3(0, 0.8, 0),
  stiffness = 1,
  drift = 0,
}: FollowCameraProps) => {
  const NORMALIZER = 25;

  const { camera } = useThree();
  const initialized = useRef(false);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const rotatedOffset = useRef(new THREE.Vector3());
  const driftTime = useRef(0);
  const driftOffset = useRef(new THREE.Vector3());

  const currentTargetPosition = useRef(new THREE.Vector3());
  const currentDriftOffset = useRef(new THREE.Vector3());
  const currentStiffness = useRef(stiffness);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  useFrame((state, delta) => {
    if (targetRef.current) {
      if (!initialized.current) {
        rotatedOffset.current.copy(offset);
        rotatedOffset.current.applyQuaternion(targetRef.current.quaternion);
        const initialPos = targetRef.current.position.clone().add(rotatedOffset.current);
        state.camera.position.copy(initialPos);
        currentTargetPosition.current.copy(initialPos);
        initialized.current = true;
      }

      driftTime.current += delta;
      driftOffset.current.x = Math.sin(driftTime.current * 0.5) * drift;
      driftOffset.current.y = Math.sin(driftTime.current * 0.3) * drift * 0.3;
      driftOffset.current.z = 0;
      currentDriftOffset.current.lerp(driftOffset.current, 2 * delta);

      currentStiffness.current += (stiffness - currentStiffness.current) * 2 * delta;
      rotatedOffset.current.copy(offset);
      rotatedOffset.current.applyQuaternion(targetRef.current.quaternion);
      targetPosition.current
        .copy(targetRef.current.position)
        .add(rotatedOffset.current)
        .add(currentDriftOffset.current);

      targetLookAt.current.copy(targetRef.current.position).add(lookAtOffset);

      state.camera.position.lerp(targetPosition.current, currentStiffness.current * NORMALIZER * delta);
      state.camera.lookAt(targetLookAt.current);
    }
  });

  return null;
};
