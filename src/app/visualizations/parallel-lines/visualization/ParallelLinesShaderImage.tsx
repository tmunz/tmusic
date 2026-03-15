import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';

export interface ParallelLinesShaderImageProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const ParallelLinesShaderImage = ({ sampleProvider, width, height }: ParallelLinesShaderImageProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
    };
  };

  return (
    <ShaderImage
      objectFit="cover"
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
      precision mediump float;
      varying vec2 vUv;

      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      
      float interpolate(sampler2D tex, float x, float y, vec2 size) {
        float yPixel = y * size.y;
        float y0 = floor(yPixel);
        float y1 = y0 + 1.0;
        float t = fract(yPixel);
        
        float val0 = texture2D(tex, vec2(x, y0 / size.y)).r;
        float val1 = texture2D(tex, vec2(x, y1 / size.y)).r;
        
        return mix(val0, val1, t);
      }

      float getTotalSum(float y, vec2 size) {
        float totalSum = 0.0;
        for (float i = 0.0; i < size.x; i += 1.0) {
          float sx = (i + 0.5) / size.x;
          totalSum += interpolate(sampleData, sx, y, size);
        }
        return totalSum;
      }

      float getCumulativePosition(float bandIndex, float y, vec2 size, float totalSum) {
        float cumulativePos = 0.0;
        for (float i = 0.0; i < bandIndex; i += 1.0) {
          float sx = (i + 0.5) / size.x;
          float value = interpolate(sampleData, sx, y, size);
          float proportionalWidth = totalSum > 0.0 ? value / totalSum : 1.0 / size.x;
          cumulativePos += proportionalWidth;
        }
        return cumulativePos;
      }

      void main() {
        vec2 uv = vUv;
        float numBands = sampleDataSize.x;
        float targetX = uv.x;
        
        float totalSum = getTotalSum(uv.y, sampleDataSize);
        
        int foundBandIndex = 0;
        int low = 0;
        int high = int(numBands) - 1;
        
        // Binary search - 1024 max number of bands supported: log2(1024) = 10
        for(int i = 0; i <= 10; i++) {
          if(high <= low) break;
          
          int mid = (low + high) / 2;
          float cumulativePos = getCumulativePosition(float(mid + 1), uv.y, sampleDataSize, totalSum);
          
          if(targetX <= cumulativePos) {
            high = mid;
          } else {
            low = mid + 1;
          }
        }
        
        foundBandIndex = low;
        
        float bandStart = getCumulativePosition(float(foundBandIndex), uv.y, sampleDataSize, totalSum);
        float bandEnd = getCumulativePosition(float(foundBandIndex + 1), uv.y, sampleDataSize, totalSum);
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
