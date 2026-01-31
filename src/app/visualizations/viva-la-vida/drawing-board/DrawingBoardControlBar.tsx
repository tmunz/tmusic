import './DrawingBoardControlBar.css';

interface DrawingBoardControlBarProps {
  onApplyToVisualization: () => void;
  onClear: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  showTrail: boolean;
  onTrailToggle: (show: boolean) => void;
  showAnimation: boolean;
  onAnimationToggle: (show: boolean) => void;
  backgroundOpacity: number;
  onBackgroundOpacityChange: (opacity: number) => void;
}

export const DrawingBoardControlBar = ({
  onApplyToVisualization,
  onClear,
  animationSpeed,
  onSpeedChange,
  showTrail,
  onTrailToggle,
  showAnimation,
  onAnimationToggle,
  backgroundOpacity,
  onBackgroundOpacityChange,
}: DrawingBoardControlBarProps) => {
  return (
    <div className="drawing-boardcontrol-bar">
      <label>
        Background:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={backgroundOpacity}
          onChange={e => onBackgroundOpacityChange(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Speed: {animationSpeed.toFixed(1)}x
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={animationSpeed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
        />
      </label>
      <label>
        <input type="checkbox" checked={showTrail} onChange={e => onTrailToggle(e.target.checked)} />
        Show Trail
      </label>
      <label>
        <input type="checkbox" checked={showAnimation} onChange={e => onAnimationToggle(e.target.checked)} />
        Show Animation
      </label>
      <button onClick={onClear} className="secondary-button">
        Clear
      </button>
      <button onClick={onApplyToVisualization} className="primary-button">
        Apply to Visualization
      </button>
    </div>
  );
};
