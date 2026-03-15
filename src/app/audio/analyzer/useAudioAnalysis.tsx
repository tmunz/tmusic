import { useEffect, useRef, useState } from 'react';
import { SampleProvider } from '../../sampleProvider/SampleProvider';
import { AudioAnalyzer } from './AudioAnalyzer';
import { AudioAnalyzerConfig } from './AudioAnalyzerConfig';

export const useAudioAnalysis = <Config extends AudioAnalyzerConfig>(
  streamProvider: Promise<MediaStream | null>,
  createAnalyzer: (config: Config) => AudioAnalyzer<Config>,
  config: Config
) => {
  const analyzerRef = useRef<AudioAnalyzer<Config> | null>(null);
  const [audioFrames, setAudioFrames] = useState<SampleProvider>(() => {
    const analyzer = createAnalyzer(config);
    return analyzer.createSampleProvider(config.frameSize);
  });

  // Initialize analyzer when stream becomes available
  useEffect(() => {
    const initializeAnalyzer = async () => {
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }

      const streamSource = await streamProvider;
      if (streamSource) {
        const analyzer = createAnalyzer(config);
        await analyzer.initialize(streamSource);
        analyzerRef.current = analyzer;
      }
    };

    initializeAnalyzer();

    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
    };
  }, [streamProvider, createAnalyzer, config]);

  // Recreate sample provider when config changes
  useEffect(() => {
    const analyzer = createAnalyzer(config);
    const provider = analyzer.createSampleProvider(config.frameSize);
    setAudioFrames(provider);
  }, [config, createAnalyzer]);

  // Extract audio data at specified sample rate
  useEffect(() => {
    const interval = 1000 / config.sampleRate;
    const intervalId = setInterval(() => {
      if (analyzerRef.current) {
        const audioData = analyzerRef.current.extractData();
        if (audioData) {
          audioFrames.push(audioData.left, audioData.right || undefined);
        } else {
          audioFrames.push();
        }
      } else {
        audioFrames.push();
      }
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [audioFrames, config]);

  return audioFrames;
};
