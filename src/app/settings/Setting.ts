import { InputProps } from '../ui/input/InputProps';

export enum SettingType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  OPTION = 'option',
  EXTERNAL = 'external',
}

export interface Setting<T> extends InputProps<T> {
  type: SettingType;
  isVisible?: (allSettings: Settings) => boolean;
  onApply?: (newValue: T, allSettings: Settings) => Partial<Settings> | void;
}

export type Settings = Record<string, Setting<any>>;
