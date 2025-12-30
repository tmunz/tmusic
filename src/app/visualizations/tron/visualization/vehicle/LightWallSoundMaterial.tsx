import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface LightWallSoundMaterialProps {
  sampleTexture: THREE.DataTexture;
  updateSampleTexture: () => void;
  color?: string;
  opacity?: number;
}

export const useLightWallSoundMaterial = ({
  sampleTexture,
  updateSampleTexture,
  color = '#00ffff',
  opacity = 0.2,
}: LightWallSoundMaterialProps) => {
  // Create shader material
  const shaderMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);

    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      toneMapped: false,
      uniforms: {
        sampleData: { value: sampleTexture },
        baseColor: { value: baseColor },
        opacity: { value: opacity },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D sampleData;
        uniform vec3 baseColor;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          // The sampleData texture has:
          // - Width = frequencyBands (X axis)
          // - Height = sampleSize (Y axis, time)
          // We only want the NEWEST sample (y = 0 in texture coordinates)
          // and map frequency bands across the full width (vUv.x)
          
          // Sample only the newest row (y = 0.0), with frequency mapped to x
          float audioValue = texture2D(sampleData, vec2(vUv.x, 0.0)).r;
          
          // Calculate intensity and alpha based on audio value
          float intensity = 1.0 + audioValue * 3.0;
          float alpha = audioValue * opacity * 2.0;
          
          // Add minimum alpha for visibility
          alpha = max(alpha, 0.05);
          
          vec3 color = baseColor * intensity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [color, opacity]);

  // Update texture and uniforms on each frame
  useFrame(() => {
    updateSampleTexture();
    if (shaderMaterial.uniforms.sampleData) {
      shaderMaterial.uniforms.sampleData.value = sampleTexture;
    }
  });

  return shaderMaterial;
};
