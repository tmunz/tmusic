import { useEffect, useState, useMemo } from 'react';
import { useAudioAnalysis } from '../audio/analyzer/useAudioAnalysis';
import { WaveformAnalyzer } from '../audio/analyzer/waveform/WaveformAnalyzer';
import { SpectrumAnalyzer } from '../audio/analyzer/spectrum/SpectrumAnalyzer';
import { WaveformAnalyzerConfig } from '../audio/analyzer/waveform/WaveformAnalyzerConfig';
import { SpectrumAnalyzerConfig } from '../audio/analyzer/spectrum/SpectrumAnalyzerConfig';
import { Audio } from '../audio/Audio';
import { SampleProvider } from './SampleProvider';

interface SampleProviderProps {
  onSampleProviderChange: (sampleProvider: SampleProvider) => void;
  // Common settings
  sampleSize?: number;
  frameSize?: number;
  sampleRate?: number;
  stereo?: boolean;
  waveform?: boolean;
  
  // Spectrum-specific settings
  minFrequency?: number;
  maxFrequency?: number;
  chromaticScale?: boolean;
  spectralContrastBoost?: number;
}

export const SampleProviderComponent = ({
  onSampleProviderChange,
  sampleSize = 1,
  frameSize = 32,
  sampleRate = 60,
  stereo = false,
  waveform = false,
  minFrequency = 10,
  maxFrequency = 10000,
  chromaticScale = false,
  spectralContrastBoost = 0,
}: SampleProviderProps) => {
  const [streamProvider, setStreamProvider] = useState<Promise<MediaStream | null>>(Promise.resolve(null));

  const { analyzerConfig, createAnalyzer } = useMemo(() => {
    if (waveform) {
      const config: WaveformAnalyzerConfig = {
        sampleSize,
        frameSize,
        sampleRate,
        stereo,
      };
      return {
        analyzerConfig: config,
        createAnalyzer: (cfg: WaveformAnalyzerConfig) => new WaveformAnalyzer(cfg),
      };
    } else {
      const config: SpectrumAnalyzerConfig = {
        sampleSize,
        frameSize,
        sampleRate,
        stereo,
        minFrequency,
        maxFrequency,
        chromaticScale,
        spectralContrastBoost,
      };
      return {
        analyzerConfig: config,
        createAnalyzer: (cfg: SpectrumAnalyzerConfig) => new SpectrumAnalyzer(cfg),
      };
    }
  }, [sampleSize, frameSize, sampleRate, stereo, waveform, minFrequency, maxFrequency, chromaticScale, spectralContrastBoost]);
  
  const sampleProvider = useAudioAnalysis(
    streamProvider,
    createAnalyzer as any,
    analyzerConfig as any
  );

  useEffect(() => {
    onSampleProviderChange(sampleProvider);
  }, [sampleProvider, onSampleProviderChange]);

  return <Audio onChange={sp => setStreamProvider(sp)} />;
};
