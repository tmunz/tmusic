import { Setting, Settings, SettingType } from '../../settings/Setting';
import { SpectrumAnalyzerConfig } from './spectrum/SpectrumAnalyzerConfigs';
import { WaveformAnalyzerConfig } from './waveform/WaveformAnalyzerConfig';

export const getAnalyzerModeSetting = (id: string): Record<'audioAnalyser', Setting<string>> => ({
  audioAnalyser: {
    id: 'analysisMode',
    name: 'Analysis Mode',
    description: 'Select the type of analysis to perform',
    type: SettingType.OPTION,
    params: {
      options: ['spectrum', 'waveform'],
    },
    value: id,
    onApply: (newValue: string, allSettings: Settings) => {
      const getDefaults = (analyzerType: string): Partial<Settings> => {
        if (analyzerType === 'spectrum') {
          return new SpectrumAnalyzerConfig().settings();
        } else if (analyzerType === 'waveform') {
          return new WaveformAnalyzerConfig().settings();
        }
        return {};
      };

      const settings = getDefaults(newValue);
      const settingsToAdd: Partial<Settings> = {};

      Object.keys(settings).forEach(key => {
        if (!(key in allSettings) || key === 'frameSize') {
          const setting = settings[key];
          settingsToAdd[key] = setting;
        }
      });

      return settingsToAdd;
    },
  },
});
