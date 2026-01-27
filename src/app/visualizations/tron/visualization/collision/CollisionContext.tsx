import { createContext, useContext, useRef, ReactNode, useEffect } from 'react';
import * as THREE from 'three';

export interface CollisionObject {
  id: string;
  position: THREE.Vector3;
  boundingBox: THREE.Box3;
  orientedCorners?: THREE.Vector3[];
  [key: string]: any;
}

interface CollisionContextType {
  registerObject: (obj: CollisionObject) => void;
  unregisterObject: (id: string) => void;
  checkCollision: (obj: CollisionObject) => CollisionObject[];
  getObjectById: (id: string) => CollisionObject | undefined;
  getCellSize: () => number;
  isCellOccupied: (x: number, z: number) => boolean;
  // for debugging, but do not use in production code
  _getAllObjects: () => CollisionObject[];
  _getAllCells: () => { cell: string; position: THREE.Vector3; occupied: boolean }[];
}

interface CollisionProviderProps {
  children: ReactNode;
  cellSize?: number;
}

const CollisionContext = createContext<CollisionContextType | null>(null);

export const useCollision = () => {
  const context = useContext(CollisionContext);
  if (!context) {
    throw new Error('useCollision must be used within CollisionProvider');
  }
  return context;
};

export const CollisionProvider = ({ children, cellSize = 1 }: CollisionProviderProps) => {
  const objectsRef = useRef<Map<string, CollisionObject>>(new Map());
  const cellsRef = useRef<Map<string, Set<CollisionObject>>>(new Map());

  useEffect(() => {
    return () => {
      objectsRef.current.clear();
      cellsRef.current.clear();
    };
  }, []);

  const getCells = (bbox: THREE.Box3): string[] => {
    const result: string[] = [];
    const minCellX = Math.floor(bbox.min.x / cellSize);
    const maxCellX = Math.floor(bbox.max.x / cellSize);
    const minCellZ = Math.floor(bbox.min.z / cellSize);
    const maxCellZ = Math.floor(bbox.max.z / cellSize);

    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
        result.push(`${cellX},${cellZ}`);
      }
    }

    return result;
  };

  const registerObject = (obj: CollisionObject) => {
    const existing = objectsRef.current.get(obj.id);
    if (existing) {
      const oldCells = getCells(existing.boundingBox);
      oldCells.forEach(cell => {
        const cellSet = cellsRef.current.get(cell);
        if (cellSet) {
          cellSet.delete(existing);
          if (cellSet.size === 0) {
            cellsRef.current.delete(cell);
          }
        }
      });
    }

    const cells = getCells(obj.boundingBox);
    cells.forEach(cell => {
      if (!cellsRef.current.has(cell)) {
        cellsRef.current.set(cell, new Set());
      }
      cellsRef.current.get(cell)!.add(obj);
    });

    objectsRef.current.set(obj.id, obj);
  };

  const unregisterObject = (id: string) => {
    const obj = objectsRef.current.get(id);
    if (obj) {
      const cells = getCells(obj.boundingBox);
      cells.forEach(cell => {
        const cellSet = cellsRef.current.get(cell);
        if (cellSet) {
          cellSet.delete(obj);
          if (cellSet.size === 0) {
            cellsRef.current.delete(cell);
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
    const cells = getCells(obj.boundingBox);
    const checked = new Set<CollisionObject>();

    cells.forEach(cell => {
      const cellSet = cellsRef.current.get(cell);
      if (!cellSet) return;

      cellSet.forEach(other => {
        if (other === obj || checked.has(other)) return;
        checked.add(other);

        if (obj.boundingBox.intersectsBox(other.boundingBox)) {
          const fineResult = checkFineCollision(obj, other);
          if (fineResult) {
            collisions.push(other);
          }
        }
      });
    });

    return collisions;
  };

  const getObjectById = (id: string): CollisionObject | undefined => {
    return objectsRef.current.get(id);
  };

  const _getAllObjects = (): CollisionObject[] => {
    return Array.from(objectsRef.current.values());
  };

  const _getAllCells = (): { cell: string; position: THREE.Vector3; occupied: boolean }[] => {
    const cells: { cell: string; position: THREE.Vector3; occupied: boolean }[] = [];

    cellsRef.current.forEach((objectIds, cellKey) => {
      const [cellX, cellZ] = cellKey.split(',').map(Number);
      const centerX = cellX * cellSize + cellSize / 2;
      const centerZ = cellZ * cellSize + cellSize / 2;

      cells.push({
        cell: cellKey,
        position: new THREE.Vector3(centerX, 0, centerZ),
        occupied: objectIds.size > 0,
      });
    });

    return cells;
  };

  const getCellSize = () => cellSize;

  const isCellOccupied = (x: number, z: number): boolean => {
    const cellKey = `${Math.floor(x / cellSize)},${Math.floor(z / cellSize)}`;
    const cellSet = cellsRef.current.get(cellKey);
    return !!cellSet && cellSet.size > 0;
  };

  return (
    <CollisionContext.Provider
      value={{
        registerObject,
        unregisterObject,
        checkCollision,
        getObjectById,
        getCellSize,
        isCellOccupied,
        _getAllObjects,
        _getAllCells,
      }}
    >
      {children}
    </CollisionContext.Provider>
  );
};
