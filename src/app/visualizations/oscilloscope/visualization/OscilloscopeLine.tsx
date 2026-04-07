import { useEffect, useRef } from "react";
import { Channel, SampleProvider } from "../../../sampleProvider/SampleProvider";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DataTexture, FloatType, RGBAFormat, ShaderMaterial, Mesh, DoubleSide, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { LanczosFilter } from "./LanczosFilter";

const vertexShader = `
#define EPS 1E-6

uniform float invert;
uniform float size;
uniform float nEdges;
uniform float fadeAmount;
uniform float intensity;
uniform float gain;

attribute vec2 aStart;
attribute vec2 aEnd;
attribute float aIdx;

varying vec4 uvl;
varying vec2 vTexCoord;
varying float vSize;

void main () {
  float tang;
  vec2 current;
  
  float idx = mod(aIdx, 4.0);

  vec2 dir = (aEnd - aStart) * gain;
  uvl.z = length(dir);

  if (uvl.z > EPS) {
    dir = dir / uvl.z;
    vSize = 0.006 / pow(uvl.z, 0.08);
  } else {
    dir = vec2(1.0, 0.0);
    vSize = 0.006 / pow(EPS, 0.08);
  }

  vSize = size;
  vec2 norm = vec2(-dir.y, dir.x);

  if (idx >= 2.0) {
    current = aEnd * gain;
    tang = 1.0;
    uvl.x = -vSize;
  } else {
    current = aStart * gain;
    tang = -1.0;
    uvl.x = uvl.z + vSize;
  }
  
  float side = (mod(idx, 2.0) - 0.5) * 2.0;
  uvl.y = side * vSize;

  uvl.w = intensity * mix(1.0 - fadeAmount, 1.0, floor(aIdx / 4.0 + 0.5) / nEdges);

  vec4 pos = vec4((current + (tang * dir + norm * side) * vSize) * invert, 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * pos;
  vTexCoord = 0.5 * pos.xy + 0.5;
}
`;

const fragmentShader = `
#define EPS 1E-6
#define TAU 6.283185307179586
#define TAUR 2.5066282746310002
#define SQRT2 1.4142135623730951

precision highp float;

uniform float size;
uniform float intensity;
uniform sampler2D screen;
uniform vec3 color;

varying float vSize;
varying vec4 uvl;
varying vec2 vTexCoord;

float gaussian(float x, float sigma) {
  return exp(-(x * x) / (2.0 * sigma * sigma)) / (TAUR * sigma);
}

float erf(float x) {
  float s = sign(x), a = abs(x);
  x = 1.0 + (0.278393 + (0.230389 + 0.078108 * (a * a)) * a) * a;
  x *= x;
  return s - s / (x * x);
}

void main (void) {
  float len = uvl.z;
  vec2 xy = uvl.xy;
  float brightness;

  float sigma = vSize / 5.0;
  if (len < EPS) {
    brightness = gaussian(length(xy), sigma);
  } else {
    brightness = erf(xy.x / SQRT2 / sigma) - erf((xy.x - len) / SQRT2 / sigma);
    brightness *= exp(-xy.y * xy.y / (2.0 * sigma * sigma)) / 2.0 / len;
  }

  brightness *= uvl.w;
  gl_FragColor = vec4(color * brightness, brightness);
}
`;

// Calculate color from hue
const getColorFromHue = (hueValue: number) => {
  const h = hueValue / 360;
  const s = 0.5;
  const l = 0.5;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 1 / 6) { r = c; g = x; }
  else if (h < 2 / 6) { r = x; g = c; }
  else if (h < 3 / 6) { g = c; b = x; }
  else if (h < 4 / 6) { g = x; b = c; }
  else if (h < 5 / 6) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
};

