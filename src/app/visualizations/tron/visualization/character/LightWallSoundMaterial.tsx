import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SampleProvider } from '../../../../sampleProvider/SampleProvider';

export interface LightWallSoundMaterialProps {
  sampleProvider?: SampleProvider;
  color?: string;
  opacity?: number;
  side?: THREE.Side;
  depthWrite?: boolean;
}

export const useLightWallSoundMaterial = ({
  sampleProvider,
  color = '#00ffff',
  opacity = 0.6,
  side = THREE.DoubleSide,
  depthWrite = false,
}: LightWallSoundMaterialProps) => {
  const frameCountRef = useRef(0);
  const updateInterval = 2; // Update every 2 frames (30fps instead of 60fps)

  useFrame(() => {
    frameCountRef.current++;
    if (frameCountRef.current % updateInterval === 0) {
      updateLightWallAudioTexture(shaderMaterial, sampleProvider);
    }
  });

  const shaderMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);
    const sampleTexture = createAudioTexture(1, 1);

    return new THREE.ShaderMaterial({
      transparent: true,
      side,
      toneMapped: false,
      depthWrite,
      blending: THREE.AdditiveBlending,
      uniforms: {
        sampleData: { value: sampleTexture },
        baseColor: { value: baseColor },
        opacity: { value: opacity },
      },
      vertexShader: `
        attribute vec4 color;
        attribute float sideMark;
        varying vec2 vUv;
        varying vec4 vColor;
        varying float vFaceType;
        varying float vSideMark;
        
        void main() {
          vUv = uv;
          vColor = color;
          vSideMark = sideMark;
          vFaceType = uv.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D sampleData;
        uniform vec3 baseColor;
        uniform float opacity;
        varying vec2 vUv;
        varying vec4 vColor;
        varying float vFaceType;
        varying float vSideMark;
        
        void main() {
          float audioValue = clamp(abs(texture2D(sampleData, vec2(vUv.y, vUv.x)).r), 0.0, 1.0);
          float intensity = 1.0 + audioValue * 2.0;
          vec3 color = baseColor * intensity;
          float alpha = audioValue * opacity * vColor.a;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [color, opacity, side, depthWrite]);

  useEffect(() => {
    // Rebind immediately on source changes, even when movement does not rerender the wall.
    frameCountRef.current = 0;
    updateLightWallAudioTexture(shaderMaterial, sampleProvider);
  }, [shaderMaterial, sampleProvider]);

  useEffect(
    () => () => {
      (shaderMaterial.uniforms.sampleData.value as THREE.DataTexture).dispose();
      shaderMaterial.dispose();
    },
    [shaderMaterial]
  );

  return shaderMaterial;
};

function createAudioTexture(width: number, height: number) {
  const texture = new THREE.DataTexture(
    new Float32Array(width * height),
    width,
    height,
    THREE.RedFormat,
    THREE.FloatType
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

export function updateLightWallAudioTexture(material: THREE.ShaderMaterial, provider?: SampleProvider) {
  const width = provider?.frameSize ?? 1;
  const height = provider?.sampleSize ?? 1;
  let texture = material.uniforms.sampleData.value as THREE.DataTexture;
  if (texture.image.width !== width || texture.image.height !== height) {
    // WebGL texture storage cannot be resized after its first upload.
    const previous = texture;
    texture = createAudioTexture(width, height);
    material.uniforms.sampleData.value = texture;
    previous.dispose();
  }
  const data = texture.image.data as Float32Array;
  data.fill(0);
  if (provider) {
    for (let row = 0; row < height; row++) {
      const sample = provider.get(row);
      data.set(sample.length > width ? sample.subarray(0, width) : sample, row * width);
    }
  }
  texture.needsUpdate = true;
}
