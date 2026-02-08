import { useRef, RefObject, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, ShaderMaterial, Color, DoubleSide, FrontSide } from 'three';

export interface CloudCarpetProps {
  airplaneRef: RefObject<Group>;
  baseY?: number;
  baseColor?: string;
  size?: number;
}

export const CloudCarpet = ({
  airplaneRef,
  baseY = -10,
  // baseColor = '#EBE2D1',
  baseColor = '#ff0000',
  size = 800
}: CloudCarpetProps) => {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);

  const shaderMaterial = useMemo(() => {
    const color = new Color(baseColor);
    
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPos: { value: [0, 0, 0] },
        uColor: { value: [color.r, color.g, color.b] },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        
        uniform float uTime;
        uniform vec3 uCameraPos;
        
        void main() {
          vUv = uv;
          
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vDistanceToCamera = distance(worldPosition.xyz, uCameraPos);
          
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vDistanceToCamera;
        
        uniform float uTime;
        uniform vec3 uColor;
        
        // Hash function for noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(p);
            p = p * 2.0 + vec2(0.5);
            amplitude *= 0.5;
          }
          
          return value;
        }
        
        void main() {
          // Scrolling cloud pattern based on world position
          vec2 cloudUV = vWorldPosition.xz * 0.03;
          
          float largeFormations = fbm(cloudUV * 0.5 + uTime * 0.2);
          float baseNoise = fbm(cloudUV + uTime * 0.02);
          float detailNoise = fbm(cloudUV * 3.0 + uTime * 0.015);
        
          float clouds = largeFormations * 0.4 + baseNoise * 0.4 + detailNoise * 0.15;
          float cloudMask = smoothstep(0.3, 0.75, clouds);
          
          // Calculate fake normal from height differences for better lighting
          vec2 offset = vec2(0.015, 0.0);
          float heightCenter = fbm(cloudUV * 0.8) * clouds;
          float heightRight = fbm((cloudUV + offset.xy) * 0.8) * fbm(cloudUV + offset.xy);
          float heightUp = fbm((cloudUV + offset.yx) * 0.8) * fbm(cloudUV + offset.yx);
          
          // Calculate gradient for normal mapping
          vec2 gradient = vec2(heightRight - heightCenter, heightUp - heightCenter);
          gradient *= 8.0; // Amplify the gradient for stronger lighting
          
          // Light direction (from upper-right, simulating sun)
          vec2 lightDir = normalize(vec2(0.6, 0.8));
          float lighting = dot(normalize(vec2(-gradient.x, -gradient.y)), lightDir);
          lighting = lighting * 0.5 + 0.5; // Remap to 0-1
          
          // Create stronger dome illusion with height-based lighting
          float heightIllusion = clouds * clouds;
          
          // Enhanced lighting with more dramatic shadows and highlights
          float ambientOcclusion = smoothstep(0.2, 0.6, clouds); // Darker in denser areas
          lighting = mix(0.3, 1.3, lighting * lighting); // More contrast
          lighting *= mix(0.7, 1.0, ambientOcclusion); // Apply AO
          
          // Add rim lighting on cloud edges for volume
          float edgeGlow = pow(1.0 - clouds, 3.0) * cloudMask * 0.6;
          
          float maxDistance = 400.0;
          float minDistance = 50.0;
          float distanceFactor = 1.0 - smoothstep(minDistance, maxDistance, vDistanceToCamera);
          
          // Edge fade
          vec2 center = vec2(0.5, 0.5);
          float distFromCenter = distance(vUv, center);
          float edgeFade = 1.0 - smoothstep(0.3, 0.5, distFromCenter);
          
          // Combine opacity with height for more visible domes
          float finalOpacity = cloudMask * (0.4 + distanceFactor * 0.6) * edgeFade;
          finalOpacity = mix(finalOpacity, finalOpacity * 1.3, heightIllusion * 0.5);
          
          // Color with more dramatic lighting
          vec3 shadowColor = uColor * 0.35;
          vec3 baseColor = uColor;
          vec3 highlightColor = vec3(1.0, 0.99, 0.96);
          
          // Apply lighting to create 3D domed appearance
          vec3 finalColor = mix(shadowColor, baseColor, lighting);
          
          // Add bright highlights on dome tops
          float highlightStrength = pow(max(0.0, lighting - 0.7), 2.0) * heightIllusion;
          finalColor = mix(finalColor, highlightColor, highlightStrength * 0.8);
          
          // Add subtle edge glow
          finalColor += highlightColor * edgeGlow;
          
          // Atmospheric perspective
          vec3 skyColor = vec3(0.88, 0.90, 0.95);
          float fogMix = 1.0 - distanceFactor * 0.8;
          finalColor = mix(skyColor, finalColor, fogMix);
          
          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });
  }, [baseColor]);

  useFrame((state) => {
    if (!airplaneRef.current || !meshRef.current || !materialRef.current) return;
    
    const airplanePos = airplaneRef.current.position;
    
    // Keep plane centered on airplane with offset below it
    meshRef.current.position.x = airplanePos.x;
    meshRef.current.position.y = airplanePos.y + baseY;
    meshRef.current.position.z = airplanePos.z;
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uCameraPos.value = [
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
    ];
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]}
    >
      <planeGeometry args={[size, size, 100, 100]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
};
