import { SampleProvider } from '../../../audio/SampleProvider';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { useControls } from 'leva';
import { Airplane } from './Airplane';
import { Clouds } from './Clouds';
import { CloudWithControls } from './CloudWithControls';
import { useRef } from 'react';
import { Group } from 'three';
import { CloudCarpet } from './CloudCarpet';

export interface FiveMilesOutSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const FiveMilesOutScene = ({ width, height, sampleProvider }: FiveMilesOutSceneProps) => {
  const airplaneRef = useRef<Group>(null);


  return (
    <div style={{ position: 'relative', width, height }}>
      <Canvas camera={{ position: [4, 2, 20], fov: 50, near: 0.1, far: 1000 }} style={{ width, height, display: 'block' }}>
        <CustomSky airplaneRef={airplaneRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, -2]} intensity={5.5} color="#fff1e1" />
        <directionalLight position={[-30, 10, 0]} intensity={0.3} color="#fefefe" />
        {/* <BasePlane airplaneRef={airplaneRef} /> */}
        <Airplane ref={airplaneRef} />
        {/* <CloudWithControls /> */}
        <CloudCarpet 
          airplaneRef={airplaneRef}
          baseY={-20}
        />
        {/* <Clouds sampleProvider={sampleProvider} airplaneRef={airplaneRef} /> */}
        <OrbitControls enableZoom={true} enablePan={true} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};

const CustomSky = ({ airplaneRef }: { airplaneRef: React.RefObject<Group> }) => {
  const skyRef = useRef<any>(null);

  const skySettings = useControls('Sky Settings', {
    distance: { value: 2000000000000000000, min: 1000, max: 1000000, step: 1000 },
    azimuth: { value: 0.26, min: 0, max: 1, step: 0.01 },
    inclination: { value: 0.53, min: 0, max: 1, step: 0.001 },
    turbidity: { value: 1.1, min: 0, max: 20, step: 0.1 },
    rayleigh: { value: 0.25, min: 0, max: 4, step: 0.1 },
    mieCoefficient: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
    mieDirectionalG: { value: 0.995, min: 0, max: 1, step: 0.01 },
  });

  useFrame(() => {
    if (!airplaneRef.current || !skyRef.current) return;
    skyRef.current.position.copy(airplaneRef.current.position);
  });
  
  return <Sky 
    ref={skyRef} 
    distance={skySettings.distance}
    azimuth={skySettings.azimuth}
    inclination={skySettings.inclination}
    turbidity={skySettings.turbidity}
    rayleigh={skySettings.rayleigh}
    mieCoefficient={skySettings.mieCoefficient}
    mieDirectionalG={skySettings.mieDirectionalG}
  />;

};
