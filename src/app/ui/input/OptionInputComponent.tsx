import './NumberInputComponent.css';
import { InputProps } from './InputProps';

export interface OptionInputProps extends InputProps<string> {
  params?: {
    options?: string[];
  };
}

export const OptionInputComponent = (props: OptionInputProps) => {
  const options = props.params?.options as string[] | undefined;

  if (!options || options.length === 0) {
    return null;
  }

  const currentIndex = options.findIndex(option => option === props.value);
  const selectedOption = options[currentIndex] || options[0];

  return (
    <div className="number-input">
      <label htmlFor={props.id}>
        {props.name}: {selectedOption}
      </label>
      <input
        id={props.id}
        type="range"
        value={currentIndex}
        onChange={e => props.onChange?.(options[parseInt(e.target.value, 10)])}
        min={0}
        max={options.length - 1}
        step={1}
      />
    </div>
  );
};
