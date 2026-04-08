import { Setting } from './Setting';

export interface OptionSetting extends Setting<number> {
  params: {
    options: string[];
  };
}
