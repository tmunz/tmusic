import { SampleProvider } from '../../../audio/SampleProvider';
import { DelacroixLibertyLeadingThePeoplePainting } from './DelacroixLibertyLeadingThePeoplePainting';

export interface VivaLaVidaProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  drawingPath?: string;
  speed?: number;
}

export const VivaLaVida = ({
  sampleProvider,
  canvas,
  drawingPath,
  speed = 1,
}: VivaLaVidaProps & { speed?: number }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <DelacroixLibertyLeadingThePeoplePainting
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        drawingPath={drawingPath}
        speed={speed}
      />
    </div>
  );
};
