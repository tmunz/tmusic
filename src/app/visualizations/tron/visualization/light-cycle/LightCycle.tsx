import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLightCycleControls } from './LightCycleControls';

interface LightCycleProps {
}

export const LightCycle = forwardRef<THREE.Mesh, LightCycleProps>((props, ref) => {
  const internalRef = useRef<THREE.Mesh>(null);
  const cubeRef = (ref as React.RefObject<THREE.Mesh>) || internalRef;
  const speedRef = useRef(10);
  const minSpeed = 3;
  const maxSpeed = 20;
  const speedChangeRate = 5;
  const turnSpeed = 2;
  const maxTurnTilt = 0.3;
  const tiltSmoothness = 5;
  const currentTilt = useRef({ z: 0 });
  const getControlsState = useLightCycleControls();
  
  useFrame((state, delta) => {
    if (cubeRef.current) {
      const controls = getControlsState();
      
      if (controls.accelerate) {
        speedRef.current = Math.min(maxSpeed, speedRef.current + speedChangeRate * delta);
      }
      if (controls.decelerate) {
        speedRef.current = Math.max(minSpeed, speedRef.current - speedChangeRate * delta);
      }
      
      let targetTurnTilt = 0;
      const speedFactor = speedRef.current / maxSpeed;
      
      if (controls.left) {
        cubeRef.current.rotation.y += turnSpeed * delta;
        targetTurnTilt = maxTurnTilt * speedFactor;
      }
      if (controls.right) {
        cubeRef.current.rotation.y -= turnSpeed * delta;
        targetTurnTilt = -maxTurnTilt * speedFactor;
      }
      
      currentTilt.current.z += (targetTurnTilt - currentTilt.current.z) * tiltSmoothness * delta;
      
      cubeRef.current.rotation.z = currentTilt.current.z;

      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(cubeRef.current.quaternion);
      cubeRef.current.position.addScaledVector(direction, speedRef.current * delta);
    }
  });
  
  return (
    <mesh ref={cubeRef} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff" 
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
});
