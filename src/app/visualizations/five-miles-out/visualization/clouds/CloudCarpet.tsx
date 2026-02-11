import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector3, DoubleSide } from 'three';
import { useReferenceObject } from '../../../../utils/ReferenceObjectContext';
import { SampleProvider } from '../../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../../audio/useSampleProviderTexture';
import { interpolation } from '../../../../utils/ShaderUtils';

export interface CloudCarpetProps {
  position?: [number, number, number];
  size?: number;
  sampleProvider?: SampleProvider;
}

export const CloudCarpet = ({ position = [0, 0, 0], size = 100, sampleProvider }: CloudCarpetProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { referenceObjectRef } = useReferenceObject();
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const cloudMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraPos: { value: [0, 0, 0] },
        referenceObjectPos: { value: [0, 0, 0] },
        fadeStart: { value: 30.0 },
        fadeEnd: { value: 150.0 },
        displacementScale: { value: 100.0 },
        sampleData: { value: sampleTexture },
        sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        varying vec2 mUv;
        varying float vAudioSample;
        
        uniform vec3 cameraPos;
        uniform vec3 referenceObjectPos;
        uniform float displacementScale;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        
        ${interpolation}
        
        void main() {
          vUv = uv;
          mUv = vec2(
            uv.x + referenceObjectPos.x * 0.005,
            uv.y + referenceObjectPos.z * 0.1 // TODO
          );
          
          vec4 audioSample = interpolation(sampleData, vec2(fract(mUv.x), 1.0 - uv.y), sampleDataSize, vec2(1.0, 1.0), true);
          vAudioSample = audioSample.r;
          vec3 displaced = position + normal * audioSample.r * displacementScale;
          
          vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
          vWorldPosition = worldPosition.xyz;
          vDistanceToCamera = distance(worldPosition.xyz, cameraPos);
          
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        varying vec2 mUv;
        varying float vAudioSample;
        
        uniform float time;
        uniform float fadeStart;
        uniform float fadeEnd;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float sampleDataAvg;
        uniform int samplesActive;

        #define distantColor vec3(0.99, 0.94, 0.8)
        
        void main() {   
          vec3 clouds = vec3(vAudioSample);
          clouds += (distantColor - vec3(0.5)) * smoothstep(fadeStart, fadeEnd, vDistanceToCamera) * 0.5;
          
          float opacityY = smoothstep(1.0, 0.5, vUv.y);
          float opacityX = smoothstep(1.0, 0.7, abs(vUv.x - 0.5) * 2.0);
          float opacity = opacityY * opacityX;
          
          gl_FragColor = vec4(clouds, opacity);
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: true,
    });
  }, [sampleTexture]);

  useFrame(state => {
    if (!meshRef.current || !referenceObjectRef.current) return;
    const worldPos = new Vector3();
    referenceObjectRef.current.getWorldPosition(worldPos);
    /*TODO limit downward movement worldPos.y*/
    meshRef.current.position.set(worldPos.x + position[0], position[1], worldPos.z + position[2]);

    if (!materialRef.current) return;

    if (sampleProvider) {
      updateSampleTexture();
      materialRef.current.uniforms.sampleData.value = sampleTexture;
    }

    materialRef.current.uniforms.referenceObjectPos.value = [worldPos.x, worldPos.y, worldPos.z];
  });

  // const lodGeometry = useMemo(() => {
  //   return createLodGeometry(size, 1028, 0.97);
  // }, [size]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={position} renderOrder={-1}>
      <planeGeometry args={[size, size, 400, 400]} />
      {/* <primitive object={lodGeometry} attach="geometry" /> */}
      <primitive object={cloudMaterial} ref={materialRef} attach="material" wireframe={false} />
    </mesh>
  );
};
