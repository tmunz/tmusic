import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { CrossingScene } from './CrossingScene';

export interface XXProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  numberOfSections?: number;
  offsetAngle?: number;
  sectionWidth?: number;
  sectionLength?: number;
}

export const XX = ({
  sampleProvider,
  canvas,
  numberOfSections = 4,
  offsetAngle = 45.0,
  sectionWidth = 0.2,
  sectionLength = 0.8,
}: XXProps) => {
  const sizeRatio = 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CrossingScene
        width={canvas.width * sizeRatio}
        height={canvas.height * sizeRatio}
        sampleProvider={sampleProvider}
        numberOfSections={numberOfSections}
        offsetAngle={offsetAngle}
        sectionWidth={sectionWidth}
        sectionLength={sectionLength}
      />
    </div>
  );
};
