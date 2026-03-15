import { AudioAnalyzer } from '../AudioAnalyzer';
import { SpectrumAnalyzerConfig } from './SpectrumAnalyzerConfig';

export class SpectrumAnalyzer extends AudioAnalyzer<SpectrumAnalyzerConfig> {
  private readonly REFERENCE_FREQUENCY = 440; // 440 hz => A4
  private referenceNoteIndex: number = -1;

  constructor(config: SpectrumAnalyzerConfig) {
    super(config);
    this.referenceNoteIndex = this.calculateReferenceNoteIndex();
  }

  calculateFftSize(): number {
    const minSize = this.config.chromaticScale ? 32768 : this.config.frameSize * 4;
    const targetSize = Math.max(512, minSize);
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(targetSize)));
    return Math.min(16384, Math.max(512, nextPowerOf2));
  }

  getDefaultValue(): number {
    return 0;
  }

  initializeBuffers(analyser: AnalyserNode): Uint8Array<ArrayBuffer> {
    return new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
  }

  protected configureSmoothness(analyser: AnalyserNode): void {
    analyser.smoothingTimeConstant = 0.8;
  }

  private calculateReferenceNoteIndex(): number {
    if (this.config.chromaticScale) {
      return -Math.round(12 * Math.log2(this.config.minFrequency / this.REFERENCE_FREQUENCY));
    }
    return -1;
  }

  extractData(): { left: Uint8Array; right: Uint8Array | null } | null {
    if (this.analyserLeftRef && this.audioDataLeftRef) {
      this.analyserLeftRef.getByteFrequencyData(this.audioDataLeftRef as Uint8Array<ArrayBuffer>);
      const frequencyDataLeft = this.audioDataLeftRef;
      const nyquist = this.analyserLeftRef.context.sampleRate / 2;
      const minIndex = Math.max(0, Math.floor((this.config.minFrequency / nyquist) * frequencyDataLeft.length));
      const maxIndex = Math.min(
        frequencyDataLeft.length - 1,
        Math.floor((this.config.maxFrequency / nyquist) * frequencyDataLeft.length)
      );

      const bandsLeft = this.processFrequencyData(frequencyDataLeft, nyquist, minIndex, maxIndex);

      if (this.config.stereo && this.analyserRightRef && this.audioDataRightRef) {
        this.analyserRightRef.getByteFrequencyData(this.audioDataRightRef as Uint8Array<ArrayBuffer>);
        const frequencyDataRight = this.audioDataRightRef;
        const bandsRight = this.processFrequencyData(frequencyDataRight, nyquist, minIndex, maxIndex);
        return { left: bandsLeft, right: bandsRight };
      } else {
        return { left: bandsLeft, right: null };
      }
    }
    return null;
  }

  private processFrequencyData(
    frequencyData: Uint8Array,
    nyquist: number,
    minIndex: number,
    maxIndex: number
  ): Uint8Array {
    const bands = new Uint8Array(this.config.frameSize);

    if (bands.length === 0) {
      return bands;
    }

    if (this.config.chromaticScale) {
      // Map frequency bands logarithmically to match musical notes (chromatic scale)
      const startNote = this.referenceNoteIndex;
      for (let i = 0; i < this.config.frameSize; i++) {
        const noteNumber = i - startNote;
        const noteFreq = this.REFERENCE_FREQUENCY * Math.pow(2, noteNumber / 12);
        const nextNoteFreq = this.REFERENCE_FREQUENCY * Math.pow(2, (noteNumber + 1) / 12);
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
      const bandSize = slicedData.length / this.config.frameSize;

      for (let i = 0; i < this.config.frameSize; i++) {
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

    if (this.config.spectralContrastBoost > 0) {
      for (let i = 0; i < bands.length; i++) {
        const normalized = bands[i] / 255.0;
        const boosted = Math.pow(normalized, 1 / (1 - this.config.spectralContrastBoost * 0.9));
        bands[i] = Math.round(boosted * 255);
      }
    }

    return bands;
  }

  override createSampleProvider(bands: number) {
    const provider = super.createSampleProvider(bands);
    provider.referenceNoteIndex = this.referenceNoteIndex;
    return provider;
  }
}
