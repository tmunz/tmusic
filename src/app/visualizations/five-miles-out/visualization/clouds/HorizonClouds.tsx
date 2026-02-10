import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, BackSide, Vector3 } from 'three';
import { useReferenceObject } from '../../../../utils/ReferenceObjectContext';

export interface HorizonCloudsProps {
  distance?: number;
  height?: number;
  size?: number;
}

export const HorizonClouds = ({ distance = 200, height = 40, size = 1000 }: HorizonCloudsProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { referenceObjectRef } = useReferenceObject();
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cloudDensity: { value: 0.5 },
        cloudSharpness: { value: 0.4 },
        cloudSpeed: { value: 0.001 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        uniform float time;
        uniform float cloudDensity;
        uniform float cloudSharpness;
        uniform float cloudSpeed;
        
        #define PI 3.14159265359
        #define rgb(r,g,b) (vec3(r,g,b)/255.)
        
        float rand(float x) { return fract(sin(x) * 71.5413291); }
        
        float rand(vec2 x) { return rand(dot(x, vec2(13.4251, 15.5128))); }
        
        float noise(vec2 x) {
          vec2 i = floor(x);
          vec2 f = x - i;
          f *= f * (3. - 2. * f);
          return mix(mix(rand(i), rand(i + vec2(1, 0)), f.x),
                     mix(rand(i + vec2(0, 1)), rand(i + vec2(1, 1)), f.x), f.y);
        }
        
        float fbm(vec2 x) {
          float r = 0.0, s = 1.0, w = 1.0;
          for (int i = 0; i < 5; i++) {
            s *= 2.0;
            w *= 0.5;
            r += w * noise(s * x);
          }
          return r;
        }
        
        float cloud(vec2 uv, float scalex, float scaley, float density, float sharpness, float speed) {
          float fbmValue = fbm(vec2(scalex, scaley) * (uv + vec2(speed, 0) * time));
          float cloudValue = clamp(fbmValue - (1.0 - density), 0., 1.);
          float exponent = max(0.1, 1.0 - sharpness);
          return pow(cloudValue, exponent);
        }
        
        void main() {
          float azimuth = atan(vPosition.z, vPosition.x) / (2.0 * PI) + 0.5;
          float altitude = vUv.y;
          
          vec2 uv = vec2(azimuth, altitude);
          vec3 color = mix(rgb(255., 212., 166.), rgb(204., 235., 255.), altitude);
          
          // Clouds
          vec3 cl1 = mix(rgb(151., 138., 153.), rgb(166., 191., 224.), altitude);
          float d1 = mix(0.9, 0.1, pow(max(0.01, altitude), 0.7));
          float cloudLayer1 = cloud(uv, 2., 8., d1, cloudSharpness, cloudSpeed * 2.0);
          color = mix(color, cl1, cloudLayer1);
          
          float cloud1 = cloud(uv, 14., 18., 0.9, 0.75, cloudSpeed);
          float cloud2 = cloud(uv, 2., 5., 0.6, 0.15, cloudSpeed * 0.5);
          float cloudLayer2 = 8. * cloud1 * cloud2 * altitude;
          color = mix(color, vec3(0.9), cloudLayer2);
          
          float cloud3 = cloud(uv, 12., 15., 0.9, 0.75, cloudSpeed * 1.5);
          float cloud4 = cloud(uv, 2., 8., 0.5, 0.0, cloudSpeed);
          float cloudLayer3 = 5. * cloud3 * cloud4 * altitude;
          color = mix(color, vec3(0.8), cloudLayer3);
          
          float totalClouds = clamp(cloudLayer1 + cloudLayer2 + cloudLayer3, 0., 1.);
          
          color *= vec3(1.0, 0.98, 0.91) * 1.04;          
          float alpha = totalClouds;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      side: BackSide,
      transparent: true,
      depthWrite: true,
    });
  }, []);

  useFrame(state => {
    if (!meshRef.current || !materialRef.current || !referenceObjectRef.current) return;

    const worldPos = new Vector3();
    referenceObjectRef.current.getWorldPosition(worldPos);
    meshRef.current.position.set(worldPos.x, height, worldPos.z - distance);

    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, height, 0]} rotation={[0, 0, 0]} renderOrder={-2}>
      <cylinderGeometry args={[size, size, size * 2, 64, 64, true]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
};
