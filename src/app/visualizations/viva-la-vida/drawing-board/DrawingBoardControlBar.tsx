import './OptionBar.css';
import { NumberInputComponent } from '../../../ui/input/NumberInputComponent';
import { BooleanInputComponent } from '../../../ui/input/BooleanInputComponent';
import { Button } from '../../../ui/button/Button';

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
    <div className="drawing-board-control-bar option-bar">
      <NumberInputComponent
        id="background-opacity"
        name="Background"
        description="Background opacity"
        value={backgroundOpacity}
        onChange={onBackgroundOpacityChange}
        params={{ min: 0, max: 1, step: 0.1 }}
      />
      <NumberInputComponent
        id="animation-speed"
        name="Speed"
        description="Animation speed"
        value={animationSpeed}
        onChange={onSpeedChange}
        params={{ min: 0.1, max: 10, step: 0.1 }}
      />
      <BooleanInputComponent
        id="show-trail"
        name="Show Trail"
        description="Show trail"
        value={showTrail}
        onChange={onTrailToggle}
      />
      <BooleanInputComponent
        id="show-animation"
        name="Show Animation"
        description="Show animation"
        value={showAnimation}
        onChange={onAnimationToggle}
      />
      <Button onClick={onClear}>Clear</Button>
      <Button onClick={onApplyToVisualization}>Apply to Visualization</Button>
    </div>
  );
};
