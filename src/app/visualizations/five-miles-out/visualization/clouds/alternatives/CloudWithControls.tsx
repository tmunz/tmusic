import { useControls } from 'leva';
import { Cloud } from '@react-three/drei';

export const CloudWithControls = () => {
  const {
    x,
    y,
    z,
    rx,
    ry,
    rz,
    scale,
    seed,
    segments,
    bounds,
    concentrate,
    volume,
    smallestVolume,
    growth,
    speed,
    fade,
    opacity,
    color,
  } = useControls('Cloud Settings', {
    // Position
    x: { value: 0, min: -50, max: 50, step: 0.1 },
    y: { value: 0, min: -2000, max: 2000, step: 0.1 },
    z: { value: -20, min: -3000, max: 50, step: 1 },

    rx: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    ry: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rz: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },

    // Cloud Shape
    scale: { value: 1, min: 0.1, max: 1000, step: 0.1 },
    seed: { value: 1, min: 0, max: 100, step: 1 },
    segments: { value: 20, min: 5, max: 50, step: 1 },

    // Cloud Distribution
    bounds: { value: [3, 2, 3], min: 0.1, max: 10, step: 0.1 },
    concentrate: { value: 'inside', options: ['random', 'inside', 'outside'] },

    // Cloud Volume
    volume: { value: 1, min: 0.1, max: 20, step: 0.1 },
    smallestVolume: { value: 0.25, min: 0.1, max: 5, step: 0.1 },

    // Cloud Growth
    growth: { value: 5, min: 1, max: 20, step: 1 },

    // Animation
    speed: { value: 0.1, min: 0, max: 2, step: 0.01 },
    fade: { value: 10, min: 0, max: 100, step: 1 },

    // Appearance
    opacity: { value: 0.6, min: 0, max: 1, step: 0.01 },
    color: '#ffffff',
  });

  return (
    <Cloud
      position={[x, y, z]}
      rotation={[rx, ry, rz]}
      scale={scale}
      opacity={opacity}
      color={color}
      speed={speed}
      segments={segments}
      seed={seed}
      bounds={bounds}
      concentrate={concentrate as any}
      volume={volume}
      smallestVolume={smallestVolume}
      growth={growth}
      fade={fade}
    />
  );
};
