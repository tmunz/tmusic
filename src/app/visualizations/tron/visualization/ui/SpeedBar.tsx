
import { useTronState } from '../state/TronContext';
import './SpeedBar.css';

interface SpeedBarProps {
  color: string;
  width?: number;
}

export const SpeedBar = ({ color, width = 200 }: SpeedBarProps) => {
  const { getUserCharacter } = useTronState();
  const userChar = getUserCharacter();

  if (!userChar) return null;

  const { actual, target, min, max } = userChar.vehicle.speed;
  const actualPercentage = Math.max(0, Math.min(1, (actual - min) / (max - min))) * 100;
  const targetPercentage = Math.max(0, Math.min(1, (target - min) / (max - min))) * 100;

  return (
    <div className="speed-bar" style={{ width: `${width}px`, borderColor: color }}>
      <div
        className="speed-bar-fill"
        style={{
          width: `${actualPercentage}%`,
          backgroundColor: color,
        }}
      />

      <div
        className="speed-bar-target"
        style={{
          left: `${targetPercentage}%`,
        }}
      />
    </div>
  );
};
