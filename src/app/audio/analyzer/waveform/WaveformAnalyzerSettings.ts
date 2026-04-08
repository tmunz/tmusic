import { Setting, Settings, SettingType } from '../../../settings/Setting';
import { getAnalyzerModeSetting } from '../AnalyzerModeSetting';
import { BaseAnalyzerSettings, BaseAnalyzerSettingTypes } from '../AnalyzerSettings';

export interface WaveformAnalyzerSettingTypes extends BaseAnalyzerSettingTypes {
  frameSize?: number;
}

const DEFAULT_WAVEFORM_ANALYZER_SETTINGS: WaveformAnalyzerSettingTypes = {
  frameSize: 735, // 60 samples at 44.1kHz
};

export class WaveformAnalyzerSettings extends BaseAnalyzerSettings {

  constructor(settings: Partial<WaveformAnalyzerSettingTypes> = {}) {
    super({ ...DEFAULT_WAVEFORM_ANALYZER_SETTINGS, ...settings });
  }

  protected getId(): string {
    return 'waveform';
  }

  build(): Settings {
    const commonSettings = this.createCommonSettings();
    const analyzerModeSetting = getAnalyzerModeSetting(this.getId());
    const waveformSettings: Settings = {
      frameSize: {
        id: 'frameSize',
        name: 'Waveform Samples',
        description: 'The number of waveform samples per frame.',
        type: SettingType.NUMBER,
        params: {
          min: 1,
          max: 4096,
          step: 1,
        },
        value: this.settings.frameSize,
      },
    };

    Object.values(waveformSettings).forEach((setting: Setting<any>) => {
      setting.isVisible = (settings) => settings.audioAnalyser?.value === this.getId();
    });

    return {
      ...commonSettings,
      ...analyzerModeSetting,
      ...waveformSettings,
    };
  }
}
