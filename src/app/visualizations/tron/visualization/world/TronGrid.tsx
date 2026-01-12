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
  sectionColor = '#002222',
  sparkColor = '#00aaaa',
  fadeDistance = 100,
  sparksCount = 5,
  sparksSpeed = 0.2,
  sparksTurnProbability = 0.1,
  enableSparks = true,
}: TronGridProps) => {
  return (
    <>
      <mesh position={[position[0], position[1] - 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>
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
