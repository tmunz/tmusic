import { useRef } from 'react';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { interpolation } from '../../../utils/ShaderUtils';

export interface CatProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const Cat = ({ width, height, sampleProvider }: CatProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);
  const { current: imageUrls } = useRef({
    image: require('./karpatenhund_3_cat_full_orig.png'),
    imageFlat: require('./karpatenhund_3_cat_full_flat.png'),
  });

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      sampleDataAvg: { value: sampleProvider.getAvg()[0] / 255 },
      samplesActive: { value: sampleProvider.active ? 1 : 0 },
    };
  };

  return (
    <ShaderImage
      imageUrls={imageUrls}
      objectFit="contain"
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
        precision mediump float;

        uniform sampler2D image;
        uniform sampler2D imageFlat;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float sampleDataAvg;
        uniform int samplesActive;
        in vec2 vUv;
  
        ${interpolation}

        float shapeFactor (float x) {
          return (cos(12. * x) / 3.0 + .5) * (0.8 - x / 2.) + 0.1;
        }

        void main() {
          vec4 color;
          vec2 uv = vUv;

          if (samplesActive == 0) {
            color = texture(image, uv);
          } else {
            float baseY = 0.1;
            float avgFactor = 0.1;
            float dataX0 = 0.0;
            float dataX1 = 1.0;
            float dataY0 = 0.5;
            float dataY1 = 1.0;
            if (dataX0 <= uv.x && uv.x <= dataX1 && dataY0 <= uv.y) {
              float dataWidth = dataX1 - dataX0;
              float dataHeight = dataY1 - dataY0;
              vec2 correctedUv = (uv - vec2(dataX0, dataY0)) / vec2(dataWidth, dataHeight);
              
              vec4 sampleColor = interpolation(sampleData, correctedUv, sampleDataSize);

              uv.y -= sampleColor.r * dataHeight * shapeFactor(uv.x) * correctedUv.y;
              // color = vec4(vec3(sampleColor.r), 1.0);
            }

            uv.y -= sampleDataAvg * clamp(uv.y - baseY, 0., dataY0 - baseY) * avgFactor;
            color = texture(imageFlat, uv);
          }
          gl_FragColor = color;
        }
      `}
    />
  );
};
