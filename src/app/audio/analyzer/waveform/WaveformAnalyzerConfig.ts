import { Setting, Settings, SettingType } from '../../../settings/Setting';
import { getAnalyzerModeSetting } from '../AnalyzerModeSetting';
import { BaseAnalyzerConfig, BaseAnalyzerSettingTypes } from '../AnalyzerConfig';

export interface WaveformAnalyzerSettingTypes extends BaseAnalyzerSettingTypes {
  waveformSamples?: number;
}

const DEFAULT_WAVEFORM_ANALYZER_CONFIG: WaveformAnalyzerSettingTypes = {
  waveformSamples: 735, // 60 samples at 44.1kHz
};

export class WaveformAnalyzerConfig extends BaseAnalyzerConfig {
  constructor(settings: Partial<WaveformAnalyzerSettingTypes> = {}) {
    super({ ...DEFAULT_WAVEFORM_ANALYZER_CONFIG, ...settings });
  }

  get audioAnalyser(): string {
    return 'waveform';
  }

  get frameSize(): number {
    return this.waveformSamples;
  }

  get waveformSamples(): number {
    return this.config.waveformSamples;
  }

  settings(): Settings {
    const analyzerModeSetting = getAnalyzerModeSetting(this.audioAnalyser);
    const waveformSettings: Settings = {
      waveformSamples: {
        id: 'waveformSamples',
        name: 'Waveform Samples',
        description: 'The number of waveform samples per frame',
        type: SettingType.NUMBER,
        params: {
          min: 1,
          max: 4096,
          step: 1,
        },
        value: this.config.waveformSamples,
      },
    };

    Object.values(waveformSettings).forEach((setting: Setting<any>) => {
      setting.isVisible = settings => settings.audioAnalyser?.value === this.audioAnalyser;
    });

    return {
      ...this.commonSettings,
      ...analyzerModeSetting,
      ...waveformSettings,
    };
  }
}
