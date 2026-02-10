import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useMemo } from 'react';
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three';

const vehiclesPath = require('./assets/tron_vehicles_3.glb');
const playerPath = require('./assets/sam_flynn.glb');

const useTronVehicleByIndex = (index: number, color?: string, offset: number = 0) => {
  const baseModel = useMemo(() => {
    const gltf = useGLTF(vehiclesPath) as GLTF;
    const sketchfabModel = gltf.scene.children[0];
    if (sketchfabModel && sketchfabModel.children.length > 0) {
      const fbxContainer = sketchfabModel.children[0];
      if (fbxContainer && fbxContainer.children.length > 0) {
        const rootNode = fbxContainer.children[0];
        if (rootNode.children && rootNode.children.length > index) {
          return rootNode.children[index];
        }
      }
    }
    return null;
  }, [index]);

  return useMemo(() => {
    if (!baseModel) return null;

    const vehicle = baseModel.clone(true);
    vehicle.traverse(child => {
      if (child instanceof Mesh && child.material) {
        child.material = child.material.clone();
      }
    });

    vehicle.position.set(0, -0.05, offset);
    vehicle.rotation.set(-Math.PI / 2, 0, Math.PI);
    vehicle.scale.set(1, 1, 1);

    if (color) {
      applyColorToModel(vehicle, color);
    }

    const container = new Group();
    container.add(vehicle);
    return container;
  }, [baseModel, color, offset]);
};

export const usePlayer = (color?: string) => {
  const baseModel = useMemo(() => {
    const gltf = useGLTF(playerPath) as GLTF;
    return gltf.scene;
  }, []);

  return useMemo(() => {
    const player = baseModel.clone(true);
    player.traverse(child => {
      if (child instanceof Mesh && child.material) {
        child.material = child.material.clone();
      }
    });
    player.position.set(0.0, -0.03, -0.91);
    player.rotation.set(0, Math.PI / 2, 0);
    player.scale.set(0.87, 0.87, 0.87);

    if (color) {
      applyColorToModel(player, color);
    }

    const container = new Group();
    container.add(player);
    return container;
  }, [baseModel, color]);
};

const applyColorToModel = (model: Object3D, color: string) => {
  model.traverse(child => {
    if (child instanceof Mesh && child.material) {
      const material = child.material as MeshStandardMaterial;
      const isEmissive =
        material.emissive && material.emissive.r > 0.9 && material.emissive.g > 0.9 && material.emissive.b > 0.9;
      if (isEmissive) {
        if (material.emissive) {
          material.emissive.set(color);
          material.emissiveIntensity = 2.0;
        }
      }
    }
  });
};

export const useLightCycleA = (color?: string) => useTronVehicleByIndex(0, color);
export const useLightCycleB = (color?: string) => useTronVehicleByIndex(1, color, -0.9);
export const useLimo = (color?: string) => useTronVehicleByIndex(2, color);
export const useSUV = (color?: string) => useTronVehicleByIndex(3, color);
export const useTruck = (color?: string) => useTronVehicleByIndex(4, color);

useGLTF.preload(playerPath);
useGLTF.preload(vehiclesPath);
