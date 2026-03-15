import { useRef } from 'react';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { interpolation } from '../../../utils/ShaderUtils';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';

export interface RisingHorseProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  intensity?: number;
}

export const RisingHorse = ({ width, height, sampleProvider, intensity }: RisingHorseProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const { current: imageUrls } = useRef({
    image: require('./rising-horse.jpg'),
  });

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      intensity: { value: intensity },
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
      varying vec2 vUv;

      uniform sampler2D image;
      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      uniform float intensity;

      ${interpolation}

      vec4 sampleChannel(vec2 uv, vec2 dataUv, float sectionOffset, vec2 direction, float f) {
        float sampleValue = interpolation(sampleData, vec2(sectionOffset + dataUv.y / 3., dataUv.x), sampleDataSize).r;
        vec2 displacedUv = uv + direction * f * sampleValue;
        return texture2D(image, displacedUv);
      }

      void main() {
        vec2 imageUv = vUv * 0.9 + .05;
        vec2 dataUv = vUv;

        float f = intensity * .05;
        float r = sampleChannel(imageUv, dataUv, 0./3., vec2(0.0, 1.0), f).r;
        float g = sampleChannel(imageUv, dataUv.yx, 1./3., vec2(-1.0, 0.0), f).g;
        float b = sampleChannel(imageUv, dataUv, 2./3., vec2(0.0, -1.0), f).b;
        
        vec4 color = vec4(r, g, b, 1.);
        
        gl_FragColor = color;
      }`}
    />
  );
};
