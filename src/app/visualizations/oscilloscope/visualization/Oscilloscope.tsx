import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { OscilloscopeScene } from './OscilloscopeScene';

export interface OscilloscopeProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  strokeWidth?: number;
  swapAxis?: boolean;
  invertX?: boolean;
  invertY?: boolean;
  hue?: number;
  intensity?: number;
  grid?: number;
  glow?: number;
}

export const Oscilloscope = ({
  sampleProvider,
  canvas,
  strokeWidth = 2.5,
  swapAxis = false,
  invertX = false,
  invertY = false,
  hue = 0,
  intensity = 1.2,
  grid = 1.0,
  glow = 0.8,
}: OscilloscopeProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <OscilloscopeScene
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        strokeWidth={strokeWidth}
        swapAxis={swapAxis}
        invertX={invertX}
        invertY={invertY}
        hue={hue}
        intensity={intensity}
        grid={grid}
        glow={glow}
      />
    </div>
  );
};
