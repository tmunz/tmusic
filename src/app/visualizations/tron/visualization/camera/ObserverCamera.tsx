import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Object3D } from 'three';

export const ObserverCamera = forwardRef<any, { targetRef: React.RefObject<Object3D> }>(({ targetRef }, ref) => {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current && targetRef.current) {
      controlsRef.current.target.copy(targetRef.current.position);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={50}
      maxPolarAngle={Math.PI / 2 - 0.01}
    />
  );
});
