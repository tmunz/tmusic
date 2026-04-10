import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, NormalBlending } from 'three';

export const OscilloscopeGrid = ({ intensity = 1.0 }: { intensity?: number }) => {
  const gridMesh = useMemo(() => {
    const gridGeometry = new BufferGeometry();
    const gridPositions: number[] = [];

    const step = 0.1;

    for (let i = 0; i <= 10; i++) {
      const pos = -1 + i * 2 * step;

      gridPositions.push(pos, -1, 0, pos, 1, 0);
      gridPositions.push(-1, pos, 0, 1, pos, 0);

      if (i !== 0 && i !== 10) {
        for (let j = 0; j <= 50; j++) {
          const t = -1 + (j * 2 * step) / 5;

          const d = i == 5 ? 0.2 : 0.08;
          gridPositions.push(t, pos - step * d, 0, t, pos + step * d, 0);
          gridPositions.push(pos - step * d, t, 0, pos + step * d, t, 0);
        }
      }
    }

    gridGeometry.setAttribute('position', new Float32BufferAttribute(gridPositions, 3));

    const gridMaterial = new LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: intensity,
      blending: NormalBlending,
    });

    return new LineSegments(gridGeometry, gridMaterial);
  }, [intensity]);

  return <primitive object={gridMesh} renderOrder={1} />;
};
