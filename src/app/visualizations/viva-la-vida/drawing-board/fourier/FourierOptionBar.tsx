import '../OptionBar.css';
import { NumberInputComponent } from '../../../../ui/input/NumberInputComponent';
import { BooleanInputComponent } from '../../../../ui/input/BooleanInputComponent';

export interface FourierOptionBarProps {
  harmonics: number;
  onHarmonicsChange: (value: number) => void;
  reverseDirection: boolean;
  onReverseDirectionToggle: (value: boolean) => void;
}

export const FourierOptionBar = ({
  harmonics,
  onHarmonicsChange,
  reverseDirection,
  onReverseDirectionToggle,
}: FourierOptionBarProps) => {
  return (
    <div className="fourier-option-bar option-bar">
      <NumberInputComponent
        id="harmonics"
        name="Harmonics"
        description="Number of harmonics"
        value={harmonics}
        onChange={onHarmonicsChange}
        params={{ min: 3, max: 100, step: 1 }}
      />
      <BooleanInputComponent
        id="reverse-direction"
        name="Reverse direction"
        description="Reverse direction"
        value={reverseDirection}
        onChange={onReverseDirectionToggle}
      />
    </div>
  );
};
