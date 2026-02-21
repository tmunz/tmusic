import { useEffect, useRef, useState } from 'react';
import { SampleProvider } from './SampleProvider';

export const useAudioAnalysis = (
  streamProvider: Promise<MediaStream | null>,
  frequencyBands = 32,
  sampleSize = 1,
  minFrequency = 0,
  maxFrequency = 22050,
  chromaticScale = false,
  spectralContrastBoost = 0,
  sampleRate = 60
) => {
  const REFERENCE_FREQUENCY = 440; // 440 hz => A4
  const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioFrames, setAudioFrames] = useState(
    new SampleProvider(sampleSize, new Uint8Array(frequencyBands).fill(0))
  );
  const [fftSize, setFftSize] = useState(64);

  useEffect(() => {
    const minSize = chromaticScale ? 32768 : frequencyBands * 4;
    const targetSize = Math.max(512, minSize);
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(targetSize)));
    setFftSize(Math.min(16384, Math.max(512, nextPowerOf2)));
  }, [frequencyBands, chromaticScale]);

  useEffect(() => {
    let audioContext: AudioContext | null = null;

    const initializeAudio = async () => {
      const streamSource = await streamProvider;
      if (streamSource) {
        audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        const source = audioContext.createMediaStreamSource(streamSource);
        source.connect(analyser);
        analyserRef.current = analyser;
        audioDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      } else {
        analyserRef.current = null;
        audioDataRef.current = null;
      }
    };

    initializeAudio();

    return () => {
      audioContext?.close();
    };
  }, [streamProvider, fftSize]);

  const calculateReferenceNoteIndex = (minFreq: number) => {
    if (chromaticScale) {
      return -Math.round(12 * Math.log2(minFreq / REFERENCE_FREQUENCY));
    }
    return -1;
  };

  const getFrequencyData = () => {
    if (analyserRef.current && audioDataRef.current) {
      analyserRef.current.getByteFrequencyData(audioDataRef.current);
      const frequencyData = audioDataRef.current;
      const nyquist = analyserRef.current.context.sampleRate / 2;
      const minIndex = Math.max(0, Math.floor((minFrequency / nyquist) * frequencyData.length));
      const maxIndex = Math.min(frequencyData.length - 1, Math.floor((maxFrequency / nyquist) * frequencyData.length));
      const bands = new Uint8Array(frequencyBands);

      if (bands.length === 0) {
        return bands;
      }

      if (chromaticScale) {
        // Map frequency bands logarithmically to match musical notes (chromatic scale)
        const startNote = calculateReferenceNoteIndex(minFrequency);
        for (let i = 0; i < frequencyBands; i++) {
          const noteNumber = i - startNote;
          const noteFreq = REFERENCE_FREQUENCY * Math.pow(2, noteNumber / 12);
          const nextNoteFreq = REFERENCE_FREQUENCY * Math.pow(2, (noteNumber + 1) / 12);
          const startBinIdx = Math.floor((noteFreq / nyquist) * frequencyData.length);
          const endBinIdx = Math.floor((nextNoteFreq / nyquist) * frequencyData.length);
          const clampedStart = Math.max(minIndex, Math.min(maxIndex, startBinIdx));
          const clampedEnd = Math.max(clampedStart + 1, Math.min(maxIndex + 1, endBinIdx));

          // Root Mean Square (RMS) for perceived loudness
          let sumSquares = 0;
          let count = 0;
          for (let j = clampedStart; j < clampedEnd; j++) {
            const normalized = frequencyData[j] / 255.0;
            sumSquares += normalized * normalized;
            count++;
          }

          bands[i] = count > 0 ? Math.round(Math.sqrt(sumSquares / count) * 255) : 0;
        }
      } else {
        // Linear frequency bands
        const slicedData = frequencyData.slice(minIndex, maxIndex + 1);
        const bandSize = slicedData.length / frequencyBands;

        for (let i = 0; i < frequencyBands; i++) {
          const startIdx = Math.floor(i * bandSize);
          const endIdx = Math.floor((i + 1) * bandSize);
          let sum = 0;

          for (let j = startIdx; j < endIdx && j < slicedData.length; j++) {
            sum += slicedData[j];
          }

          const count = Math.max(1, endIdx - startIdx);
          bands[i] = Math.round(sum / count);
        }
      }

      if (spectralContrastBoost > 0) {
        for (let i = 0; i < bands.length; i++) {
          const normalized = bands[i] / 255.0;
          const boosted = Math.pow(normalized, 1 / (1 - spectralContrastBoost * 0.9));
          bands[i] = Math.round(boosted * 255);
        }
      }

      return bands;
    }
    return null;
  };

  useEffect(() => {
    const provider = new SampleProvider(sampleSize, new Uint8Array(frequencyBands).fill(0));
    provider.referenceNoteIndex = calculateReferenceNoteIndex(minFrequency);
    setAudioFrames(provider);
  }, [sampleSize, frequencyBands, minFrequency, maxFrequency, chromaticScale, spectralContrastBoost]);

  useEffect(() => {
    const interval = 1000 / sampleRate;
    const intervalId = setInterval(() => {
      const audioData = getFrequencyData();
      if (audioData) {
        audioFrames.hz = sampleRate / sampleSize;
        audioFrames.push(audioData);
      } else {
        audioFrames.push();
      }
    }, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, [audioFrames, fftSize, sampleSize, minFrequency, maxFrequency, chromaticScale, spectralContrastBoost]);

  return audioFrames;
};
