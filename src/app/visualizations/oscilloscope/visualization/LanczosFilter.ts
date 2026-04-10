/**
 * Lanczos filter for smoothing oscilloscope samples
 * Migrated from Oscilloscope_old.js Filter object
 */
export class LanczosFilter {
  private bufferSize: number;
  private a: number;
  private steps: number;
  private radius: number;
  private nSmoothedSamples: number;
  private allSamples: Float32Array;
  private K: Float32Array;
  private lanczosTweak: number = 1.5;

  constructor(bufferSize: number, a: number, steps: number) {
    this.bufferSize = bufferSize;
    this.a = a;
    this.steps = steps;
    this.radius = a * steps;
    this.nSmoothedSamples = this.bufferSize * this.steps + 1;
    this.allSamples = new Float32Array(2 * this.bufferSize);
    this.K = new Float32Array(this.radius);
    this.createLanczosKernel();
  }

  /**
   * Creates the Lanczos kernel for filtering
   * Original from Filter.createLanczosKernel
   */
  private createLanczosKernel(): void {
    this.K[0] = 1;
    for (let i = 1; i < this.radius; i++) {
      const piX = (Math.PI * i) / this.steps;
      const sinc = Math.sin(piX) / piX;
      const window = (this.a * Math.sin(piX / this.a)) / piX;
      this.K[i] = sinc * Math.pow(window, this.lanczosTweak);
    }
  }

  /**
   * Generates smoothed samples using Lanczos interpolation
   * Original from Filter.generateSmoothedSamples
   */
  generateSmoothedSamples(oldSamples: Float32Array, samples: Float32Array, smoothedSamples: Float32Array): void {
    const bufferSize = this.bufferSize;
    const allSamples = this.allSamples;
    const nSmoothedSamples = this.nSmoothedSamples;
    const a = this.a;
    const steps = this.steps;
    const K = this.K;

    // Copy old and new samples into single buffer
    for (let i = 0; i < bufferSize; i++) {
      allSamples[i] = oldSamples[i];
      allSamples[bufferSize + i] = samples[i];
    }

    const pStart = bufferSize - 2 * a;
    const pEnd = pStart + bufferSize;
    let i = 0;

    // Generate interpolated samples
    for (let position = pStart; position < pEnd; position++) {
      // First sample at this position (no interpolation)
      smoothedSamples[i] = allSamples[position];
      i += 1;

      // Interpolated samples between this and next position
      for (let r = 1; r < steps; r++) {
        let smoothedSample = 0;
        for (let s = -a + 1; s < a; s++) {
          const sample = allSamples[position + s];
          const kernelPosition = -r + s * steps;
          if (kernelPosition < 0) {
            smoothedSample += sample * K[-kernelPosition];
          } else {
            smoothedSample += sample * K[kernelPosition];
          }
        }
        smoothedSamples[i] = smoothedSample;
        i += 1;
      }
    }

    // Final sample
    smoothedSamples[nSmoothedSamples - 1] = allSamples[2 * bufferSize - 2 * a];
  }

  /**
   * Get the number of smoothed samples that will be generated
   */
  getSmoothedSampleCount(): number {
    return this.nSmoothedSamples;
  }

  /**
   * Get the interpolation steps factor
   */
  getSteps(): number {
    return this.steps;
  }
}
