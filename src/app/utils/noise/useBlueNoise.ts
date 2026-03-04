import { useMemo } from 'react';
import { Texture, TextureLoader } from 'three';

export const useBlueNoise = (): Texture => {
  return useMemo(() => {
    const loader = new TextureLoader();
    const texture = loader.load(require('./blue-noise.png'));
    return texture;
  }, []);
};
