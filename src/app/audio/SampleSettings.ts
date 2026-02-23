import { Settings, SettingType } from '../settings/Setting';

export interface SampleSettingTypes {
  frequencyBands?: number;
  sampleSize?: number;
  sampleRate?: number;
  minFrequency?: number;
  maxFrequency?: number;
  chromaticScale?: boolean;
  spectralContrastBoost?: number;
}

const DEFAULT_SAMPLE_SETTINGS: SampleSettingTypes = {
  frequencyBands: 32,
  sampleSize: 1,
  sampleRate: 60,
  minFrequency: 10,
  maxFrequency: 10000,
  chromaticScale: false,
  spectralContrastBoost: 0,
};

export const createSampleSettings = (settings: SampleSettingTypes = DEFAULT_SAMPLE_SETTINGS): Settings => ({
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
    value: settings.frequencyBands ?? DEFAULT_SAMPLE_SETTINGS.frequencyBands,
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
    value: settings.sampleSize ?? DEFAULT_SAMPLE_SETTINGS.sampleSize,
  },
  sampleRate: {
    id: 'sampleRate',
    name: 'Sample Rate',
    description: 'The rate at which samples are taken.',
    type: SettingType.NUMBER,
    params: {
      min: 1,
      max: 60,
      step: 1,
    },
    value: settings.sampleRate ?? DEFAULT_SAMPLE_SETTINGS.sampleRate,
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
    value: settings.minFrequency ?? DEFAULT_SAMPLE_SETTINGS.minFrequency,
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
    value: settings.maxFrequency ?? DEFAULT_SAMPLE_SETTINGS.maxFrequency,
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
    value: settings.spectralContrastBoost ?? DEFAULT_SAMPLE_SETTINGS.spectralContrastBoost,
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
    value: settings.chromaticScale ? 1 : 0,
  },
});
