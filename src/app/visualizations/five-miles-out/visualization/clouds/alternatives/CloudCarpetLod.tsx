import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { ShaderMaterial, TextureLoader, RepeatWrapping, LinearFilter, Vector3, DoubleSide } from 'three';
import { useReferenceObject } from '../../../../../utils/ReferenceObjectContext';
import { SampleProvider } from '../../../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../../../audio/useSampleProviderTexture';
import { createLodGeometry } from './LodGeometry';
import { interpolation } from '../../../../../utils/ShaderUtils';

export interface CloudCarpetProps {
  position?: [number, number, number];
  size?: number;
  cloudTexture?: string;
  sampleProvider?: SampleProvider;
}

export const CloudCarpet = ({
  position = [0, 0, 0],
  size = 1000,
  cloudTexture = require('./assets/cloud-noise.png'),
  sampleProvider,
}: CloudCarpetProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { referenceObjectRef } = useReferenceObject();
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  // const texture = useLoader(TextureLoader, cloudTexture);
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  // texture.minFilter = LinearFilter;
  // texture.magFilter = LinearFilter;

  const cloudMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: size },
        cameraPos: { value: [0, 0, 0] },
        // cloudTexture: { value: texture },
        referenceObjectPos: { value: [0, 0, 0] },
        fadeStart: { value: 30.0 },
        fadeEnd: { value: 150.0 },
        displacementScale: { value: 20.0 },
        sampleData: { value: sampleTexture },
        sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec2 vCloudUv;
        varying float vSampleValue;

        
        uniform vec3 referenceObjectPos;
        // uniform sampler2D cloudTexture;
        uniform float displacementScale;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float size;

        ${interpolation}
        
        void main() {
          vUv = uv;
          vCloudUv = vec2(
            uv.x + referenceObjectPos.x / size,
            uv.y - referenceObjectPos.z / size
          );
          
          vSampleValue = interpolation(sampleData, vec2(vCloudUv.x, 1.0 - uv.y), sampleDataSize, vec2(1., 1.), true).r;
          vec3 displaced = position + normal * vSampleValue * displacementScale;
          
          vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        varying vec2 vCloudUv;
        varying float vSampleValue;
        
        uniform float time;
        // uniform sampler2D cloudTexture;
        uniform float fadeStart;
        uniform float fadeEnd;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float sampleDataAvg;
        uniform int samplesActive;

        #define distantColor vec3(0.99, 0.94, 0.8)

        ${interpolation}
        
        void main() {
          // Use pre-calculated cloud UV from vertex shader
          // vec3 clouds1 = texture2D(cloudTexture, vCloudUv * 2. - time * 0.01).rgb;
          // vec3 clouds2 = texture2D(cloudTexture, vCloudUv * 10. + time * 0.02).rgb;
          // vec3 clouds = mix(clouds1, clouds2, 0.4);
          float sampleValue = interpolation(sampleData, vec2(vCloudUv.x, 1.0 - vUv.y), sampleDataSize, vec2(1., 1.), true).r;
          vec3 clouds = vec3(sampleValue);
          
          // float distanceFade = smoothstep(fadeStart, fadeEnd, vDistanceToCamera);
          // clouds += (distantColor - vec3(0.5)) * distanceFade * 0.5;
          
          vec2 edgeDist = abs(vUv - 0.5) * 2.0;
          float opacity = smoothstep(1.0, 0.4, max(edgeDist.x, edgeDist.y));
          
          gl_FragColor = vec4(clouds, opacity);
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: true,
    });
  }, [size, sampleTexture]);

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

    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.size.value = size;
    materialRef.current.uniforms.cameraPos.value = [
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
    ];
    materialRef.current.uniforms.referenceObjectPos.value = [worldPos.x, worldPos.y, worldPos.z];
  });

  const lodGeometry = useMemo(() => {
    return createLodGeometry(size, size * 4, 0.5);
  }, [size]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={position} renderOrder={-1}>
      <primitive object={lodGeometry} attach="geometry" />
      {/* <planeGeometry args={[size, size, 100, 100]} /> */}
      <primitive object={cloudMaterial} ref={materialRef} attach="material" wireframe={false} />
    </mesh>
  );
};
