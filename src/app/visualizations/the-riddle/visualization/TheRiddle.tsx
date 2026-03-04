import { useEffect, useState } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { Scene } from './Scene';
import { useAppState, VisualizationAction } from '../../../AppContext';

export const DEFAULT_SAMPLE_SIZE = 100;

export interface TheRiddleProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  strokeNoise?: number;
}

export const TheRiddle = ({ sampleProvider, canvas, strokeNoise = 0.5 }: TheRiddleProps) => {
  const { dispatch } = useAppState();
  const [sampleSizeAdjusted, setSampleSizeAdjusted] = useState(false);

  useEffect(() => {
    const sampleSize = sampleProvider.sampleSize;
    if (sampleSize == DEFAULT_SAMPLE_SIZE && !sampleSizeAdjusted) {
      const ratio = canvas.width / canvas.height;
      dispatch({
        type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
        section: 'samples',
        key: 'sampleSize',
        value: Math.floor(sampleSize * ratio),
      });
      setSampleSizeAdjusted(true);
    }
  }, [sampleProvider.sampleSize]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Scene width={canvas.width} height={canvas.height} sampleProvider={sampleProvider} strokeNoise={strokeNoise} />
    </div>
  );
};
