import { useEffect, useRef, useState } from 'react';
import { SampleProvider } from '../../sampleProvider/SampleProvider';
import { AudioAnalyzer } from './AudioAnalyzer';
import { BaseAnalyzerConfig } from './AnalyzerConfig';

export const useAudioAnalysis = <Config extends BaseAnalyzerConfig>(
  streamProvider: Promise<MediaStream | null>,
  audioAnalyzer: AudioAnalyzer<Config>,
  config: Config
) => {
  const analyzerRef = useRef<AudioAnalyzer<Config> | null>(null);
  const [audioFrames, setAudioFrames] = useState<SampleProvider>(() => {
    return audioAnalyzer.createSampleProvider(config.frameSize);
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
        const analyzer = audioAnalyzer;
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
  }, [streamProvider, audioAnalyzer, config]);

  useEffect(() => {
    const provider = audioAnalyzer.createSampleProvider(config.frameSize);
    setAudioFrames(provider);
  }, [config, audioAnalyzer]);

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
