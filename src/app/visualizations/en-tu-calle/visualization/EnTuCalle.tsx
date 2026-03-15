import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { MondrianVisualization } from './MondrianVisualization';

export interface EnTuCalleProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  speed?: number;
  borderWidth?: number;
}

export const EnTuCalle = ({ sampleProvider, canvas, borderWidth = 1.0 }: EnTuCalleProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <MondrianVisualization
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        borderWidth={borderWidth}
      />
    </div>
  );
};
