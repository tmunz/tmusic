import { SampleProvider } from '../../../audio/SampleProvider';
import { PsychedelicSwirl } from './PsychedelicSwirl';

export interface TameImpalaCurrentsProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  intensity?: number;
}

export const TameImpalaCurrents = ({ sampleProvider, canvas, intensity = 1 }: TameImpalaCurrentsProps) => {
  const size = Math.min(canvas.width, canvas.height) * 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <PsychedelicSwirl width={size} height={size} sampleProvider={sampleProvider} intensity={intensity} />
    </div>
  );
};
