import { Setting, Settings, SettingType } from "../../settings/Setting";
import { SpectrumAnalyzerSettings } from "./spectrum/SpectrumAnalyzerSettings";
import { WaveformAnalyzerSettings } from "./waveform/WaveformAnalyzerSettings";

export const getAnalyzerModeSetting = (id: string): Record<'audioAnalyser', Setting<string>> => ({
  audioAnalyser: {
    id: 'analysisMode',
    name: 'Analysis Mode',
    description: 'Select the type of analysis to perform',
    type: SettingType.OPTION,
    params: {
      options: ['spectrum', 'waveform']
    },
    value: id,
    onChange: (newValue: string, allSettings: Settings) => {
      const getDefaults = (analyzerType: string): Partial<Settings> => {
        if (analyzerType === 'spectrum') {
          return new SpectrumAnalyzerSettings().build();
        } else if (analyzerType === 'waveform') {
          return new WaveformAnalyzerSettings().build();
        }
        return {};
      };

      const defaults = getDefaults(newValue);
      const settingsToAdd: Partial<Settings> = {};

      Object.keys(defaults).forEach(key => {
        if (!(key in allSettings) || key === 'frameSize') {
          const setting = defaults[key];
          settingsToAdd[key] = setting;
        }
      });

      return settingsToAdd;
    },
  }
});