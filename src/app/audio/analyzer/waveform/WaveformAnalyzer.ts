import { AudioAnalyzer } from '../AudioAnalyzer';
import { WaveformAnalyzerConfig } from './WaveformAnalyzerConfig';

export class WaveformAnalyzer extends AudioAnalyzer<WaveformAnalyzerConfig> {
  calculateFftSize(): number {
    const targetSize = Math.max(512, this.config.frameSize * 2);
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(targetSize)));
    return Math.min(32768, Math.max(512, nextPowerOf2));
  }

  getDefaultValue(): number {
    return 128;
  }

  initializeBuffers(analyser: AnalyserNode): Uint8Array<ArrayBuffer> {
    return new Uint8Array(analyser.fftSize) as Uint8Array<ArrayBuffer>;
  }

  protected configureSmoothness(analyser: AnalyserNode): void {
    analyser.smoothingTimeConstant = 0;
  }

  extractData(): { left: Uint8Array; right: Uint8Array | null } | null {
    if (this.analyserLeftRef && this.audioDataLeftRef) {
      this.analyserLeftRef.getByteTimeDomainData(this.audioDataLeftRef as Uint8Array<ArrayBuffer>);
      const waveformLeft = this.audioDataLeftRef.slice(0, this.config.frameSize);

      if (this.config.stereo && this.analyserRightRef && this.audioDataRightRef) {
        this.analyserRightRef.getByteTimeDomainData(this.audioDataRightRef as Uint8Array<ArrayBuffer>);
        const waveformRight = this.audioDataRightRef.slice(0, this.config.frameSize);
        return { left: waveformLeft, right: waveformRight };
      } else {
        return { left: waveformLeft, right: null };
      }
    }
    return null;
  }
}
