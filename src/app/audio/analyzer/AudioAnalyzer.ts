import { SampleProvider } from '../../sampleProvider/SampleProvider';
import { AudioAnalyzerConfig } from './AudioAnalyzerConfig';

export abstract class AudioAnalyzer<Config extends AudioAnalyzerConfig> {
  protected audioDataLeftRef: Uint8Array<ArrayBuffer> | null = null;
  protected audioDataRightRef: Uint8Array<ArrayBuffer> | null = null;
  protected analyserLeftRef: AnalyserNode | null = null;
  protected analyserRightRef: AnalyserNode | null = null;
  protected audioContext: AudioContext | null = null;
  protected config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  abstract calculateFftSize(): number;
  abstract getDefaultValue(): number;
  abstract initializeBuffers(analyser: AnalyserNode): Uint8Array<ArrayBuffer>;
  abstract extractData(): { left: Uint8Array; right: Uint8Array | null } | null;

  async initialize(streamSource: MediaStream): Promise<void> {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(streamSource);
    const fftSize = this.calculateFftSize();

    if (this.config.stereo) {
      const splitter = this.audioContext.createChannelSplitter(2);
      source.connect(splitter);

      const analyserLeft = this.audioContext.createAnalyser();
      analyserLeft.fftSize = fftSize;
      this.configureSmoothness(analyserLeft);
      splitter.connect(analyserLeft, 0);
      this.analyserLeftRef = analyserLeft;
      this.audioDataLeftRef = this.initializeBuffers(analyserLeft);

      const analyserRight = this.audioContext.createAnalyser();
      analyserRight.fftSize = fftSize;
      this.configureSmoothness(analyserRight);
      splitter.connect(analyserRight, 1);
      this.analyserRightRef = analyserRight;
      this.audioDataRightRef = this.initializeBuffers(analyserRight);
    } else {
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      this.configureSmoothness(analyser);
      source.connect(analyser);
      this.analyserLeftRef = analyser;
      this.audioDataLeftRef = this.initializeBuffers(analyser);
      this.analyserRightRef = null;
      this.audioDataRightRef = null;
    }
  }

  protected abstract configureSmoothness(analyser: AnalyserNode): void;

  cleanup(): void {
    this.audioContext?.close();
    this.audioContext = null;
    this.analyserLeftRef = null;
    this.analyserRightRef = null;
    this.audioDataLeftRef = null;
    this.audioDataRightRef = null;
  }

  createSampleProvider(bands: number): SampleProvider {
    const defaultValue = new Uint8Array(bands).fill(this.getDefaultValue());
    const provider = new SampleProvider(this.config.sampleSize, this.config.sampleRate, defaultValue);
    provider.stereo = this.config.stereo;
    return provider;
  }
}
