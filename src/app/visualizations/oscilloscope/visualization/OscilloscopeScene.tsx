import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { OscilloscopeLine } from './OscilloscopeLine';
import { OscilloscopeGrid } from './OscilloscopeGrid';
import { OscilloscopePostProcessing } from './OscilloscopePostProcessing';
import { OscilloscopeNoise } from './OscilloscopeNoise';

export interface OscilloscopeSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  strokeWidth?: number;
  swapAxis?: boolean;
  invertX?: boolean;
  invertY?: boolean;
  hue?: number;
  intensity?: number;
  grid?: number;
  glow?: number;
}

export const OscilloscopeScene = ({
  width,
  height,
  sampleProvider,
  strokeWidth = 2.5,
  swapAxis = false,
  invertX = false,
  invertY = false,
  hue = 0,
  intensity = 1.0,
  grid = 1.0,
  glow = 1.0,
}: OscilloscopeSceneProps) => {
  const minDimension = Math.min(width, height);
  const scaleX = (minDimension / width) * 0.8;
  const scaleY = (minDimension / height) * 0.8;

  return (
    <div style={{ width, height }}>
      <Canvas key={`${width}-${height}`} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <OrthographicCamera
          makeDefault
          position={[0, 0, 1]}
          left={-1}
          right={1}
          top={1}
          bottom={-1}
          near={0.1}
          far={2}
        />
        <group scale={[scaleX, scaleY, 1]}>
          <OscilloscopeLine
            sampleProvider={sampleProvider}
            strokeWidth={strokeWidth}
            swapAxis={swapAxis}
            invertX={invertX}
            invertY={invertY}
            hue={hue}
            intensity={intensity}
            glow={glow}
          />
          <OscilloscopeGrid intensity={grid} />
        </group>
        <OscilloscopeNoise />
        <OscilloscopePostProcessing exposure={1.0} glow={glow} />
      </Canvas>
    </div>
  );
};
