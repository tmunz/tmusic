import './NumberInputComponent.css';
import { InputProps } from './InputProps';

export interface BooleanInputProps extends InputProps<boolean> {}

export const BooleanInputComponent = (props: BooleanInputProps) => {
  return (
    <div className="number-input">
      <label htmlFor={props.id}>
        {props.name}: {props.value ? 'ON' : 'OFF'}
      </label>
      <input
        id={props.id}
        type="range"
        value={props.value ? 1 : 0}
        onChange={e => props.onChange?.(e.target.value === '1')}
        min={0}
        max={1}
        step={1}
      />
    </div>
  );
};
