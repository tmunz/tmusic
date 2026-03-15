export enum SettingType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  EXTERNAL = 'external',
}

export interface Setting<T> {
  id: string;
  name: string;
  description: string;
  type: SettingType;
  params?: Record<string, any>;
  value: T;
}

export type Settings = Record<string, Setting<any>>;
