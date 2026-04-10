import './NumberInputComponent.css';
import { InputProps } from './InputProps';

export interface NumberInputProps extends InputProps<number> {
  params?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export const NumberInputComponent = (props: NumberInputProps) => {
  return (
    <div className="number-input">
      <label htmlFor={props.id}>
        {props.name}: {props.value}
      </label>
      <input
        id={props.id}
        type="range"
        value={props.value}
        onChange={e => props.onChange?.(+e.target.value)}
        min={props.params?.min}
        max={props.params?.max}
        step={props.params?.step}
      />
    </div>
  );
};
