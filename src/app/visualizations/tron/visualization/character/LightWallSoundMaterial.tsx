import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface LightWallSoundMaterialProps {
  sampleTexture: THREE.DataTexture;
  updateSampleTexture: () => void;
  color?: string;
  opacity?: number;
  side?: THREE.Side;
  depthWrite?: boolean;
}

export const useLightWallSoundMaterial = ({
  sampleTexture,
  updateSampleTexture,
  color = '#00ffff',
  opacity = 0.6,
  side = THREE.DoubleSide,
  depthWrite = false,
}: LightWallSoundMaterialProps) => {
  useFrame(() => {
    updateSampleTexture();
    if (shaderMaterial.uniforms.sampleData) {
      shaderMaterial.uniforms.sampleData.value = sampleTexture;
    }
  });

  const shaderMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);
    sampleTexture.minFilter = THREE.NearestFilter;
    sampleTexture.magFilter = THREE.NearestFilter;

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
        varying vec2 vUv;
        varying vec4 vColor;
        void main() {
          vUv = uv;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D sampleData;
        uniform vec3 baseColor;
        uniform float opacity;
        uniform float fixedAlpha;
        varying vec2 vUv;
        varying vec4 vColor;
        
        void main() {
          float audioValue = texture2D(sampleData, vec2(vUv.y, vUv.x)).r;
          float intensity = 1.0 + audioValue * 2.0;
          vec3 color = baseColor * intensity;
          float alpha = audioValue * opacity * vColor.a;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [color, opacity]);

  return shaderMaterial;
};
