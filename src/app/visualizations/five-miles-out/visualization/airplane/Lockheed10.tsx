import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D } from 'three';
import { GLTF } from 'three-stdlib';

export interface Lockheed10Props {
  scale?: number;
  rotation?: [number, number, number];
  speed?: number;
  landingGear?: boolean;
}

export const Lockheed10 = ({ scale = 1, rotation = [0, 0, 0], speed = 20, landingGear = false }: Lockheed10Props) => {
  const LANDING_GEAR_ROTATION_SPEED = 1.0;
  const LANDING_GEAR_RETRACTED_ROTATION = 1.4;

  const model = useMemo(() => (useGLTF(require('./assets/lockheed10.glb')) as GLTF).scene, []);
  const propellersRef = useRef<Object3D[]>([]);
  const landingGearRef = useRef<Object3D[]>([]);
  const currentLandingGearRotation = useRef<number>(LANDING_GEAR_RETRACTED_ROTATION);

  useEffect(() => {
    if (!model) return;
    const propellers: Object3D[] = [];
    const landingGear: Object3D[] = [];
    model.traverse(child => {
      if (child.name.toLowerCase().includes('propeller')) {
        propellers.push(child);
      }
      if (child.name.toLowerCase().includes('landing-gear')) {
        landingGear.push(child);
      }
    });
    propellersRef.current = propellers;
    landingGearRef.current = landingGear;
  }, [model]);

  useFrame((state, delta) => {
    const rotationSpeed = speed * 50;
    propellersRef.current.forEach(propeller => {
      propeller.rotation.z += rotationSpeed * delta;
    });

    const targetRotation = landingGear ? 0 : LANDING_GEAR_RETRACTED_ROTATION;
    currentLandingGearRotation.current +=
      (targetRotation - currentLandingGearRotation.current) * LANDING_GEAR_ROTATION_SPEED * delta;

    landingGearRef.current.forEach(gear => {
      gear.rotation.x = currentLandingGearRotation.current;
    });
  });

  return <primitive object={model} scale={scale * 0.3} rotation={[rotation[0], rotation[1] + Math.PI, rotation[2]]} />;
};
