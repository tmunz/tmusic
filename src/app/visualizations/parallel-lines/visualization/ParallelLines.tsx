import { SampleProvider } from '../../../audio/SampleProvider';
import { ParallelLinesShaderImage } from './ParallelLinesShaderImage';

export interface ParallelLinesProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const ParallelLines = ({ sampleProvider, canvas }: ParallelLinesProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <ParallelLinesShaderImage width={canvas.width} height={canvas.height} sampleProvider={sampleProvider} />
    </div>
  );
};
