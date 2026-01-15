import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { DataTexture, FloatType, LinearFilter, RedFormat } from 'three';
import { useEffect, useState } from 'react';

export interface ParallelLinesShaderImageProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const ParallelLinesShaderImage = ({ sampleProvider, width, height }: ParallelLinesShaderImageProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);
  
  const [cumulativeTexture, setCumulativeTexture] = useState<DataTexture>(
    new DataTexture(new Float32Array(1), 1, 1, RedFormat, FloatType)
  );

  const getCumulativePositions = (sp: SampleProvider): Float32Array => {
    const numBands = sp.frequencyBands;
    const sampleSize = sp.sampleSize;
    const result = new Float32Array(numBands * sampleSize);
    const samples = sp.samples;
    
    for (let y = 0; y < sampleSize; y++) {
      let totalFreqValue = 0;
      for (let x = 0; x < numBands; x++) {
        totalFreqValue += samples[y][x];
      }
      
      let cumulativePosition = 0;
      for (let x = 0; x < numBands; x++) {
        const freqValue = samples[y][x];
        const proportionalWidth = totalFreqValue > 0 ? freqValue / totalFreqValue : 1.0 / numBands;
        cumulativePosition += proportionalWidth;
        
        result[y * numBands + x] = x === numBands - 1 ? 1.0 : cumulativePosition;
      }
    }
    
    return result;
  };

  useEffect(() => {
    if (
      sampleProvider &&
      (sampleProvider.frequencyBands !== cumulativeTexture.image.width ||
        sampleProvider.sampleSize !== cumulativeTexture.image.height)
    ) {
      setCumulativeTexture(
        new DataTexture(
          getCumulativePositions(sampleProvider),
          sampleProvider.frequencyBands,
          sampleProvider.sampleSize,
          RedFormat,
          FloatType
        )
      );
    }
  }, [sampleProvider?.frequencyBands, sampleProvider?.sampleSize]);

  const updateCumulativeTexture = () => {
    if (!sampleProvider) return;
    Object.assign(cumulativeTexture.image, {
      data: getCumulativePositions(sampleProvider),
      width: sampleProvider.frequencyBands,
      height: sampleProvider.sampleSize,
    });
    cumulativeTexture.needsUpdate = true;
  };

  const getUniforms = () => {
    updateSampleTexture();
    updateCumulativeTexture();
    return {
      cumulativeDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      cumulativeData: { value: cumulativeTexture },
    };
  };

  return (
    <ShaderImage
      objectFit="cover"
      width={width}
      height={height}
      getUniforms={getUniforms}
      imageFilter={LinearFilter}
      fragmentShader={`
      precision mediump float;
      varying vec2 vUv;

      uniform sampler2D cumulativeData;
      uniform vec2 cumulativeDataSize;
      
      float interpolate(sampler2D tex, float x, float y, vec2 size) {
        float yPixel = y * size.y;
        float y0 = floor(yPixel);
        float y1 = y0 + 1.0;
        float t = fract(yPixel);
        
        float val0 = texture2D(tex, vec2(x, y0 / size.y)).r;
        float val1 = texture2D(tex, vec2(x, y1 / size.y)).r;
        
        return mix(val0, val1, t);
      }

      void main() {
        vec2 uv = vUv;
        float numBands = cumulativeDataSize.x;
        float targetX = uv.x;
        
        int foundBandIndex = 0;
        int low = 0;
        int high = int(numBands) - 1;
        
        // 1024 max number of bands supported: log2(1024) = 10
        for(int i = 0; i <= 10; i++) {
          if(high <= low) break;
          
          int mid = (low + high) / 2;
          float sx = (float(mid) + 0.5) / numBands;
          float cumulativePos = interpolate(cumulativeData, sx, uv.y, cumulativeDataSize);
          
          if(targetX <= cumulativePos) {
            high = mid;
          } else {
            low = mid + 1;
          }
        }
        
        foundBandIndex = low;
        
        float bandStart = 0.0;
        if(foundBandIndex > 0) {
          float prevSx = (float(foundBandIndex - 1) + 0.5) / numBands;
          bandStart = interpolate(cumulativeData, prevSx, uv.y, cumulativeDataSize);
        }
        
        float sx = (float(foundBandIndex) + 0.5) / numBands;
        float bandEnd = interpolate(cumulativeData, sx, uv.y, cumulativeDataSize);
        float bandWidth = bandEnd - bandStart;
        
        float finalBandIndex = float(foundBandIndex);
        if(bandWidth > 0.001) {
          float posInBand = (targetX - bandStart) / bandWidth;
          finalBandIndex = float(foundBandIndex) + posInBand;
        }
        
        float barColor = mod(floor(finalBandIndex), 2.0);
        vec4 color = vec4(barColor, barColor, barColor, 1.0);
        gl_FragColor = color;
      }`}
    />
  );
};
