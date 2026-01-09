import { useEffect, useRef } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { Mesh, ShaderMaterial, Vector2, DoubleSide, Box3 } from 'three';
import { useFrame } from '@react-three/fiber';

export interface BananaShaderProps {
  sampleProvider: SampleProvider;
  intensity?: number;
  mesh: Mesh | null;
}

export const BananaShader = ({ sampleProvider, intensity = 1, mesh }: BananaShaderProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);
  const modifiedMaterialRef = useRef<ShaderMaterial | null>(null);
  const originalMaterialRef = useRef<any>(null);

  useEffect(() => {
    if (!mesh) {
      return;
    }
    const currentMaterial = mesh.material as any;
    if (!originalMaterialRef.current) {
      originalMaterialRef.current = currentMaterial;
    }
    const baseTexture = originalMaterialRef.current.map || null;
    const bbox = new Box3().setFromObject(mesh);
    const min = bbox.min;
    const max = bbox.max;

    const shaderMaterial = new ShaderMaterial({
      uniforms: {
        sampleData: { value: sampleTexture },
        sampleDataSize: { value: new Vector2(sampleTexture.image.width, sampleTexture.image.height) },
        audioIntensity: { value: intensity },
        baseTexture: { value: baseTexture },
        hasTexture: { value: baseTexture ? 1.0 : 0.0 },
        bboxMin: { value: min },
        bboxMax: { value: max },
      },
      vertexShader: `
        uniform vec3 bboxMin;
        uniform vec3 bboxMax;
        
        varying vec2 vUv;
        varying vec2 vDataUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vDataUv = (position.xy - bboxMin.xy) / (bboxMax.xy - bboxMin.xy);
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float audioIntensity;
        uniform sampler2D baseTexture;
        uniform float hasTexture;
        
        varying vec2 vUv;
        varying vec2 vDataUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          float sampleValue = texture2D(sampleData, vDataUv).r;
          vec3 baseColor;
          if (hasTexture > 0.1) {
            baseColor = texture2D(baseTexture, vUv).rgb;
          } else {
            baseColor = vec3(0.85, 0.72, 0.28);
          }
          vec3 audioGlow = vec3(1.0, 0.9, 0.3) * sampleValue * audioIntensity;
          vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
          float diffuse = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.4;
          vec3 litColor = baseColor * (ambient + diffuse * 0.6);
          vec3 finalColor = litColor + audioGlow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: DoubleSide,
    });

    modifiedMaterialRef.current = shaderMaterial;
    mesh.material = shaderMaterial;

    // Cleanup: restore original material when component unmounts
    return () => {
      if (mesh && originalMaterialRef.current) {
        mesh.material = originalMaterialRef.current;
      }
    };
  }, [mesh, sampleTexture, intensity]);

  useFrame(() => {
    if (!modifiedMaterialRef.current) return;

    updateSampleTexture();
    modifiedMaterialRef.current.uniforms.sampleData.value = sampleTexture;
    modifiedMaterialRef.current.uniforms.sampleDataSize.value.set(
      sampleTexture.image.width,
      sampleTexture.image.height
    );
    modifiedMaterialRef.current.uniforms.audioIntensity.value = intensity;
  });

  return null;
};
