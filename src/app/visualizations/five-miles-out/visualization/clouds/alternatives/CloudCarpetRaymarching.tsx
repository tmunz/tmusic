import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { ShaderMaterial, Vector3, DoubleSide, TextureLoader, RepeatWrapping } from 'three';
import { useReferenceObject } from '../../../../../utils/ReferenceObjectContext';
import { SampleProvider } from '../../../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../../../audio/useSampleProviderTexture';
import { interpolation } from '../../../../../utils/ShaderUtils';

export interface CloudCarpetProps {
  position?: [number, number, number];
  cloudTexture?: string;
  size?: number;
  sampleProvider?: SampleProvider;
}

export const CloudCarpet = ({
  position = [0, 0, 0],
  size = 100,
  sampleProvider,
  cloudTexture = require('../assets/cloud-noise.png'),
}: CloudCarpetProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { referenceObjectRef } = useReferenceObject();
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);
  const cloudTextureLoaded = useLoader(TextureLoader, cloudTexture);

  useEffect(() => {
    if (cloudTextureLoaded) {
      cloudTextureLoaded.wrapS = RepeatWrapping;
      cloudTextureLoaded.wrapT = RepeatWrapping;
    }
  }, [cloudTextureLoaded]);

  const cloudMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraPos: { value: new Vector3(0, 0, 0) },
        referenceObjectPos: { value: [0, 0, 0] },
        planePosition: { value: new Vector3(...position) },
        planeSize: { value: size },
        heightScale: { value: 40.0 },
        intensity: { value: 1.0 },
        testTexture: { value: cloudTextureLoaded },
        sampleData: { value: sampleTexture },
        sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec2 vWorldUV;
        varying vec3 vWorldPosition;
        varying vec3 vRayOrigin;
        varying vec3 vRayDirection;
        varying vec3 vPlaneWorldPos;
        
        uniform vec3 cameraPos;
        uniform vec3 referenceObjectPos;
        uniform vec3 planePosition;
        uniform float planeSize;
        
        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vPlaneWorldPos = worldPosition.xyz;
          vRayOrigin = cameraPos;
          vRayDirection = normalize(worldPosition.xyz - cameraPos);
          
          vec3 planeCenter = vec3(
            referenceObjectPos.x + planePosition.x,
            worldPosition.y,
            referenceObjectPos.z + planePosition.z
          );
          vec3 localPos = worldPosition.xyz - planeCenter;
          vWorldUV = (localPos.xz / planeSize) + 0.5;
          
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec2 vWorldUV;
        varying vec3 vWorldPosition;
        varying vec3 vRayOrigin;
        varying vec3 vRayDirection;
                
        uniform sampler2D sampleData;
        uniform sampler2D testTexture;
        uniform vec3 referenceObjectPos;
        uniform vec3 planePosition;
        uniform float planeSize;
        uniform vec2 sampleDataSize;
        uniform float heightScale;
        uniform float intensity;

        #define MAX_STEPS 1000
        #define STEP_SIZE 0.5
        
        ${interpolation}
        
        void main() {
          // Get the plane's base Y position
          float baseY = vWorldPosition.y;
          
          // Raymarch to find intersection with the surface
          // Start from the plane position (where the ray already hit the plane)
          vec3 color = vec3(0.0);
          bool hit = false;
          
          float t = 0.0;
          float prevSurfaceY = baseY;
          
          for (int i = 0; i < MAX_STEPS; i++) {
            vec3 p = vWorldPosition + vRayDirection * t;
            
            // Calculate UV at current ray position
            vec3 planeCenter = vec3(
              referenceObjectPos.x + planePosition.x,
              baseY,
              referenceObjectPos.z + planePosition.z
            );
            vec3 localPos = p - planeCenter;
            vec2 currentUV = (localPos.xz / planeSize) + 0.5;
            
            // Check if UV is within bounds
            if (currentUV.x < 0.0 || currentUV.x > 1.0 || currentUV.y < 0.0 || currentUV.y > 1.0) {
              break;
            }
            
            // Get the height at this ray position from audio data
            float dataValue = interpolation(sampleData, currentUV, sampleDataSize, vec2(1.0), true).r;
            // Invert: bright (1.0) = at plane, dark (0.0) = far down
            float surfaceHeight = (1.0 - dataValue) * heightScale;
            float surfaceY = baseY - surfaceHeight;
            
            // Check if we crossed the surface (from above to below or at)
            if (i > 0 && p.y <= surfaceY && (vWorldPosition.y + vRayDirection.y * (t - STEP_SIZE)) > prevSurfaceY) {
              // We hit the surface! Sample the texture at this UV position
              vec4 texColor = texture2D(testTexture, currentUV);
              color = vec3(dataValue); // * texColor.rgb;
              hit = true;
              break;
            }
            
            prevSurfaceY = surfaceY;
            t += STEP_SIZE;
            
            // Stop if we've gone too far below the surface
            if (t > 500.0 || p.y < baseY - heightScale - 10.0) break;
          }
          
          // If no hit, make it transparent
          float alpha = hit ? 1.0 : 0.0;
          
          // Apply edge fade
          float edgeFade = smoothstep(0.0, 0.1, vWorldUV.x) * smoothstep(1.0, 0.9, vWorldUV.x) *
                          smoothstep(0.0, 0.1, vWorldUV.y) * smoothstep(1.0, 0.9, vWorldUV.y);
          alpha *= edgeFade;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }, [sampleTexture, position, size]);

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
    materialRef.current.uniforms.cameraPos.value.copy(state.camera.position);
    materialRef.current.uniforms.referenceObjectPos.value = [worldPos.x, worldPos.y, worldPos.z];
    materialRef.current.uniforms.planePosition.value.set(position[0], position[1], position[2]);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={position} renderOrder={-1}>
      <planeGeometry args={[size, size, 2, 2]} />
      <primitive object={cloudMaterial} ref={materialRef} attach="material" wireframe={false} />
    </mesh>
  );
};
