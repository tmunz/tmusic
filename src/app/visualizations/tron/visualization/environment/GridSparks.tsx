import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Spark {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  lifetime: number;
  maxLifetime: number;
  axis: 'x' | 'z';
  linePosition: number;
  lastIntersection: { x: number; z: number };
}

interface GridSparksProps {
  gridSize: number;
  gridPosition: [number, number, number];
  count?: number;
  color?: string;
  speed?: number;
  cellSize?: number;
  turnProbability?: number;
}

export const GridSparks = ({
  gridSize,
  gridPosition,
  count = 20,
  color = '#ffffff',
  speed = 0.5,
  cellSize = 1,
  turnProbability = 0.15,
}: GridSparksProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const halfSize = gridSize / 2;
  const sparkColor = useMemo(() => new THREE.Color(color), [color]);

  const sparks = useMemo<Spark[]>(() => {
    const sparksArray: Spark[] = [];
    const numLines = Math.floor(gridSize / cellSize) + 1;

    for (let i = 0; i < count; i++) {
      const axis = Math.random() > 0.5 ? 'x' : 'z';
      const lineIndex = Math.floor(Math.random() * numLines);
      const linePosition = lineIndex * cellSize - halfSize;

      const startLineIndex = Math.floor(Math.random() * numLines);
      const startPos = startLineIndex * cellSize - halfSize;
      const direction = Math.random() > 0.5 ? 1 : -1;

      sparksArray.push({
        position: new THREE.Vector3(axis === 'x' ? startPos : linePosition, 0, axis === 'z' ? startPos : linePosition),
        direction: new THREE.Vector3(axis === 'x' ? direction : 0, 0, axis === 'z' ? direction : 0),
        speed: speed * (0.5 + Math.random() * 1.5),
        lifetime: Math.random() * 100,
        maxLifetime: 100 + Math.random() * 50,
        axis,
        linePosition,
        lastIntersection: {
          x: axis === 'x' ? startPos : linePosition,
          z: axis === 'z' ? startPos : linePosition,
        },
      });
    }
    return sparksArray;
  }, [count, gridSize, halfSize, speed, cellSize]);

  useFrame((state, delta) => {
    // TODO: eventually optimize by using a shader
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position;
    const colors = pointsRef.current.geometry.attributes.color;
    const sizes = pointsRef.current.geometry.attributes.sparkSize;

    sparks.forEach((spark, i) => {
      const prevMovingCoord = spark.axis === 'x' ? spark.position.x : spark.position.z;

      spark.position.addScaledVector(spark.direction, spark.speed * delta * 60);

      const movingCoord = spark.axis === 'x' ? spark.position.x : spark.position.z;

      const prevSectionIndex = Math.floor((prevMovingCoord + halfSize) / cellSize);
      const currentSectionIndex = Math.floor((movingCoord + halfSize) / cellSize);
      const crossedSectionLine = prevSectionIndex !== currentSectionIndex;

      const lineOffsetRemainder = Math.abs((spark.linePosition + halfSize) % cellSize);
      const isLineAtSection = lineOffsetRemainder < 0.1 || lineOffsetRemainder > cellSize - 0.1;

      if (crossedSectionLine && isLineAtSection && Math.random() < turnProbability) {
        const intersectionIndex = movingCoord > prevMovingCoord ? currentSectionIndex : prevSectionIndex + 1;
        const intersectionCoord = intersectionIndex * cellSize - halfSize;

        if (spark.axis === 'x') {
          spark.position.x = intersectionCoord;
        } else {
          spark.position.z = intersectionCoord;
        }

        spark.axis = spark.axis === 'x' ? 'z' : 'x';
        const newDirection = Math.random() > 0.5 ? 1 : -1;

        if (spark.axis === 'x') {
          spark.direction.set(newDirection, 0, 0);
          spark.linePosition = spark.position.z;
        } else {
          spark.direction.set(0, 0, newDirection);
          spark.linePosition = spark.position.x;
        }
      }

      if (Math.abs(movingCoord) > halfSize) {
        const newStart = -Math.sign(movingCoord) * halfSize;
        if (spark.axis === 'x') {
          spark.position.x = newStart;
        } else {
          spark.position.z = newStart;
        }
        spark.lifetime = 0;

        if (Math.random() > 0.7) {
          const numLines = Math.floor(gridSize / cellSize) + 1;
          const lineIndex = Math.floor(Math.random() * numLines);
          spark.linePosition = lineIndex * cellSize - halfSize;
          if (spark.axis === 'x') {
            spark.position.z = spark.linePosition;
          } else {
            spark.position.x = spark.linePosition;
          }
        }
      }

      spark.lifetime = (spark.lifetime + delta * 60) % spark.maxLifetime;

      const lifetimeProgress = Math.min(spark.lifetime / spark.maxLifetime, 1);
      const fadeFactor =
        lifetimeProgress < 0.2 ? lifetimeProgress / 0.2 : lifetimeProgress > 0.8 ? (1 - lifetimeProgress) / 0.2 : 1;

      const xPos = spark.axis === 'x' ? spark.position.x : spark.linePosition;
      const zPos = spark.axis === 'z' ? spark.position.z : spark.linePosition;

      positions.setXYZ(i, xPos, 0.03, zPos);

      const twinkle = Math.pow(0.5 + 0.5 * Math.sin(state.clock.elapsedTime * (18 + (i % 5) * 3) + i * 2.4), 10);
      const flash = crossedSectionLine ? 1 : twinkle;
      const brightness = (3 + flash * 8) * fadeFactor;
      const white = flash * 0.7;
      colors.setXYZ(
        i,
        (sparkColor.r + (1 - sparkColor.r) * white) * brightness,
        (sparkColor.g + (1 - sparkColor.g) * white) * brightness,
        (sparkColor.b + (1 - sparkColor.b) * white) * brightness
      );
      sizes.setX(i, 0.65 + fadeFactor * 0.5 + flash * 0.9);
    });

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    sizes.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      sizes[i] = 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('sparkSize', new THREE.BufferAttribute(sizes, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Math.SQRT2 * halfSize + 1);

    return geo;
  }, [count, halfSize]);

  const material = useMemo(() => {
    const sparkMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: createSparkTexture(),
      depthWrite: false,
    });
    sparkMaterial.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float sparkSize;')
        .replace('gl_PointSize = size;', 'gl_PointSize = size * sparkSize;');
    };
    sparkMaterial.customProgramCacheKey = () => 'tron-twinkling-sparks';
    return sparkMaterial;
  }, []);

  return <points ref={pointsRef} position={gridPosition} geometry={geometry} material={material} />;
};

let sharedSparkTexture: THREE.Texture | undefined;

function createSparkTexture() {
  if (sharedSparkTexture) return sharedSparkTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    // Fine electric rays around the bright core, reused by every grid tile.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(8, 32);
    ctx.lineTo(56, 32);
    ctx.moveTo(32, 8);
    ctx.lineTo(32, 56);
    ctx.stroke();
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  sharedSparkTexture = texture;
  return texture;
}
