import { useEffect, useState, useMemo } from 'react';
import { useAudioAnalysis } from '../audio/analyzer/useAudioAnalysis';
import { WaveformAnalyzer } from '../audio/analyzer/waveform/WaveformAnalyzer';
import { SpectrumAnalyzer } from '../audio/analyzer/spectrum/SpectrumAnalyzer';
import { Audio } from '../audio/Audio';
import { SampleProvider } from './SampleProvider';
import { WaveformAnalyzerConfig } from '../audio/analyzer/waveform/WaveformAnalyzerConfig';
import { SpectrumAnalyzerConfig } from '../audio/analyzer/spectrum/SpectrumAnalyzerConfigs';

interface SampleProviderProps {
  onSampleProviderChange: (sampleProvider: SampleProvider) => void;
  config: Record<string, any>;
}

export const SampleProviderComponent = ({ onSampleProviderChange, config }: SampleProviderProps) => {
  const [streamProvider, setStreamProvider] = useState<Promise<MediaStream | null>>(Promise.resolve(null));

  const { analyzerConfig, analyzer } = useMemo(() => {
    if (config.audioAnalyser === 'waveform') {
      const analyzerConfig = new WaveformAnalyzerConfig(config);
      return {
        analyzerConfig,
        analyzer: new WaveformAnalyzer(analyzerConfig),
      };
    } else {
      const analyzerConfig = new SpectrumAnalyzerConfig(config);
      return {
        analyzerConfig,
        analyzer: new SpectrumAnalyzer(analyzerConfig),
      };
    }
  }, [config]);

  const sampleProvider = useAudioAnalysis(streamProvider, analyzer, analyzerConfig);

  useEffect(() => {
    onSampleProviderChange(sampleProvider);
  }, [sampleProvider, onSampleProviderChange]);

  return <Audio onChange={sp => setStreamProvider(sp)} />;
};
