import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface LightWallSectionSoundMaterialProps {
  sampleTexture: THREE.DataTexture;
  updateSampleTexture: () => void;
  color?: string;
  opacity?: number;
}

export const useLightWallSectionSoundMaterial = ({
  sampleTexture,
  updateSampleTexture,
  color = '#00ffff',
  opacity = 0.2,
}: LightWallSectionSoundMaterialProps) => {
  // Create shader material
  const shaderMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);

    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
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
          // We want to sample ONLY the newest sample (Y = 0.0) across the full width
          // vUv.y = 0 (bottom) to 1 (top) represents frequency bands
          // vUv.x = 0 to 1 represents the full width of the geometry
          
          // Sample the newest audio sample (Y = 0.0) at frequency position vUv.y
          float audioValue = texture2D(sampleData, vec2(vUv.y, 0.0)).r;
          
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
