import { SampleProvider } from '../../../audio/SampleProvider';
import { useAppState, VisualizationAction } from '../../../AppContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Sky } from '@react-three/drei';
import { Airplane } from './airplane/Airplane';
import { Stats } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { HorizonClouds } from './clouds/HorizonClouds';
import { ReferenceObjectProvider, useReferenceObject } from '../../../utils/ReferenceObjectContext';
import { ReferenceObjectCamera } from './ReferenceObjectCamera';
import { SampleCloudField } from './clouds/SampleCloudField';

export interface FiveMilesOutSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const FiveMilesOutScene = ({ width, height, sampleProvider }: FiveMilesOutSceneProps) => {
  const [landingGear, setLandingGear] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [locked, setLocked] = useState(true);
  const { dispatch } = useAppState();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() === 'y') {
        setLandingGear(prev => !prev);
      }
      if (event.key.toLocaleLowerCase() === 'l') {
        setLocked(prev => !prev);
      }
      if (event.key.toLocaleLowerCase() === 'm') {
        setDebugMode(prev => !prev);
      }
      if (event.key.toLocaleLowerCase() === 'w' || event.key.toLocaleLowerCase() === 's') {
        dispatch({
          type: VisualizationAction.CHANGE_VISUALIZATION_SETTING_VALUE,
          section: 'samples',
          key: 'sampleSize',
          value: event.key.toLocaleLowerCase() === 'w' ? -1 : +1,
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sampleProvider, dispatch]);

  const CAMERA_OFFSET: [number, number, number] = [5, 1, 30];
  const CAMERA_TARGET_OFFSET: [number, number, number] = [1, 1, -2];

  return (
    <div style={{ position: 'relative', width, height }}>
      <Canvas
        camera={{ position: CAMERA_OFFSET, fov: 35, near: 0.1, far: 2000 }}
        style={{ width, height, display: 'block' }}
      >
        {debugMode && <Stats />}
        <ambientLight intensity={2} color="#fffadd" />
        <directionalLight position={[2, 1, -1]} intensity={3} color="#ffffff" />
        <directionalLight position={[3, 1, -5]} intensity={6} color="#fffadd" />
        <ReferenceObjectProvider>
          <CustomSky />
          <SampleCloudField position={[0, -150, -500]} size={1500} sampleProvider={sampleProvider} />
          <HorizonClouds size={1000} />
          <Airplane
            rotation={[0.0, 0.0, 0.18]}
            isReferenceObject
            landingGear={landingGear}
            speed={12000 / sampleProvider.sampleSize}
            locked={locked}
          />
          <ReferenceObjectCamera offset={CAMERA_OFFSET} targetOffset={CAMERA_TARGET_OFFSET} />
        </ReferenceObjectProvider>
        <group position={[-80, -20, -100]} scale={10}>
          <Cloud color="#4c4c4c" opacity={0.7} seed={2} fade={0} growth={10} speed={1} />
        </group>
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
