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
    <div className="fourier-option-bar">
      <label>
        Harmonics:
        <input
          type="number"
          min="3"
          max="100"
          value={harmonics}
          onChange={e => onHarmonicsChange(parseInt(e.target.value))}
        />
      </label>
      <label>
        <input type="checkbox" checked={reverseDirection} onChange={e => onReverseDirectionToggle(e.target.checked)} />
        Reverse direction
      </label>
    </div>
  );
};
