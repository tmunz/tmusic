import { Settings, SettingType } from '../../settings/Setting';

export interface BaseAnalyzerSettingTypes {
  sampleSize?: number;
  sampleRate?: number;
  stereo?: boolean;
}

const DEFAULT_ANALYZER_CONFIG: BaseAnalyzerSettingTypes = {
  sampleSize: 1,
  sampleRate: 60,
  stereo: false,
};

export abstract class BaseAnalyzerConfig {
  protected config: Record<string, any>;

  constructor(config: Partial<BaseAnalyzerSettingTypes> = {}) {
    this.config = { ...DEFAULT_ANALYZER_CONFIG, ...config };
  }

  get sampleSize(): number {
    return this.config.sampleSize;
  }

  get sampleRate(): number {
    return this.config.sampleRate;
  }

  get stereo(): boolean {
    return this.config.stereo;
  }

  abstract get frameSize(): number;
  abstract get audioAnalyser(): string;

  protected get commonSettings(): Settings {
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
        value: this.config.sampleSize,
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
        value: this.config.sampleRate,
      },
      stereo: {
        id: 'stereo',
        name: 'Stereo',
        description: 'Analyze left and right channels separately.',
        type: SettingType.BOOLEAN,
        value: this.config.stereo,
      },
    };
  }

  abstract settings(): Settings;
}
