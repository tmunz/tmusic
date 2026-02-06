import { useMemo } from 'react';
import { Data3DTexture, LinearFilter, LinearMipMapLinearFilter, RGBAFormat } from 'three';
import { random } from '../../../../utils/Random';

const cache = new Map<number, Data3DTexture>();

export const useNoise3D = (seed: number = 0): Data3DTexture => {
  return useMemo(() => {
    if (cache.has(seed)) {
      return cache.get(seed)!;
    }

    const size = 32;
    const data = new Uint8Array(size * size * size * 4);
    for (let i = 0; i < size * size * size; i++) {
      const stride = i * 4;
      data[stride] = random(seed + i * 4, 0, 255);
      data[stride + 1] = random(seed + i * 4 + 1, 0, 255);
      data[stride + 2] = random(seed + i * 4 + 2, 0, 255);
      data[stride + 3] = 255;
    }
    const texture = new Data3DTexture(data, size, size, size);
    texture.format = RGBAFormat;
    texture.minFilter = LinearMipMapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = 1000; // RepeatWrapping
    texture.wrapT = 1000; // RepeatWrapping
    texture.wrapR = 1000; // RepeatWrapping for Z axis
    texture.needsUpdate = true;

    cache.set(seed, texture);
    return texture;
  }, [seed]);
};