export const OscilloscopeLine = ({
  sampleProvider,
  strokeWidth = 2.5,
  swapAxis = false,
  invertX = false,
  invertY = false,
  hue = 0,
  intensity = 1.0,
  useFilter = true,
}: {
  sampleProvider: SampleProvider;
  strokeWidth: number;
  swapAxis: boolean;
  invertX: boolean;
  invertY: boolean;
  hue: number;
  intensity: number;
  glow: number;
  useFilter?: boolean;
}) => {
  const meshRef = useRef<Mesh>(null);
  const geometryRef = useRef<BufferGeometry>(new BufferGeometry());

  const uniformsRef = useRef({
    size: { value: strokeWidth * 0.002 },
    intensity: { value: intensity * 0.01 },
    gain: { value: 1.0 },
    invert: { value: 1.0 },
    nEdges: { value: 0.1 },
    fadeAmount: { value: 0.0 },
    screen: { value: null as DataTexture | null },
    color: { value: new Vector3(...getColorFromHue(hue)) },
  });

  // Lanczos filter - initialized dynamically based on sample size
  const lanczosFilterRef = useRef<LanczosFilter | null>(null);
  const oldXSamplesRef = useRef<Float32Array | null>(null);
  const oldYSamplesRef = useRef<Float32Array | null>(null);
  const smoothedXSamplesRef = useRef<Float32Array | null>(null);
  const smoothedYSamplesRef = useRef<Float32Array | null>(null);

  // Create a black texture for the screen uniform
  const screenTextureRef = useRef<DataTexture | null>(null);

  useEffect(() => {
    // Create simple black texture for screen uniform
    const data = new Float32Array(4 * 4 * 4); // 4x4 RGBA
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;     // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
      data[i + 3] = 1; // A
    }
    const texture = new DataTexture(data, 4, 4, RGBAFormat, FloatType);
    texture.needsUpdate = true;
    screenTextureRef.current = texture;
    uniformsRef.current.screen.value = texture;

    // Initialize geometry with maximum capacity
    const maxSamples = sampleProvider.frameSize * sampleProvider.sampleSize * 10;
    const maxQuads = maxSamples * 6; // 6 vertices per quad (2 triangles)

    const positions = new Float32Array(maxQuads * 3); // x, y, z
    const aStart = new Float32Array(maxQuads * 2);
    const aEnd = new Float32Array(maxQuads * 2);
    const aIdx = new Float32Array(maxQuads);

    geometryRef.current.setAttribute('position', new BufferAttribute(positions, 3));
    geometryRef.current.setAttribute('aStart', new BufferAttribute(aStart, 2));
    geometryRef.current.setAttribute('aEnd', new BufferAttribute(aEnd, 2));
    geometryRef.current.setAttribute('aIdx', new BufferAttribute(aIdx, 1));
    geometryRef.current.setDrawRange(0, 0);

    return () => {
      if (screenTextureRef.current) {
        screenTextureRef.current.dispose();
      }
    };
  }, [sampleProvider]);

  useFrame(() => {
    if (!geometryRef.current || !sampleProvider || !meshRef.current) {
      console.log('Missing refs:', {
        geometry: !!geometryRef.current,
        sampleProvider: !!sampleProvider,
        mesh: !!meshRef.current
      });
      return;
    }

    const material = meshRef.current.material as ShaderMaterial;
    if (!material) {
      console.log('Material not found on mesh');
      return;
    }

    let leftSamples = sampleProvider.flat(Channel.LEFT);
    let rightSamples = sampleProvider.flat(Channel.RIGHT);

    if (!leftSamples || !rightSamples || leftSamples.length === 0) {
      console.log('No samples available');
      geometryRef.current.setDrawRange(0, 0);
      return;
    }

    const bufferSize = leftSamples.length;

    // Initialize Lanczos filter if using filter mode
    if (useFilter) {
      if (!lanczosFilterRef.current || oldXSamplesRef.current?.length !== bufferSize) {
        console.log('Initializing Lanczos filter with bufferSize:', bufferSize);
        lanczosFilterRef.current = new LanczosFilter(bufferSize, 8, 6);
        oldXSamplesRef.current = new Float32Array(bufferSize);
        oldYSamplesRef.current = new Float32Array(bufferSize);
        smoothedXSamplesRef.current = new Float32Array(lanczosFilterRef.current.getSmoothedSampleCount());
        smoothedYSamplesRef.current = new Float32Array(lanczosFilterRef.current.getSmoothedSampleCount());
      }
    } else if (!lanczosFilterRef.current) {
      // Mark as initialized even without filter to prevent repeated logs
      console.log('First samples received (no filter):', {
        bufferSize,
        leftFirst: leftSamples[0],
        rightFirst: rightSamples[0],
        leftRange: [Math.min(...leftSamples), Math.max(...leftSamples)],
        rightRange: [Math.min(...rightSamples), Math.max(...rightSamples)]
      });
      lanczosFilterRef.current = {} as LanczosFilter; // Dummy object to prevent re-logging
    }

    let finalXSamples: Float32Array;
    let finalYSamples: Float32Array;

    if (useFilter && oldXSamplesRef.current && oldYSamplesRef.current &&
      smoothedXSamplesRef.current && smoothedYSamplesRef.current) {
      // Use Lanczos filtering for smooth interpolation
      const filter = lanczosFilterRef.current as LanczosFilter;
      filter.generateSmoothedSamples(
        oldXSamplesRef.current,
        leftSamples,
        smoothedXSamplesRef.current
      );
      filter.generateSmoothedSamples(
        oldYSamplesRef.current,
        rightSamples,
        smoothedYSamplesRef.current
      );

      finalXSamples = smoothedXSamplesRef.current;
      finalYSamples = smoothedYSamplesRef.current;

      oldXSamplesRef.current.set(leftSamples);
      oldYSamplesRef.current.set(rightSamples);
    } else {
      finalXSamples = leftSamples;
      finalYSamples = rightSamples;
    }

    const positionAttr = geometryRef.current.getAttribute('position') as BufferAttribute;
    const aStartAttr = geometryRef.current.getAttribute('aStart') as BufferAttribute;
    const aEndAttr = geometryRef.current.getAttribute('aEnd') as BufferAttribute;
    const aIdxAttr = geometryRef.current.getAttribute('aIdx') as BufferAttribute;

    if (!positionAttr || !aStartAttr || !aEndAttr || !aIdxAttr) return;

    const positions = positionAttr.array as Float32Array;
    const aStart = aStartAttr.array as Float32Array;
    const aEnd = aEndAttr.array as Float32Array;
    const aIdx = aIdxAttr.array as Float32Array;

    // Generate quads for each line segment
    let vertexIndex = 0;
    const numSegments = finalXSamples.length - 1;

    for (let i = 0; i < numSegments; i++) {
      let x1 = finalXSamples[i];
      let y1 = finalYSamples[i];
      let x2 = finalXSamples[i + 1];
      let y2 = finalYSamples[i + 1];

      if (swapAxis) {
        [x1, y1] = [y1, x1];
        [x2, y2] = [y2, x2];
      }
      if (invertX) {
        x1 = -x1;
        x2 = -x2;
      }
      if (invertY) {
        y1 = -y1;
        y2 = -y2;
      }

      // Create a quad (6 vertices forming 2 triangles)
      const quadIndices = [0, 1, 3, 0, 3, 2];

      for (let j = 0; j < 6; j++) {
        const idx = quadIndices[j] + i * 4;
        positions[vertexIndex * 3] = (x1 + x2) * 0.5;
        positions[vertexIndex * 3 + 1] = (y1 + y2) * 0.5;
        positions[vertexIndex * 3 + 2] = 0;
        aStart[vertexIndex * 2] = x1;
        aStart[vertexIndex * 2 + 1] = y1;
        aEnd[vertexIndex * 2] = x2;
        aEnd[vertexIndex * 2 + 1] = y2;
        aIdx[vertexIndex] = idx;
        vertexIndex++;
      }
    }

    positionAttr.needsUpdate = true;
    aStartAttr.needsUpdate = true;
    aEndAttr.needsUpdate = true;
    aIdxAttr.needsUpdate = true;

    geometryRef.current.setDrawRange(0, vertexIndex);

    material.uniforms.nEdges.value = numSegments;
    material.uniforms.size.value = strokeWidth * 0.002;
    material.uniforms.intensity.value = intensity * 0.01;
    material.uniforms.gain.value = 1.0;
    material.uniforms.invert.value = 1.0;
    material.uniforms.fadeAmount.value = 0.0;

    // Update color
    const [r, g, b] = getColorFromHue(hue);
    (material.uniforms.color.value as Vector3).set(r, g, b);
  });

  return (
    <>
      <mesh ref={meshRef} renderOrder={0}>
        <bufferGeometry ref={geometryRef} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniformsRef.current}
          transparent={true}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};