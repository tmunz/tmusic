import { Settings, SettingType } from '../../settings/Setting';

export interface BaseAnalyzerSettingTypes {
  sampleSize?: number;
  sampleRate?: number;
  stereo?: boolean;
}

const DEFAULT_ANALYZER_SETTINGS: BaseAnalyzerSettingTypes = {
  sampleSize: 1,
  sampleRate: 60,
  stereo: false,
};

export abstract class BaseAnalyzerSettings {
  protected settings: Record<string, any>;

  constructor(settings: Partial<BaseAnalyzerSettingTypes> = {}) {
    this.settings = { ...DEFAULT_ANALYZER_SETTINGS, ...settings };
  }

  protected abstract getId(): string;

  protected createCommonSettings(): Settings {
    return {
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
        value: this.settings.sampleSize,
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
        value: this.settings.sampleRate,
      },
      stereo: {
        id: 'stereo',
        name: 'Stereo',
        description: 'Analyze left and right channels separately.',
        type: SettingType.BOOLEAN,
        value: this.settings.stereo,
      },
    };
  }

  abstract build(): Settings;
}
