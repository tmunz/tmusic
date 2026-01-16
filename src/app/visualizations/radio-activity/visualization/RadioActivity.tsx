import { SampleProvider } from '../../../audio/SampleProvider';
import { RadioActivityScene } from './RadioActivityScene';

export interface RadioActivityProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  centerDataRatio?: number;
  radiationDataRatio?: number;
}

export const RadioActivity = ({ sampleProvider, canvas, centerDataRatio, radiationDataRatio }: RadioActivityProps) => {
  const sizeRatio = 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <RadioActivityScene
        width={canvas.width * sizeRatio}
        height={canvas.height * sizeRatio}
        sampleProvider={sampleProvider}
        centerDataRatio={centerDataRatio}
        radiationDataRatio={radiationDataRatio}
      />
    </div>
  );
};
