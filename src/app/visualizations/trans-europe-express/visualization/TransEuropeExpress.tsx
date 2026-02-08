import { SampleProvider } from '../../../audio/SampleProvider';
import { TrainRide } from './TrainRide';

export interface TransEuropeExpressProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
}

export const TransEuropeExpress = ({ sampleProvider, canvas }: TransEuropeExpressProps) => {
  const sizeRatio = 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <TrainRide width={canvas.width * sizeRatio} height={canvas.height * sizeRatio} sampleProvider={sampleProvider} />
    </div>
  );
};
