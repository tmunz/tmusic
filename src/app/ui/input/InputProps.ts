export interface InputProps<T> {
  id: string;
  name: string;
  description: string;
  params?: Record<string, any>;
  value: T;
  onChange?: (newValue: T) => void;
}
