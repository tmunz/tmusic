import { useEffect, useState } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { Piano } from './Piano';

export interface NovoPianoProps {
  sampleProvider: SampleProvider;
  canvas: { width: number; height: number };
  intensity?: number;
  colorGradient?: number;
  colorSparks?: number;
  perspective?: number;
}

export const NovoPiano = ({
  sampleProvider,
  canvas,
  intensity = 1.0,
  colorGradient = 0.0,
  colorSparks = 0.0,
  perspective = 0.0,
}: NovoPianoProps) => {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'm') {
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Piano
        width={canvas.width}
        height={canvas.height}
        sampleProvider={sampleProvider}
        intensity={intensity}
        colorGradient={colorGradient}
        colorSparks={colorSparks}
        perspective={perspective}
        debug={debugMode}
      />
    </div>
  );
};
