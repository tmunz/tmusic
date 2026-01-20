import { createContext, useContext, useRef, ReactNode } from 'react';
import * as THREE from 'three';
import { useTronState } from '../state/TronContext';

export interface CollisionObject {
  id: string;
  position: THREE.Vector3;
  boundingBox: THREE.Box3;
  overallBoundingBox?: THREE.Box3;
  orientedCorners?: THREE.Vector3[];
  type: 'vehicle' | 'wall' | 'worldObject';
  onCollision?: (other: CollisionObject) => void;
  playerId?: string;
}

interface CollisionContextType {
  registerObject: (obj: CollisionObject) => void;
  unregisterObject: (id: string) => void;
  checkCollision: (obj: CollisionObject) => CollisionObject[];
  getAllObjects: () => CollisionObject[];
}

const CollisionContext = createContext<CollisionContextType | null>(null);

export const useCollision = () => {
  const context = useContext(CollisionContext);
  if (!context) {
    throw new Error('useCollision must be used within CollisionProvider');
  }
  return context;
};

export const CollisionProvider = ({ children }: { children: ReactNode }) => {
  const objectsRef = useRef<Map<string, CollisionObject>>(new Map());
  const spatialGridRef = useRef<Map<string, Set<string>>>(new Map());
  const gridSize = 10;

  const getGridCells = (bbox: THREE.Box3): string[] => {
    const cells: string[] = [];
    const minX = Math.floor(bbox.min.x / gridSize);
    const maxX = Math.floor(bbox.max.x / gridSize);
    const minZ = Math.floor(bbox.min.z / gridSize);
    const maxZ = Math.floor(bbox.max.z / gridSize);

    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        cells.push(`${x},${z}`);
      }
    }
    return cells;
  };

  const registerObject = (obj: CollisionObject) => {
    const existing = objectsRef.current.get(obj.id);
    if (existing) {
      const oldCells = getGridCells(existing.boundingBox);
      oldCells.forEach(cell => {
        const cellSet = spatialGridRef.current.get(cell);
        if (cellSet) {
          cellSet.delete(obj.id);
          if (cellSet.size === 0) {
            spatialGridRef.current.delete(cell);
          }
        }
      });
    }

    const cells = getGridCells(obj.boundingBox);
    cells.forEach(cell => {
      if (!spatialGridRef.current.has(cell)) {
        spatialGridRef.current.set(cell, new Set());
      }
      spatialGridRef.current.get(cell)!.add(obj.id);
    });

    objectsRef.current.set(obj.id, obj);
  };

  const unregisterObject = (id: string) => {
    const obj = objectsRef.current.get(id);
    if (obj) {
      const cells = getGridCells(obj.boundingBox);
      cells.forEach(cell => {
        const cellSet = spatialGridRef.current.get(cell);
        if (cellSet) {
          cellSet.delete(id);
          if (cellSet.size === 0) {
            spatialGridRef.current.delete(cell);
          }
        }
      });
    }
    objectsRef.current.delete(id);
  };

  const checkFineCollision = (obj: CollisionObject, other: CollisionObject): boolean => {
    if (!obj.orientedCorners || !other.orientedCorners) {
      return true;
    }
    const getObbAxes = (corners: THREE.Vector3[]): THREE.Vector3[] => [
      new THREE.Vector3().subVectors(corners[1], corners[0]).normalize(),
      new THREE.Vector3().subVectors(corners[2], corners[0]).normalize(),
      new THREE.Vector3().subVectors(corners[4], corners[0]).normalize(),
    ];
    const projectOntoAxis = (corners: THREE.Vector3[], axis: THREE.Vector3) => {
      let min = Infinity,
        max = -Infinity;
      for (const corner of corners) {
        const projection = corner.dot(axis);
        min = Math.min(min, projection);
        max = Math.max(max, projection);
      }
      return { min, max };
    };
    const testAxis = (axis: THREE.Vector3): boolean => {
      if (axis.lengthSq() < 0.0001) return true;
      const proj1 = projectOntoAxis(obj.orientedCorners!, axis);
      const proj2 = projectOntoAxis(other.orientedCorners!, axis);
      return !(proj1.max < proj2.min || proj2.max < proj1.min);
    };
    const axes1 = getObbAxes(obj.orientedCorners);
    const axes2 = getObbAxes(other.orientedCorners);
    for (const axis of [...axes1, ...axes2]) {
      if (!testAxis(axis)) return false;
    }
    for (const axis1 of axes1) {
      for (const axis2 of axes2) {
        const crossAxis = new THREE.Vector3().crossVectors(axis1, axis2);
        if (!testAxis(crossAxis)) return false;
      }
    }
    return true;
  };

  const checkCollision = (obj: CollisionObject): CollisionObject[] => {
    const collisions: CollisionObject[] = [];
    const cells = getGridCells(obj.boundingBox);
    const checkedIds = new Set<string>();

    cells.forEach(cell => {
      const cellObjects = spatialGridRef.current.get(cell);
      if (!cellObjects) return;

      cellObjects.forEach(otherId => {
        if (otherId === obj.id || checkedIds.has(otherId)) return;
        checkedIds.add(otherId);

        const other = objectsRef.current.get(otherId);
        if (!other) return;

        const objBroadBox = obj.overallBoundingBox || obj.boundingBox;
        const otherBroadBox = other.overallBoundingBox || other.boundingBox;

        if (objBroadBox.intersectsBox(otherBroadBox)) {
          if (obj.boundingBox.intersectsBox(other.boundingBox)) {
            const fineResult = checkFineCollision(obj, other);
            if (fineResult) {
              collisions.push(other);
            }
          }
        }
      });
    });

    return collisions;
  };

  const getAllObjects = (): CollisionObject[] => {
    return Array.from(objectsRef.current.values());
  };

  return (
    <CollisionContext.Provider value={{ registerObject, unregisterObject, checkCollision, getAllObjects }}>
      {children}
    </CollisionContext.Provider>
  );
};
