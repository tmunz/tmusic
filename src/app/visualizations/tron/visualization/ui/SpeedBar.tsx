import './SpeedBar.css';
import { useTronStore } from '../state/TronStore';

interface SpeedBarProps {
  color: string;
  width?: number;
}

export const SpeedBar = ({ color, width = 200 }: SpeedBarProps) => {
  const userCharacter = useTronStore(state => state.getUserCharacter());

  if (!userCharacter) return null;

  const { actual, target, min, max } = userCharacter.vehicle.speed;
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
