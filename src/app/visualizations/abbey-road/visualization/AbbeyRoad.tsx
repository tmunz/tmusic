import { SampleProvider } from '../../../audio/SampleProvider';
import { Crossing } from './Crossing';

export interface AbbeyRoadProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  direction?: number;
}

export const AbbeyRoad = ({ sampleProvider, canvas, direction = 0 }: AbbeyRoadProps) => {
  const sizeRatio = 0.8;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Crossing
        width={canvas.width * sizeRatio}
        height={canvas.height * sizeRatio}
        sampleProvider={sampleProvider}
        direction={direction}
      />
    </div>
  );
};
