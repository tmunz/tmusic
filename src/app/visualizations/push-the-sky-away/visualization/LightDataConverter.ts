import { SampleProvider } from '../../../sampleProvider/SampleProvider';

export function convertLightData(sampleProvider?: SampleProvider) {
  if (!sampleProvider) return new Float32Array();
  const result = new Float32Array(sampleProvider.sampleSize * sampleProvider.frameSize);
  for (let i = 0; i < sampleProvider.frameSize; i++) {
    const frequency: number[] = sampleProvider.samples.map(sample => sample[i]);
    const sortedFrequency: number[] = [...frequency].sort((a, b) => b - a);
    const max = sortedFrequency[0];
    const min = sortedFrequency[sortedFrequency.length - 1];
    const spread = max - min;
    for (let j = 0; j < sampleProvider.sampleSize; j++) {
      const value = spread > 0 ? (frequency[j] - min) / spread : 0;
      result[j * sampleProvider.frameSize + i] = value;
    }
  }
  return result;
}
