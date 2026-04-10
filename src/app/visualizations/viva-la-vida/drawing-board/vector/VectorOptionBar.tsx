import '../OptionBar.css';
import { NumberInputComponent } from '../../../../ui/input/NumberInputComponent';

export interface VectorOptionBarProps {
  angleThreshold: number;
  onAngleThresholdChange: (value: number) => void;
}

export const VectorOptionBar = ({ angleThreshold, onAngleThresholdChange }: VectorOptionBarProps) => {
  return (
    <div className="vector-option-bar option-bar">
      <NumberInputComponent
        id="angle-threshold"
        name="Angle Threshold (degrees)"
        description="Higher values create smoother paths with fewer vectors"
        value={angleThreshold}
        onChange={onAngleThresholdChange}
        params={{ min: 0, max: 180, step: 5 }}
      />
    </div>
  );
};
