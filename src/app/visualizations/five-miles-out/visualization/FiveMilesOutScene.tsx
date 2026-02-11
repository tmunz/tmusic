import { SampleProvider } from '../../../audio/SampleProvider';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Sky } from '@react-three/drei';
import { Airplane } from './airplane/Airplane';
import { Clouds } from './clouds/Clouds';
import { Stats } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { CloudCarpet } from './clouds/CloudCarpetDeprecated';
import { HorizonClouds } from './clouds/HorizonClouds';
import { ReferenceObjectProvider, useReferenceObject } from '../../../utils/ReferenceObjectContext';

export interface FiveMilesOutSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const FiveMilesOutScene = ({ width, height, sampleProvider }: FiveMilesOutSceneProps) => {
  const [landingGear, setLandingGear] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'y' || event.key === 'Y') {
        setLandingGear(prev => !prev);
      }
      if (event.key === 'm' || event.key === 'M') {
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Canvas
        camera={{ position: [4, 2, 20], fov: 50, near: 0.1, far: 2000 }}
        style={{ width, height, display: 'block' }}
      >
        {debugMode && <Stats />}
        <ambientLight intensity={2} color="#fffadd" />
        <directionalLight position={[2, 1, -1]} intensity={3} color="#ffffff" />
        <directionalLight position={[3, 1, -5]} intensity={6} color="#fffadd" />
        <ReferenceObjectProvider>
          <CustomSky />
          <CloudCarpet position={[-30, -50, -140]} sampleProvider={sampleProvider} />
          <HorizonClouds />
          {/* <Clouds basePosition={[-50, -20, 0]} /> */}
          <Airplane isReferenceObject landingGear={landingGear} speed={20} />
        </ReferenceObjectProvider>
        <group position={[-60, -20, -50]} scale={10}>
          <Cloud color="#4c4c4c" opacity={0.3} seed={2} fade={0} growth={10} speed={1} />
        </group>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
};

const CustomSky = () => {
  const skyRef = useRef<any>(null);
  const { referenceObjectRef } = useReferenceObject();

  useFrame(() => {
    if (!referenceObjectRef.current || !skyRef.current) return;
    skyRef.current.position.copy(referenceObjectRef.current.position);
  });

  return (
    <Sky
      ref={skyRef}
      distance={2000000000000000000}
      azimuth={0.26}
      inclination={0.51}
      turbidity={1.1}
      rayleigh={0.25}
      mieCoefficient={0.005}
      mieDirectionalG={0.995}
    />
  );
};
