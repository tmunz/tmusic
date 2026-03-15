import { Settings, SettingType } from '../settings/Setting';

export interface SampleSettingTypes {
  sampleSize?: number;
  frameSize?: number;
  sampleRate?: number;
  stereo?: boolean;
  waveform?: boolean;
  
  minFrequency?: number;
  maxFrequency?: number;
  chromaticScale?: boolean;
  spectralContrastBoost?: number;
}

const DEFAULT_SPECTRUM_SETTINGS: SampleSettingTypes = {
  sampleSize: 1,
  frameSize: 32,
  sampleRate: 60,
  stereo: false,
  minFrequency: 20,
  maxFrequency: 10000,
  chromaticScale: false,
  spectralContrastBoost: 0,
};

const DEFAULT_WAVEFORM_SETTINGS: SampleSettingTypes = {
  sampleSize: 1,
  frameSize: 2048,
  sampleRate: 60,
  stereo: false,
};

export const createSampleSettings = (settings: SampleSettingTypes = DEFAULT_SPECTRUM_SETTINGS): Settings => {
  const isWaveform = settings.waveform;
  const defaults = isWaveform ? DEFAULT_WAVEFORM_SETTINGS : DEFAULT_SPECTRUM_SETTINGS;
  
  const commonSettings: Settings = {
    waveform: {
      id: 'waveform',
      name: 'Waveform Mode',
      description: 'Analysis mode: 0 Frequency (spectrum) or Waveform (time-domain).',
      type: SettingType.BOOLEAN,
      value: settings.waveform,
    },
    frameSize: {
      id: 'frameSize',
      name: isWaveform ? 'Waveform Samples' : 'Frequency Bands',
      description: isWaveform 
        ? 'The number of waveform samples per frame.'
        : 'The number of frequency bands per frame.',
      type: SettingType.NUMBER,
      params: {
        min: 1,
        max: 4096,
        step: 1,
      },
      value: settings.frameSize ?? defaults.frameSize,
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
      value: settings.sampleSize ?? defaults.sampleSize,
    },
    sampleRate: {
      id: 'sampleRate',
      name: 'Sample Rate',
      description: 'The rate at which samples are taken (Hz).',
      type: SettingType.NUMBER,
      params: {
        min: 1,
        max: 60,
        step: 1,
      },
      value: settings.sampleRate ?? defaults.sampleRate,
    },
    stereo: {
      id: 'stereo',
      name: 'Stereo',
      description: 'Analyze left and right channels separately.',
      type: SettingType.BOOLEAN,
      value: settings.stereo,
    },
  };

  if (isWaveform) {
    return commonSettings;
  } else {
    return {
      ...commonSettings,
      minFrequency: {
        id: 'minFrequency',
        name: 'Min Frequency',
        description: 'The minimum frequency to analyze (Hz).',
        type: SettingType.NUMBER,
        params: {
          min: 0,
          max: 22000,
          step: 0.1,
        },
        value: settings.minFrequency ?? DEFAULT_SPECTRUM_SETTINGS.minFrequency,
      },
      maxFrequency: {
        id: 'maxFrequency',
        name: 'Max Frequency',
        description: 'The maximum frequency to analyze (Hz).',
        type: SettingType.NUMBER,
        params: {
          min: 0,
          max: 22050,
          step: 0.1,
        },
        value: settings.maxFrequency ?? DEFAULT_SPECTRUM_SETTINGS.maxFrequency,
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
        value: settings.spectralContrastBoost ?? DEFAULT_SPECTRUM_SETTINGS.spectralContrastBoost,
      },
      chromaticScale: {
        id: 'chromaticScale',
        name: 'Chromatic Scale',
        description: 'Map frequency bands to chromatic scale (musical notes).',
        type: SettingType.BOOLEAN,
        value: settings.chromaticScale,
      },
    };
  }
};
