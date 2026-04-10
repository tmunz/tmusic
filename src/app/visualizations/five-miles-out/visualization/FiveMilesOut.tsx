import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { FiveMilesOutScene } from './FiveMilesOutScene';

export interface FiveMilesOutProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  intensity?: number;
}

export const FiveMilesOut = ({ sampleProvider, canvas, intensity = 0.5 }: FiveMilesOutProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FiveMilesOutScene
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        intensity={intensity}
      />
    </div>
  );
};
