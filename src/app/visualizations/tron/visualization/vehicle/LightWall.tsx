import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../../audio/useSampleProviderTexture';
import { useLightWallSoundMaterial } from './LightWallSoundMaterial';

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
      color = '#66EEFF',
      opacity = 0.4,
      maxPoints = 1000,
      updateDistance = 0.1,
      thickness = 0.03,
      fadeSegments = 1,
      sampleProvider,
    },
    ref
  ) => {
    const trailPoints = useRef<{ lower: THREE.Vector3; upper: THREE.Vector3 }[]>([]);
    const lastTrailPosition = useRef(new THREE.Vector3());
    const trailGeometry = useRef<THREE.BufferGeometry>(null!);
    const positionAttribute = useRef<THREE.BufferAttribute>(null!);
    const colorAttribute = useRef<THREE.BufferAttribute>(null!);

    const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

    const material = useLightWallSoundMaterial({
      sampleTexture,
      updateSampleTexture,
      color,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const [topFrequencyTexture, updateTopFrequencyTexture] = useSampleProviderTexture(
      sampleProvider,
      sp => {
        if (!sp) return new Uint8Array();
        const sampleSize = sp.sampleSize;
        const topFreqData = new Uint8Array(sampleSize);
        const sourceData = sp.flat();
        const frequencyBands = sp.frequencyBands;
        for (let sample = 0; sample < sampleSize; sample++) {
          topFreqData[sample] = sourceData[sample * frequencyBands + (frequencyBands - 1)];
        }
        return topFreqData;
      },
      () => 1,
      sp => sp?.sampleSize ?? 0
    );

    const topMaterial = useLightWallSoundMaterial({
      sampleTexture: topFrequencyTexture,
      updateSampleTexture: updateTopFrequencyTexture,
      color,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const [bottomFrequencyTexture, updateBottomFrequencyTexture] = useSampleProviderTexture(
      sampleProvider,
      sp => {
        if (!sp) return new Uint8Array();
        const sampleSize = sp.sampleSize;
        const bottomFreqData = new Uint8Array(sampleSize);
        const sourceData = sp.flat();
        const frequencyBands = sp.frequencyBands;
        for (let sample = 0; sample < sampleSize; sample++) {
          bottomFreqData[sample] = sourceData[sample * frequencyBands];
        }
        return bottomFreqData;
      },
      () => 1,
      sp => sp?.sampleSize ?? 0
    );

    const bottomMaterial = useLightWallSoundMaterial({
      sampleTexture: bottomFrequencyTexture,
      updateSampleTexture: updateBottomFrequencyTexture,
      color,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    useEffect(() => {
      if (trailGeometry.current) {
        const maxVertices = maxPoints * 4;
        const positions = new Float32Array(maxVertices * 3);
        const colors = new Float32Array(maxVertices * 4);
        const uvs = new Float32Array(maxVertices * 2);
        const indices: number[] = [];
        // Add start cap (first two vertices: lower0, upper0, upper1, lower1)
        indices.push(0, 1, 3, 0, 3, 2);
        for (let i = 0; i < maxPoints - 1; i++) {
          const base = i * 4;
          const nextBase = (i + 1) * 4;
          // Left face
          indices.push(base, nextBase + 2, nextBase, base, base + 2, nextBase + 2);
          // Top face
          indices.push(base + 2, base + 3, nextBase + 3, base + 2, nextBase + 3, nextBase + 2);
          // Right face
          indices.push(base + 1, nextBase + 3, base + 3, base + 1, nextBase + 1, nextBase + 3);
          // Bottom face
          indices.push(base, base + 1, nextBase + 1, base, nextBase + 1, nextBase);
          // Separator face
          indices.push(nextBase, nextBase + 2, nextBase + 3, nextBase, nextBase + 3, nextBase + 1);
        }
        const attribute = new THREE.BufferAttribute(positions, 3);
        attribute.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.current.setAttribute('position', attribute);
        const colorAttr = new THREE.BufferAttribute(colors, 4);
        colorAttr.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.current.setAttribute('color', colorAttr);
        colorAttribute.current = colorAttr;
        const uvAttr = new THREE.BufferAttribute(uvs, 2);
        uvAttr.setUsage(THREE.DynamicDrawUsage);
        trailGeometry.current.setAttribute('uv', uvAttr);
        trailGeometry.current.setIndex(indices);
        trailGeometry.current.setDrawRange(0, 0);
        positionAttribute.current = attribute;
        trailGeometry.current.computeVertexNormals();
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
        const uvs = (trailGeometry.current.getAttribute('uv') as THREE.BufferAttribute).array as Float32Array;
        const baseColor = new THREE.Color(color);
        for (let i = 0; i < trailPoints.current.length; i++) {
          const point = trailPoints.current[i];
          const baseIndex = i * 4 * 3;
          const colorIndex = i * 4 * 4;
          const uvIndex = i * 4 * 2;
          const u = 1.0 - i / Math.max(1, trailPoints.current.length - 1);

          const segmentsFromEnd = trailPoints.current.length - 1 - i;
          const segmentsFromStart = i;
          let alpha = opacity;
          if (fadeSegments > 0) {
            const fadeInAlpha = segmentsFromEnd < fadeSegments ? (segmentsFromEnd / fadeSegments) * opacity : opacity;
            const fadeOutAlpha =
              segmentsFromStart < fadeSegments ? (segmentsFromStart / fadeSegments) * opacity : opacity;
            alpha = Math.min(fadeInAlpha, fadeOutAlpha);
          }
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
          uvs[uvIndex] = u;
          uvs[uvIndex + 1] = 0.0;

          // Vertex 1: Bottom-right (lower + perpendicular)
          positions[baseIndex + 3] = point.lower.x + perpendicular.x;
          positions[baseIndex + 4] = point.lower.y;
          positions[baseIndex + 5] = point.lower.z + perpendicular.z;
          colors[colorIndex + 4] = baseColor.r;
          colors[colorIndex + 5] = baseColor.g;
          colors[colorIndex + 6] = baseColor.b;
          colors[colorIndex + 7] = alpha;
          uvs[uvIndex + 2] = u;
          uvs[uvIndex + 3] = 0.0;

          // Vertex 2: Top-left (upper - perpendicular)
          positions[baseIndex + 6] = point.upper.x - perpendicular.x;
          positions[baseIndex + 7] = point.upper.y;
          positions[baseIndex + 8] = point.upper.z - perpendicular.z;
          colors[colorIndex + 8] = baseColor.r;
          colors[colorIndex + 9] = baseColor.g;
          colors[colorIndex + 10] = baseColor.b;
          colors[colorIndex + 11] = alpha;
          uvs[uvIndex + 4] = u;
          uvs[uvIndex + 5] = 1.0; // Full frequency range for vertical faces

          // Vertex 3: Top-right (upper + perpendicular)
          positions[baseIndex + 9] = point.upper.x + perpendicular.x;
          positions[baseIndex + 10] = point.upper.y;
          positions[baseIndex + 11] = point.upper.z + perpendicular.z;
          colors[colorIndex + 12] = baseColor.r;
          colors[colorIndex + 13] = baseColor.g;
          colors[colorIndex + 14] = baseColor.b;
          colors[colorIndex + 15] = alpha;
          uvs[uvIndex + 6] = u;
          uvs[uvIndex + 7] = 1.0;
        }
        positionAttribute.current.needsUpdate = true;
        colorAttribute.current.needsUpdate = true;
        (trailGeometry.current.getAttribute('uv') as THREE.BufferAttribute).needsUpdate = true;
        const numQuads = trailPoints.current.length - 1;

        trailGeometry.current.clearGroups();
        trailGeometry.current.addGroup(0, 6, 3);
        for (let i = 0; i < numQuads; i++) {
          const segmentStart = 6 + i * 30; // 6 for start cap, then 5 faces * 6 indices each
          trailGeometry.current.addGroup(segmentStart, 6, 0); // Left face
          trailGeometry.current.addGroup(segmentStart + 6, 6, 1); // Top face
          trailGeometry.current.addGroup(segmentStart + 12, 6, 0); // Right face
          trailGeometry.current.addGroup(segmentStart + 18, 6, 2); // Bottom face
          trailGeometry.current.addGroup(segmentStart + 24, 6, 3); // Separator face (back)
        }

        trailGeometry.current.setDrawRange(0, 6 + numQuads * 30);
        trailGeometry.current.computeVertexNormals();
        trailGeometry.current.computeBoundingSphere();
      } else {
        trailGeometry.current.setDrawRange(0, 0);
      }
    };

    useImperativeHandle(ref, () => ({ update: updateWall }));

    return (
      <>
        <mesh renderOrder={10}>
          <bufferGeometry ref={trailGeometry} />
          <primitive object={material} attach="material-0" />
          <primitive object={topMaterial} attach="material-1" />
          <primitive object={bottomMaterial} attach="material-2" />
        </mesh>
      </>
    );
  }
);
