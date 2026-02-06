export interface VectorOptionBarProps {
  angleThreshold: number;
  onAngleThresholdChange: (value: number) => void;
}

export const VectorOptionBar = ({ angleThreshold, onAngleThresholdChange }: VectorOptionBarProps) => {
  return (
    <div className="vector-option-bar">
      <label>
        Angle Threshold (degrees):
        <input
          type="number"
          min="0"
          max="180"
          step="5"
          value={angleThreshold}
          onChange={e => onAngleThresholdChange(parseInt(e.target.value))}
        />
      </label>
      <span className="hint">Higher values create smoother paths with fewer vectors</span>
    </div>
  );
};
