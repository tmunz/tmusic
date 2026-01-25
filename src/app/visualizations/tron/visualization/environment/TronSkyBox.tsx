import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color, Mesh, ShaderMaterial } from 'three';

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
  const { camera } = useThree();
  const sphereRef = useRef<Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.set(camera.position.x, camera.position.y, camera.position.z);
    }
  });

  const sphereMaterial = new ShaderMaterial({
    uniforms: {
      horizonColor: { value: new Color(horizonColor) },
      skyColor: { value: new Color(skyColor) },
      groundColor: { value: new Color(groundColor) },
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

        float distFromHorizon = abs(height - horizonHeight);
        float horizonMask = 1.0 - smoothstep(0.0, horizonWidth, distFromHorizon);

        vec3 baseColor;
        if (height > horizonHeight + horizonWidth) {
          baseColor = skyColor;
        } else if (height < horizonHeight - horizonWidth) {
          baseColor = groundColor;
        } else {
          float t = (height - (horizonHeight - horizonWidth)) / (horizonWidth * 2.0);
          baseColor = mix(groundColor, skyColor, t);
        }
        
        vec3 color = mix(baseColor, horizonColor, horizonMask);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: BackSide,
    depthWrite: false,
  });

  return (
    <mesh ref={sphereRef} material={sphereMaterial}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
};
