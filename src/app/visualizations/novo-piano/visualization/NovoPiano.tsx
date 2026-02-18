import { SampleProvider } from '../../../audio/SampleProvider';
import { Piano } from './Piano';

export interface NovoPianoProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  intensity?: number;
}

export const NovoPiano = ({ sampleProvider, canvas, intensity = 1.0 }: NovoPianoProps) => {
  const size = 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Piano
        width={canvas.width * size}
        height={canvas.height * size}
        sampleProvider={sampleProvider}
        intensity={intensity}
      />
    </div>
  );
};
