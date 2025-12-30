import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { SampleProvider } from '../../../../audio/SampleProvider';

interface LightWallProps {
  getSpawnPoints: () => { lower: THREE.Vector3; upper: THREE.Vector3 } | null;
  color?: string;
  opacity?: number;
  maxPoints?: number;
  updateDistance?: number;
  thickness?: number;
  fadeSegments?: number;
  sampleProvider?: SampleProvider;
}

export interface LightWallHandle {
  update: () => void;
}

export const LightWall = forwardRef<LightWallHandle, LightWallProps>(
  (
    {
      getSpawnPoints,
      color = '#00ffff',
      opacity = 0.2,
      maxPoints = 1000,
      updateDistance = 0.1,
      thickness = 0.04,
      fadeSegments = 0,
      sampleProvider,
    },
    ref
  ) => {
    const trailPoints = useRef<{ lower: THREE.Vector3; upper: THREE.Vector3 }[]>([]);
    const lastTrailPosition = useRef(new THREE.Vector3());
    const trailGeometry = useRef<THREE.BufferGeometry>(null!);
    const positionAttribute = useRef<THREE.BufferAttribute>(null!);
    const colorAttribute = useRef<THREE.BufferAttribute>(null!);

    useEffect(() => {
      if (trailGeometry.current) {
        const maxVertices = maxPoints * 4;
        const positions = new Float32Array(maxVertices * 3);
        const colors = new Float32Array(maxVertices * 4);
        const indices: number[] = [];
        for (let i = 0; i < maxPoints - 1; i++) {
          const base = i * 4;
          const nextBase = (i + 1) * 4;
          indices.push(base, base + 1, nextBase + 1, base, nextBase + 1, nextBase);
          indices.push(base + 2, nextBase + 2, nextBase + 3, base + 2, nextBase + 3, base + 3);
          indices.push(base, nextBase, nextBase + 2, base, nextBase + 2, base + 2);
          indices.push(base + 1, base + 3, nextBase + 3, base + 1, nextBase + 3, nextBase + 1);
        }
        const attribute = new THREE.BufferAttribute(positions, 3);
        attribute.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.current.setAttribute('position', attribute);
        const colorAttr = new THREE.BufferAttribute(colors, 4);
        colorAttr.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.current.setAttribute('color', colorAttr);
        colorAttribute.current = colorAttr;
        trailGeometry.current.setIndex(indices);
        trailGeometry.current.setDrawRange(0, 0);
        positionAttribute.current = attribute;
        trailGeometry.current.computeBoundingSphere();
      }
    }, [maxPoints]);

    const updateWall = () => {
      const spawnPoints = getSpawnPoints();
      if (!spawnPoints || !positionAttribute.current) return;
      const { lower, upper } = spawnPoints;
      if (trailPoints.current.length === 0) {
        trailPoints.current.push({ lower: lower.clone(), upper: upper.clone() });
        lastTrailPosition.current.copy(lower);
      }
      if (lastTrailPosition.current.distanceTo(lower) > updateDistance) {
        trailPoints.current.push({ lower: lower.clone(), upper: upper.clone() });
        lastTrailPosition.current.copy(lower);
        if (trailPoints.current.length > maxPoints) {
          trailPoints.current.shift();
        }
      }
      if (trailPoints.current.length > 1) {
        const positions = positionAttribute.current.array as Float32Array;
        const colors = colorAttribute.current.array as Float32Array;
        const baseColor = new THREE.Color(color);
        for (let i = 0; i < trailPoints.current.length; i++) {
          const point = trailPoints.current[i];
          const baseIndex = i * 4 * 3;
          const colorIndex = i * 4 * 4;
          const segmentsFromEnd = trailPoints.current.length - 1 - i;
          const segmentsFromStart = i;
          const fadeInAlpha = segmentsFromEnd < fadeSegments ? (segmentsFromEnd / fadeSegments) * opacity : opacity;
          const fadeOutAlpha =
            segmentsFromStart < fadeSegments ? (segmentsFromStart / fadeSegments) * opacity : opacity;
          const alpha = Math.min(fadeInAlpha, fadeOutAlpha);
          let perpendicular = new THREE.Vector3();
          if (i < trailPoints.current.length - 1) {
            const next = trailPoints.current[i + 1];
            perpendicular.subVectors(next.lower, point.lower).normalize();
            perpendicular
              .cross(new THREE.Vector3(0, 1, 0))
              .normalize()
              .multiplyScalar(thickness / 2);
          } else if (i > 0) {
            const prev = trailPoints.current[i - 1];
            perpendicular.subVectors(point.lower, prev.lower).normalize();
            perpendicular
              .cross(new THREE.Vector3(0, 1, 0))
              .normalize()
              .multiplyScalar(thickness / 2);
          }

          // Vertex 0: Bottom-left (lower - perpendicular)
          positions[baseIndex] = point.lower.x - perpendicular.x;
          positions[baseIndex + 1] = point.lower.y;
          positions[baseIndex + 2] = point.lower.z - perpendicular.z;
          colors[colorIndex] = baseColor.r;
          colors[colorIndex + 1] = baseColor.g;
          colors[colorIndex + 2] = baseColor.b;
          colors[colorIndex + 3] = alpha;

          // Vertex 1: Bottom-right (lower + perpendicular)
          positions[baseIndex + 3] = point.lower.x + perpendicular.x;
          positions[baseIndex + 4] = point.lower.y;
          positions[baseIndex + 5] = point.lower.z + perpendicular.z;
          colors[colorIndex + 4] = baseColor.r;
          colors[colorIndex + 5] = baseColor.g;
          colors[colorIndex + 6] = baseColor.b;
          colors[colorIndex + 7] = alpha;

          // Vertex 2: Top-left (upper - perpendicular)
          positions[baseIndex + 6] = point.upper.x - perpendicular.x;
          positions[baseIndex + 7] = point.upper.y;
          positions[baseIndex + 8] = point.upper.z - perpendicular.z;
          colors[colorIndex + 8] = baseColor.r;
          colors[colorIndex + 9] = baseColor.g;
          colors[colorIndex + 10] = baseColor.b;
          colors[colorIndex + 11] = alpha;

          // Vertex 3: Top-right (upper + perpendicular)
          positions[baseIndex + 9] = point.upper.x + perpendicular.x;
          positions[baseIndex + 10] = point.upper.y;
          positions[baseIndex + 11] = point.upper.z + perpendicular.z;
          colors[colorIndex + 12] = baseColor.r;
          colors[colorIndex + 13] = baseColor.g;
          colors[colorIndex + 14] = baseColor.b;
          colors[colorIndex + 15] = alpha;
        }
        positionAttribute.current.needsUpdate = true;
        colorAttribute.current.needsUpdate = true;
        const numQuads = trailPoints.current.length - 1;
        trailGeometry.current.setDrawRange(0, numQuads * 24);
        trailGeometry.current.computeBoundingSphere();
      }
    };

    useImperativeHandle(ref, () => ({ update: updateWall }));

    return (
      <mesh>
        <bufferGeometry ref={trailGeometry} />
        <meshBasicMaterial vertexColors transparent side={THREE.DoubleSide} />
      </mesh>
    );
  }
);
