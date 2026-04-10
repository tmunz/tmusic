import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { RisingHorse } from './RisingHorse';

export interface CrossingTheRubiconProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  intensity?: number;
}

export const CrossingTheRubicon = ({ sampleProvider, canvas, intensity }: CrossingTheRubiconProps) => {
  const size = 0.8;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <RisingHorse
        width={canvas.width * size}
        height={canvas.height * size}
        sampleProvider={sampleProvider}
        intensity={intensity}
      />
    </div>
  );
};
