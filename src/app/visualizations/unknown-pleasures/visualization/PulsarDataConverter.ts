import { SampleProvider } from '../../../sampleProvider/SampleProvider';

export type PulsarData = { value: number; sampleIndex: number };

export interface IntensitySettings {
  baseIntensity: number;
  sampleWeight: number;
  dominatingWeight: number;
}

export function convertPulsarData(
  sampleProvider?: SampleProvider,
  intensitySettings: IntensitySettings = {
    baseIntensity: 0.3,
    sampleWeight: 0.3,
    dominatingWeight: 0.4,
  }
): Uint8Array {
  if (!sampleProvider) return new Uint8Array();
  const result = new Uint8Array(sampleProvider.sampleSize * sampleProvider.frameSize);
  for (let i = 0; i < sampleProvider.frameSize; i++) {
    const frequency: PulsarData[] = sampleProvider.samples.map((sample, sampleIndex) => ({
      value: sample[i],
      sampleIndex,
    }));
    const sortedFrequency: PulsarData[] = [...frequency].sort((a, b) => b.value - a.value);
    const dominatingSampleRelevance = calculateRelevance(
      sortedFrequency[0].sampleIndex,
      sampleProvider.sampleSize,
      Math.min(6, sampleProvider.sampleSize)
    );

    const max = sortedFrequency[0].value;
    const min = sortedFrequency[sortedFrequency.length - 1].value;
    const relativeOffCenter = 0.25 + 0.5 * (max / 255);
    const resultFrequency = rearrange(sortedFrequency, relativeOffCenter);
    for (let j = 0; j < sampleProvider.sampleSize; j++) {
      const normalized = (resultFrequency[j].value - min) / Math.max(max - min, 1); // increase difference by moving baseline to min
      const sampleWeight = getWeight(j / sampleProvider.sampleSize); // fall off towards the edges
      const sampleRelevance = calculateRelevance(
        sortedFrequency[j].sampleIndex,
        sampleProvider.sampleSize,
        Math.min(6, sampleProvider.sampleSize)
      );
      const frequencyWeight = (max * Math.exp(normalized * 3)) / Math.exp(3); // emphasize high values
      const intensity =
        intensitySettings.baseIntensity +
        intensitySettings.sampleWeight * sampleRelevance +
        intensitySettings.dominatingWeight * dominatingSampleRelevance;
      const raw = normalized * sampleWeight * frequencyWeight * intensity;
      const clamped = Math.min(255, Math.max(0, Math.round(raw)));
      result[j * sampleProvider.frameSize + i] = clamped;
    }
  }
  return result;
}

function rearrange(arr: PulsarData[], relativeOffset = 0.5): PulsarData[] {
  const centerSortedFrequency: PulsarData[] = new Array(arr.length);
  arr.forEach((e, j) => {
    const pos = Math.floor(arr.length * relativeOffset) + (j % 2 === 0 ? Math.floor(j / 2) : -Math.floor(j / 2) - 1);
    centerSortedFrequency[(arr.length + pos) % arr.length] = e;
  });
  return centerSortedFrequency;
}

function calculateRelevance(n: number, length: number, threshold: number): number {
  if (n < 0 || n >= length) return 0;
  const relativeX = n / length;
  const fallStart = threshold / length;
  if (relativeX <= fallStart) {
    return Math.sin((relativeX / fallStart) * (Math.PI / 2));
  }
  return Math.cos(((relativeX - fallStart) / (1 - fallStart)) * (Math.PI / 2));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3.0 - 2.0 * t);
}

function getWeight(x: number): number {
  const p = Math.min(x, 1 - x);
  return 0.1 * smoothstep(-0.3, 0.3, p) + smoothstep(0.25, 0.35, p);
}
