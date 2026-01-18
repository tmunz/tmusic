import { SampleProvider } from '../../../audio/SampleProvider';
import { BlueMondayScene } from './BlueMondayScene';

export interface BlueMondayProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  coverOpacity?: number;
  dataStartAngle?: number;
}

export const BlueMonday = ({ sampleProvider, canvas, coverOpacity, dataStartAngle }: BlueMondayProps) => {
  const sizeRatio = 0.9;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <BlueMondayScene
        width={canvas.width * sizeRatio}
        height={canvas.height * sizeRatio}
        sampleProvider={sampleProvider}
        coverOpacity={coverOpacity}
        dataStartAngle={dataStartAngle}
      />
    </div>
  );
};
