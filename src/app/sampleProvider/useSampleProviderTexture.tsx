import { useEffect, useState } from 'react';
import { SampleProvider } from './SampleProvider';
import { DataTexture, RedFormat, FloatType } from 'three';

export const useSampleProviderTexture = (
  sampleProvider?: SampleProvider,
  getData: (sampleProvider?: SampleProvider) => Float32Array = sp => sp?.flat() ?? new Float32Array(),
  getWidth: (sampleProvider?: SampleProvider) => number = sp => sp?.frameSize ?? 0,
  getHeight: (sampleProvider?: SampleProvider) => number = sp => sp?.sampleSize ?? 0
): [DataTexture, () => void] => {
  const [sampleTexture, setSampleTexture] = useState<DataTexture>(
    new DataTexture(new Float32Array(1), 1, 1, RedFormat, FloatType)
  );

  useEffect(() => {
    const width = getWidth(sampleProvider);
    const height = getHeight(sampleProvider);
    if (
      sampleProvider &&
      width > 0 &&
      height > 0 &&
      (width !== sampleTexture.image.width || height !== sampleTexture.image.height)
    ) {
      setSampleTexture(new DataTexture(getData(sampleProvider), width, height, RedFormat, FloatType));
    }
  }, [sampleProvider?.frameSize, sampleProvider?.sampleSize]);

  const applyToSampleTexture = () => {
    if (!sampleProvider) return;
    const width = getWidth(sampleProvider);
    const height = getHeight(sampleProvider);
    if (width > 0 && height > 0) {
      Object.assign(sampleTexture.image, { data: getData(sampleProvider), width, height });
      sampleTexture.needsUpdate = true;
    }
  };

  return [sampleTexture, applyToSampleTexture];
};
