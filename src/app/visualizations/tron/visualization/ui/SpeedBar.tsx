import './SpeedBar.css';

interface SpeedBarProps {
  actual: number;
  target: number;
  min: number;
  max: number;
  color: string;
}

export const SpeedBar = ({ actual, target, min, max, color }: SpeedBarProps) => {
  const actualPercentage = ((actual - min) / (max - min)) * 100;
  const targetPercentage = ((target - min) / (max - min)) * 100;

  return (
    <div className="speed-bar-container">
      <div className="speed-bar-track">
        <div
          className="speed-bar-fill"
          style={{
            width: `${actualPercentage}%`,
            backgroundColor: color,
          }}
        />
        <div
          className="speed-bar-target-line"
          style={{
            left: `${targetPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};
