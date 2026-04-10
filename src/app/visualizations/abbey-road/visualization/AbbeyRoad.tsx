import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { Crossing } from './Crossing';

export interface AbbeyRoadProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  direction?: number;
  intensity?: number;
  pointerSensitivity?: number;
}

export const AbbeyRoad = ({
  sampleProvider,
  canvas,
  direction = 0,
  intensity = 1.0,
  pointerSensitivity = 1.0,
}: AbbeyRoadProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Crossing
        width={canvas.width}
        height={canvas.height * 0.8}
        sampleProvider={sampleProvider}
        direction={direction}
        intensity={intensity}
        perspectiveEffect={pointerSensitivity * 0.08}
      />
    </div>
  );
};
