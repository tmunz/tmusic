import { SampleProvider } from '../../../audio/SampleProvider';
import { Bedroom } from './Bedroom';

export interface PushTheSkyAwayProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  pointerSensitivity?: number;
}

export const PushTheSkyAway = ({ sampleProvider, canvas, pointerSensitivity = 1.0 }: PushTheSkyAwayProps) => {
  const sizeRatio = 0.8;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Bedroom width={canvas.width * sizeRatio} height={canvas.height * sizeRatio} sampleProvider={sampleProvider} perspectiveEffect={pointerSensitivity * 0.08} />
    </div>
  );
};
