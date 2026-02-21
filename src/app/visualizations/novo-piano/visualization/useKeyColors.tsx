import { useMemo } from 'react';
import { random } from '../../../utils/Random';

export const useKeyColors = (keyCount: number, colorGradient: number, colorSparks: number) => {
  const getGradientColor = (t: number): [number, number, number, number] => {
    t = Math.max(0, Math.min(1, t));

    const colorStops = [
      [255, 255, 120], // Yellow
      [255, 80, 80], // Red
      [80, 40, 140], // Purple
      [140, 170, 220], // Light Blue
      [0, 80, 150], // Dark Blue
      [0, 150, 150], // Turquoise/Cyan
      [0, 120, 100], // Dark Green
      [150, 190, 20], // Light Green
    ];

    const segments = colorStops.length - 1;
    const segment = t * segments;
    const index = Math.floor(segment);
    const localT = segment - index;

    if (index >= segments) {
      return [...colorStops[segments], 255] as [number, number, number, number];
    }

    const c1 = colorStops[index];
    const c2 = colorStops[index + 1];

    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * localT),
      Math.round(c1[1] + (c2[1] - c1[1]) * localT),
      Math.round(c1[2] + (c2[2] - c1[2]) * localT),
      255,
    ];
  };

  return useMemo(() => {
    const colors = new Uint8ClampedArray(keyCount * 4);

    const gradientKeyCount = Math.floor(keyCount * colorGradient);

    for (let i = 0; i < gradientKeyCount; i++) {
      const t = i / Math.max(1, gradientKeyCount - 1);
      const [r, g, b, a] = getGradientColor(t);
      const offset = i * 4;
      colors[offset] = r;
      colors[offset + 1] = g;
      colors[offset + 2] = b;
      colors[offset + 3] = a;
    }

    for (let i = gradientKeyCount; i < keyCount; i++) {
      const offset = i * 4;
      const randomValue = random(i + 42);
      if (randomValue < colorSparks) {
        const offset = i * 4;
        colors[offset] = Math.floor(random(i * 4) * 256);
        colors[offset + 1] = Math.floor(random(i * 4 + 1) * 256);
        colors[offset + 2] = Math.floor(random(i * 4 + 2) * 256);
        colors[offset + 3] = 255;
      } else {
        colors[offset] = 0;
        colors[offset + 1] = 0;
        colors[offset + 2] = 0;
        colors[offset + 3] = 0;
      }
    }

    return colors;
  }, [keyCount, colorGradient, colorSparks]);
};
