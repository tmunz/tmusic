import { SampleProvider } from '../../../audio/SampleProvider';
import { DelacroixLibertyLeadingThePeoplePainting } from './DelacroixLibertyLeadingThePeoplePainting';

export interface VivaLaVidaProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  drawingPath?: string;
  speed?: number;
  creaminess?: number;
  dryness?: number;
  scale?: number;
  strokeWidth?: number;
  pouringSize?: number;
  pouringAmount?: number;
  falloff?: number;
}

export const VivaLaVida = (props: VivaLaVidaProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <DelacroixLibertyLeadingThePeoplePainting {...props} width={props.canvas.width} height={props.canvas.height} />
    </div>
  );
};
