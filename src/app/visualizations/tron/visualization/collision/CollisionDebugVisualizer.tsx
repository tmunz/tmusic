import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useCollision } from './CollisionContext';

// Utility: get 12 box edges as [x1, y1, z1, x2, y2, z2, ...]
function getBoxEdges(min: THREE.Vector3, max: THREE.Vector3): number[] {
  return [
    // Bottom face
    min.x,
    min.y,
    min.z,
    max.x,
    min.y,
    min.z,
    max.x,
    min.y,
    min.z,
    max.x,
    min.y,
    max.z,
    max.x,
    min.y,
    max.z,
    min.x,
    min.y,
    max.z,
    min.x,
    min.y,
    max.z,
    min.x,
    min.y,
    min.z,
    // Top face
    min.x,
    max.y,
    min.z,
    max.x,
    max.y,
    min.z,
    max.x,
    max.y,
    min.z,
    max.x,
    max.y,
    max.z,
    max.x,
    max.y,
    max.z,
    min.x,
    max.y,
    max.z,
    min.x,
    max.y,
    max.z,
    min.x,
    max.y,
    min.z,
    // Vertical edges
    min.x,
    min.y,
    min.z,
    min.x,
    max.y,
    min.z,
    max.x,
    min.y,
    min.z,
    max.x,
    max.y,
    min.z,
    max.x,
    min.y,
    max.z,
    max.x,
    max.y,
    max.z,
    min.x,
    min.y,
    max.z,
    min.x,
    max.y,
    max.z,
  ];
}

export const CollisionDebugVisualizer = () => {
  const UPDATE_INTERVAL = 3;
  const frameSkipRef = useRef(0);

  const { getCellSize, _getAllCells, _getAllObjects } = useCollision();
  const cellLinesRef = useRef<THREE.LineSegments>(null);
  const aabbLinesRef = useRef<THREE.LineSegments>(null);
  const obbLinesRef = useRef<THREE.LineSegments>(null);

  const cellSize = getCellSize();

  useFrame(() => {
    frameSkipRef.current++;
    if (frameSkipRef.current % UPDATE_INTERVAL !== 0) return;

    const objects = _getAllObjects();
    const cells = _getAllCells();

    if (cellLinesRef.current) {
      const cellPositions: number[] = [];
      for (const cell of cells) {
        const min = new THREE.Vector3(
          cell.position.x - cellSize / 2 + 0.05,
          cell.position.y - 0.05,
          cell.position.z - cellSize / 2 + 0.05
        );
        const max = new THREE.Vector3(
          cell.position.x + cellSize / 2 - 0.05,
          cell.position.y + 0.05,
          cell.position.z + cellSize / 2 - 0.05
        );
        cellPositions.push(...getBoxEdges(min, max));
      }
      if (cellPositions.length > 0) {
        const geometry = cellLinesRef.current.geometry;
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!posAttr || posAttr.array.length !== cellPositions.length) {
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cellPositions), 3));
        } else {
          (posAttr.array as Float32Array).set(cellPositions);
          posAttr.needsUpdate = true;
        }
        cellLinesRef.current.visible = true;
      } else {
        cellLinesRef.current.visible = false;
      }
    }

    if (aabbLinesRef.current) {
      const aabbPositions: number[] = [];
      objects.forEach(obj => {
        aabbPositions.push(...getBoxEdges(obj.boundingBox.min, obj.boundingBox.max));
      });
      if (aabbPositions.length > 0) {
        const geometry = aabbLinesRef.current.geometry;
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!posAttr || posAttr.array.length !== aabbPositions.length) {
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(aabbPositions), 3));
        } else {
          (posAttr.array as Float32Array).set(aabbPositions);
          posAttr.needsUpdate = true;
        }
        aabbLinesRef.current.visible = true;
      } else {
        aabbLinesRef.current.visible = false;
      }
    }

    if (obbLinesRef.current) {
      const obbPositions: number[] = [];

      objects.forEach(obj => {
        if (obj.orientedCorners && obj.orientedCorners.length === 8) {
          const corners = obj.orientedCorners;

          // 12 edges connecting the 8 corners
          const edgeIndices = [
            // Bottom face
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0],
            // Top face
            [4, 5],
            [5, 7],
            [7, 6],
            [6, 4],
            // Vertical edges
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
          ];
          edgeIndices.forEach(([i, j]) => {
            obbPositions.push(corners[i].x, corners[i].y, corners[i].z, corners[j].x, corners[j].y, corners[j].z);
          });
        }
      });

      if (obbPositions.length > 0) {
        const geometry = obbLinesRef.current.geometry;
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!posAttr || posAttr.array.length !== obbPositions.length) {
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(obbPositions), 3));
        } else {
          (posAttr.array as Float32Array).set(obbPositions);
          posAttr.needsUpdate = true;
        }
        obbLinesRef.current.visible = true;
      } else {
        obbLinesRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <lineSegments ref={cellLinesRef} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#aaffaa" transparent opacity={0.3} />
      </lineSegments>
      <lineSegments ref={aabbLinesRef} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#00aa00" transparent opacity={0.5} />
      </lineSegments>
      <lineSegments ref={obbLinesRef} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#00ff00" transparent opacity={0.8} />
      </lineSegments>
    </>
  );
};
