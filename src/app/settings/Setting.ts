export enum SettingType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  OPTION = 'option',
  EXTERNAL = 'external',
}

export interface Setting<T> {
  id: string;
  name: string;
  description: string;
  type: SettingType;
  params?: Record<string, any>;
  value: T;
  isVisible?: (allSettings: Settings) => boolean;
  onChange?: (newValue: T, allSettings: Settings) => Partial<Settings> | void;
}

export type Settings = Record<string, Setting<any>>;
