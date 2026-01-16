import { Grid } from '@react-three/drei';
import { GridSparks } from './GridSparks';

interface TronGridProps {
  position: [number, number, number];
  size: number;
  sectionSize?: number;
  cellColor?: string;
  sectionColor?: string;
  fadeDistance?: number;
  sparksCount?: number;
  sparksSpeed?: number;
  sparksTurnProbability?: number;
  sparkColor?: string;
  enableSparks?: boolean;
}

export const TronGrid = ({
  position,
  size,
  sectionSize = 5,
  cellColor = '#000000',
  sectionColor = '#00dddd',
  sparkColor = '#00d6d6',
  fadeDistance = 100,
  sparksCount = 5,
  sparksSpeed = 0.2,
  sparksTurnProbability = 0.1,
  enableSparks = true,
}: TronGridProps) => {
  return (
    <>
      <Grid
        args={[size, size]}
        sectionSize={sectionSize}
        position={position}
        cellColor={cellColor}
        sectionColor={sectionColor}
        fadeDistance={fadeDistance}
        fadeStrength={5}
        cellThickness={0}
        sectionThickness={2}
      />
      {enableSparks && (
        <GridSparks
          gridSize={size}
          gridPosition={position}
          count={sparksCount}
          color={sparkColor}
          speed={sparksSpeed}
          cellSize={sectionSize}
          turnProbability={sparksTurnProbability}
        />
      )}
    </>
  );
};
