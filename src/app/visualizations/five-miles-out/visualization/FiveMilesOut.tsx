import { SampleProvider } from '../../../audio/SampleProvider';
import { FiveMilesOutScene } from './FiveMilesOutScene';

export interface FiveMilesOutProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const FiveMilesOut = ({ sampleProvider, canvas }: FiveMilesOutProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FiveMilesOutScene width={canvas.width} height={canvas.height} sampleProvider={sampleProvider} />
    </div>
  );
};
