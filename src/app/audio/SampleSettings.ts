import { Settings, SettingType } from '../settings/Setting';

export const createSampleSettings = (
  frequencyBands = 32,
  sampleSize = 1,
  minFrequency = 10,
  maxFrequency = 10000,
  chromaticScale = false,
  spectralContrastBoost = 0
): Settings => ({
  frequencyBands: {
    id: 'frequencyBands',
    name: 'Frequency Bands',
    description: 'The number of frequency bands to analyze.',
    type: SettingType.NUMBER,
    params: {
      min: 1,
      max: 1024,
      step: 1,
    },
    value: frequencyBands,
  },
  sampleSize: {
    id: 'sampleSize',
    name: 'Sample Size',
    description: 'The number of samples to keep in the queue.',
    type: SettingType.NUMBER,
    params: {
      min: 1,
      max: 500,
      step: 1,
    },
    value: sampleSize,
  },
  minFrequency: {
    id: 'minFrequency',
    name: 'Min Frequency',
    description: 'The minimum frequency to analyze.',
    type: SettingType.NUMBER,
    params: {
      min: 0,
      max: 22000,
      step: 0.1,
    },
    value: minFrequency,
  },
  maxFrequency: {
    id: 'maxFrequency',
    name: 'Max Frequency',
    description: 'The maximum frequency to analyze.',
    type: SettingType.NUMBER,
    params: {
      min: 0,
      max: 22050,
      step: 0.1,
    },
    value: maxFrequency,
  },
  spectralContrastBoost: {
    id: 'spectralContrastBoost',
    name: 'Spectral Contrast Boost',
    description:
      'Reduces lower volume frequencies to make higher frequencies stand out more prominently (0 = no change, 1 = maximum boost).',
    type: SettingType.NUMBER,
    params: {
      min: 0,
      max: 1,
      step: 0.01,
    },
    value: spectralContrastBoost,
  },
  chromaticScale: {
    id: 'chromaticScale',
    name: 'Chromatic Scale',
    description: 'Map frequency bands to chromatic scale (musical notes).',
    type: SettingType.NUMBER, // TODO change to boolean
    params: {
      min: 0,
      max: 1,
      step: 1,
    },
    value: chromaticScale ? 1 : 0,
  },
});

export default createSampleSettings();
