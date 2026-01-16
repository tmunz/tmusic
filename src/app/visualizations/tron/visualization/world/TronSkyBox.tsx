import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTronState } from '../TronContext';

interface TronSkyBoxProps {
  radius?: number;
  horizonColor?: string;
  skyColor?: string;
  groundColor?: string;
}

export const TronSkyBox = ({
  radius = 500,
  horizonColor = '#4e0122',
  skyColor = '#000044',
  groundColor = '#000000',
}: TronSkyBoxProps) => {
  const { tronState } = useTronState();
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      const userPos = tronState.user.position;
      sphereRef.current.position.set(userPos.x, userPos.y, userPos.z);
    }
  });

  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      horizonColor: { value: new THREE.Color(horizonColor) },
      skyColor: { value: new THREE.Color(skyColor) },
      groundColor: { value: new THREE.Color(groundColor) },
      horizonHeight: { value: 0.05 },
      horizonWidth: { value: 0.2 },
    },
    vertexShader: `
      varying vec3 vPosition;
      
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 horizonColor;
      uniform vec3 skyColor;
      uniform vec3 groundColor;
      uniform float horizonHeight;
      uniform float horizonWidth;
      
      varying vec3 vPosition;
      
      void main() {
        float height = vPosition.y / length(vPosition);
        
        // Create narrow horizon band
        float distFromHorizon = abs(height - horizonHeight);
        float horizonMask = 1.0 - smoothstep(0.0, horizonWidth, distFromHorizon);
        
        // Base color (sky or ground)
        vec3 baseColor;
        if (height > horizonHeight + horizonWidth) {
          // Sky - dark blue/black
          baseColor = skyColor;
        } else if (height < horizonHeight - horizonWidth) {
          // Ground - black
          baseColor = groundColor;
        } else {
          // Transition zone
          float t = (height - (horizonHeight - horizonWidth)) / (horizonWidth * 2.0);
          baseColor = mix(groundColor, skyColor, t);
        }
        
        // Mix in horizon glow
        vec3 color = mix(baseColor, horizonColor, horizonMask);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });

  return (
    <mesh ref={sphereRef} material={sphereMaterial}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
};
