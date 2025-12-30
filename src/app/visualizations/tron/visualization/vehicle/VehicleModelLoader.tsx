import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import * as THREE from 'three';
import { useMemo } from 'react';

interface Model extends GLTF {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
}

const vehiclesPath = require('./assets/tron_vehicles_3.glb');
const playerPath = require('./assets/sam_flynn.glb');

const useTronVehicleByIndex = (index: number) => {
  return useMemo(() => {
    const gltf = useGLTF(vehiclesPath) as Model;
    const sketchfabModel = gltf.scene.children[0];
    if (sketchfabModel && sketchfabModel.children.length > 0) {
      const fbxContainer = sketchfabModel.children[0];
      if (fbxContainer && fbxContainer.children.length > 0) {
        const rootNode = fbxContainer.children[0];
        if (rootNode.children && rootNode.children.length > index) {
          const vehicle = rootNode.children[index].clone();
          vehicle.position.set(0, 0, 0);
          vehicle.rotation.set(-Math.PI / 2, 0, Math.PI);
          vehicle.scale.set(1, 1, 1);
          return vehicle;
        }
      }
    }
    return null;
  }, [index]);
};

export const usePlayer = () => {
  return useMemo(() => {
    const gltf = useGLTF(playerPath) as Model;
    const player = gltf.scene.clone();
    player.position.set(0, 0.02, -0.01);
    player.rotation.set(0, Math.PI / 2, 0);
    player.scale.set(0.87, 0.87, 0.87);
    return player;
  }, []);
};
export const useLightCycleA = () => useTronVehicleByIndex(0);
export const useLightCycleB = () => useTronVehicleByIndex(1);
export const useLimo = () => useTronVehicleByIndex(2);
export const useSUV = () => useTronVehicleByIndex(3);
export const useTruck = () => useTronVehicleByIndex(4);

useGLTF.preload(playerPath);
useGLTF.preload(vehiclesPath);
