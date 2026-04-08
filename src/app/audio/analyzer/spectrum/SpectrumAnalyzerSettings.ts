import { Setting, Settings, SettingType } from '../../../settings/Setting';
import { getAnalyzerModeSetting } from '../AnalyzerModeSetting';
import { BaseAnalyzerSettings, BaseAnalyzerSettingTypes } from '../AnalyzerSettings';


export interface SpectrumAnalyzerSettingTypes extends BaseAnalyzerSettingTypes {
  frameSize?: number;
  minFrequency?: number;
  maxFrequency?: number;
  chromaticScale?: boolean;
  spectralContrastBoost?: number;
}

const DEFAULT_SPECTRUM_ANALYZER_SETTINGS: SpectrumAnalyzerSettingTypes = {
  frameSize: 32,
  minFrequency: 20,
  maxFrequency: 10000,
  chromaticScale: false,
  spectralContrastBoost: 0,
};

export class SpectrumAnalyzerSettings extends BaseAnalyzerSettings {

  constructor(settings: Partial<SpectrumAnalyzerSettingTypes> = {}) {
    super({ ...DEFAULT_SPECTRUM_ANALYZER_SETTINGS, ...settings });
  }

  protected getId(): string {
    return 'spectrum';
  }

  build(): Settings {
    const commonSettings = this.createCommonSettings();
    const analyzerModeSetting = getAnalyzerModeSetting(this.getId());
    const spectrumSettings: Settings = {
      frameSize: {
        id: 'frameSize',
        name: 'Frequency Bands',
        description: 'The number of frequency bands per frame.',
        type: SettingType.NUMBER,
        params: {
          min: 1,
          max: 4096,
          step: 1,
        },
        value: this.settings.frameSize,
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
        value: this.settings.minFrequency,
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
        value: this.settings.maxFrequency,
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
        value: this.settings.spectralContrastBoost,
      },
      chromaticScale: {
        id: 'chromaticScale',
        name: 'Chromatic Scale',
        description: 'Map frequency bands to chromatic scale (musical notes).',
        type: SettingType.BOOLEAN,
        value: this.settings.chromaticScale,
      },
    };

    Object.values(spectrumSettings).forEach((setting: Setting<any>) => {
      setting.isVisible = (settings) => settings.audioAnalyser?.value === this.getId();
    });

    return {
      ...commonSettings,
      ...analyzerModeSetting,
      ...spectrumSettings,
    };
  }
}
