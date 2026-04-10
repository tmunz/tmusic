import { Setting, Settings, SettingType } from '../../../settings/Setting';
import { getAnalyzerModeSetting } from '../AnalyzerModeSetting';
import { BaseAnalyzerConfig, BaseAnalyzerSettingTypes } from '../AnalyzerConfig';

export interface SpectrumAnalyzerSettingTypes extends BaseAnalyzerSettingTypes {
  frequencyBands?: number;
  minFrequency?: number;
  maxFrequency?: number;
  chromaticScale?: boolean;
  spectralContrastBoost?: number;
}

const DEFAULT_SPECTRUM_ANALYZER_CONFIG: SpectrumAnalyzerSettingTypes = {
  frequencyBands: 32,
  minFrequency: 20,
  maxFrequency: 10000,
  chromaticScale: false,
  spectralContrastBoost: 0,
};

export class SpectrumAnalyzerConfig extends BaseAnalyzerConfig {
  constructor(settings: Partial<SpectrumAnalyzerSettingTypes> = {}) {
    super({ ...DEFAULT_SPECTRUM_ANALYZER_CONFIG, ...settings });
  }

  get audioAnalyser(): string {
    return 'spectrum';
  }

  get frameSize(): number {
    return this.frequencyBands;
  }

  get frequencyBands(): number {
    return this.config.frequencyBands;
  }

  get minFrequency(): number {
    return this.config.minFrequency;
  }

  get maxFrequency(): number {
    return this.config.maxFrequency;
  }

  get chromaticScale(): boolean {
    return this.config.chromaticScale;
  }

  get spectralContrastBoost(): number {
    return this.config.spectralContrastBoost;
  }

  settings(): Settings {
    const analyzerModeSetting = getAnalyzerModeSetting(this.audioAnalyser);
    const spectrumSettings: Settings = {
      frequencyBands: {
        id: 'frequencyBands',
        name: 'Frequency Bands',
        description: 'The number of frequency bands per frame.',
        type: SettingType.NUMBER,
        params: {
          min: 1,
          max: 4096,
          step: 1,
        },
        value: this.config.frequencyBands,
      },
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
        value: this.config.minFrequency,
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
        value: this.config.maxFrequency,
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
        value: this.config.spectralContrastBoost,
      },
      chromaticScale: {
        id: 'chromaticScale',
        name: 'Chromatic Scale',
        description: 'Map frequency bands to chromatic scale (musical notes).',
        type: SettingType.BOOLEAN,
        value: this.config.chromaticScale,
      },
    };

    Object.values(spectrumSettings).forEach((setting: Setting<any>) => {
      setting.isVisible = settings => settings.audioAnalyser?.value === this.audioAnalyser;
    });

    return {
      ...this.commonSettings,
      ...analyzerModeSetting,
      ...spectrumSettings,
    };
  }
}
