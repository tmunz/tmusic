import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { ShaderMaterial, TextureLoader, RepeatWrapping, LinearFilter, Vector3, DoubleSide } from 'three';
import { useReferenceObject } from '../../../../utils/ReferenceObjectContext';

export interface CloudCarpetProps {
  baseY?: number;
  size?: number;
  cloudTexture?: string;
}

export const CloudCarpet = ({
  baseY = -50,
  size = 600,
  cloudTexture = require('./assets/cloud-noise.png'),
}: CloudCarpetProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { referenceObjectRef } = useReferenceObject();
  const texture = useLoader(TextureLoader, cloudTexture);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraPos: { value: [0, 0, 0] },
        cloudTexture: { value: texture },
        referenceObjectPos: { value: [0, 0, 0] },
        fadeStart: { value: 30.0 },
        fadeEnd: { value: 150.0 },
        displacementScale: { value: 12.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        varying vec2 vCloudUv;
        
        uniform vec3 cameraPos;
        uniform vec3 referenceObjectPos;
        uniform sampler2D cloudTexture;
        uniform float displacementScale;
        
        void main() {
          vUv = uv;
          
          // Calculate cloud UV with reference object offset once
          vCloudUv = vec2(
            uv.x + referenceObjectPos.x * 0.003,
            uv.y - referenceObjectPos.z * 0.003
          );
          
          // Sample height and displace
          vec4 heightColor = texture2D(cloudTexture, vCloudUv);
          float height = (heightColor.r + heightColor.g + heightColor.b) / 3.0;
          vec3 displaced = position + normal * height * displacementScale - displacementScale * 0.5;
          
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
        varying vec2 vCloudUv;
        
        uniform float time;
        uniform sampler2D cloudTexture;
        uniform float fadeStart;
        uniform float fadeEnd;

        #define distantColor vec3(0.99, 0.94, 0.8)
        
        void main() {
          // Use pre-calculated cloud UV from vertex shader
          vec3 clouds1 = texture2D(cloudTexture, vCloudUv * 4. - time * 0.01).rgb;
          vec3 clouds2 = texture2D(cloudTexture, vCloudUv * 8. + time * 0.02).rgb;
          vec3 clouds = mix(clouds1, clouds2, 0.4);
          
          float distanceFade = smoothstep(fadeStart, fadeEnd, vDistanceToCamera);
          clouds += (distantColor - vec3(0.5)) * distanceFade * 0.5;
          
          vec2 edgeDist = abs(vUv - 0.5) * 2.0;
          float opacity = smoothstep(1.0, 0.0, max(edgeDist.x, edgeDist.y));
          
          gl_FragColor = vec4(clouds, opacity);
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: true,
    });
  }, [texture]);

  useFrame(state => {
    if (!meshRef.current || !materialRef.current || !referenceObjectRef.current) return;

    const worldPos = new Vector3();
    referenceObjectRef.current.getWorldPosition(worldPos);
    meshRef.current.position.set(worldPos.x, /*TODO limit downward movement worldPos.y*/ +baseY, worldPos.z);
    
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.cameraPos.value = [
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
    ];
    materialRef.current.uniforms.referenceObjectPos.value = [worldPos.x, worldPos.y, worldPos.z];
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY, 0]} renderOrder={-1}>
      <planeGeometry args={[size, size, 400, 400]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
};
