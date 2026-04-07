import { AudioAnalyzer } from '../AudioAnalyzer';
import { WaveformAnalyzerConfig } from './WaveformAnalyzerConfig';

export class WaveformAnalyzer extends AudioAnalyzer<WaveformAnalyzerConfig> {
  calculateFftSize(): number {
    const targetSize = Math.max(512, this.config.frameSize * 2);
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(targetSize)));
    return Math.min(32768, Math.max(512, nextPowerOf2));
  }

  getDefaultValue(): number {
    return 0.0;
  }

  initializeBuffers(analyser: AnalyserNode): Float32Array {
    return new Float32Array(analyser.fftSize);
  }

  protected configureSmoothness(analyser: AnalyserNode): void {
    analyser.smoothingTimeConstant = 0;
  }

  extractData(): { left: Float32Array; right: Float32Array | null } | null {
    if (this.analyserLeftRef && this.audioDataLeftRef) {
      this.analyserLeftRef.getFloatTimeDomainData(this.audioDataLeftRef as Float32Array<ArrayBuffer>);
      const waveformLeft = this.audioDataLeftRef.slice(0, this.config.frameSize);

      if (this.config.stereo && this.analyserRightRef && this.audioDataRightRef instanceof Float32Array) {
        this.analyserRightRef.getFloatTimeDomainData(this.audioDataRightRef as Float32Array<ArrayBuffer>);
        const waveformRight = this.audioDataRightRef.slice(0, this.config.frameSize);
        return { left: waveformLeft, right: waveformRight };
      } else {
        return { left: waveformLeft, right: null };
      }
    }
    return null;
  }
}
