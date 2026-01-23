import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useCollision } from './CollisionContext';

export const CollisionDebugVisualizer = () => {
  const { _getAllObjects } = useCollision();
  const aabbLinesRef = useRef<THREE.LineSegments>(null);
  const obbLinesRef = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    const objects = _getAllObjects();

    if (aabbLinesRef.current) {
      const aabbPositions: number[] = [];

      objects.forEach(obj => {
        const min = obj.boundingBox.min;
        const max = obj.boundingBox.max;

        // 12 edges of the bounding box
        const edges = [
          // Bottom face
          [min.x, min.y, min.z, max.x, min.y, min.z],
          [max.x, min.y, min.z, max.x, min.y, max.z],
          [max.x, min.y, max.z, min.x, min.y, max.z],
          [min.x, min.y, max.z, min.x, min.y, min.z],
          // Top face
          [min.x, max.y, min.z, max.x, max.y, min.z],
          [max.x, max.y, min.z, max.x, max.y, max.z],
          [max.x, max.y, max.z, min.x, max.y, max.z],
          [min.x, max.y, max.z, min.x, max.y, min.z],
          // Vertical edges
          [min.x, min.y, min.z, min.x, max.y, min.z],
          [max.x, min.y, min.z, max.x, max.y, min.z],
          [max.x, min.y, max.z, max.x, max.y, max.z],
          [min.x, min.y, max.z, min.x, max.y, max.z],
        ];

        edges.forEach(edge => aabbPositions.push(...edge));
      });

      if (aabbPositions.length > 0) {
        const geometry = aabbLinesRef.current.geometry;
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;

        if (!posAttr || posAttr.array.length !== aabbPositions.length) {
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(aabbPositions), 3));
          geometry.attributes.position.needsUpdate = true;
        } else {
          posAttr.array.set(aabbPositions);
          posAttr.needsUpdate = true;
        }

        aabbLinesRef.current.visible = true;
      } else {
        aabbLinesRef.current.visible = false;
      }
    }

    // Update OBB visualization (red)
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
          geometry.attributes.position.needsUpdate = true;
        } else {
          posAttr.array.set(obbPositions);
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
      {/* AABB boxes in green */}
      <lineSegments ref={aabbLinesRef} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#00ff00" transparent opacity={0.5} />
      </lineSegments>

      {/* OBB boxes in red */}
      <lineSegments ref={obbLinesRef} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#ff0000" transparent opacity={0.8} />
      </lineSegments>
    </>
  );
};
