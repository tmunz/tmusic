import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { Mesh } from 'three';

export const ObserverCamera = forwardRef<any, { targetRef: React.RefObject<Mesh> }>(({ targetRef }, ref) => {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current && targetRef.current) {
      controlsRef.current.target.copy(targetRef.current.position);
      controlsRef.current.update();
    }
  });

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} minDistance={3} maxDistance={50} />;
});
