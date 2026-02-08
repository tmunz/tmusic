import { useRef, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Vector3 } from 'three';

export interface AirplaneProps {
}

export const Airplane = forwardRef<Group, AirplaneProps>((props, ref) => {
  const groupRef = useRef<Group>(null);
  const model = (useGLTF(require('./assets/lockheed10.glb')) as any).scene;
  const { pointer, camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  if (ref && typeof ref !== 'function') {
    ref.current = groupRef.current;
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const forwardSpeed = 20;
    targetRotation.current.z = -pointer.x * 0.6;  // Banking (roll)
    targetRotation.current.x = -pointer.y * 0.3;  // Pitch
    targetRotation.current.y = -pointer.x * 0.2;  // Yaw (turning)

    groupRef.current.rotation.z += (targetRotation.current.z - groupRef.current.rotation.z) * delta * 4;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * delta * 4;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * delta * 3;

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(groupRef.current.quaternion);
    groupRef.current.position.addScaledVector(forward, forwardSpeed * delta);

    camera.position.x = groupRef.current.position.x + 4;
    camera.position.y = groupRef.current.position.y + 2;
    camera.position.z = groupRef.current.position.z + 20;
    camera.lookAt(groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={model} scale={0.3} rotation={[0, Math.PI, 0]} />
    </group>
  );
});
