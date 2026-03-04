import { useRef } from 'react';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { interpolation } from '../../../utils/ShaderUtils';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';

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

      void main() {
        vec2 uv = vUv * 0.9 + .05;
        
        float f = intensity * .05;
        float r = texture2D(image, vec2(uv.x, uv.y + f * interpolation(sampleData, vec2(uv.y / 3., uv.x), sampleDataSize).r)).r;
        float g = texture2D(image, vec2(uv.x - f * interpolation(sampleData, vec2(1./3. + uv.y / 3., uv.x), sampleDataSize).r, uv.y)).g;
        float b = texture2D(image, vec2(uv.x, uv.y - f * interpolation(sampleData, vec2(2./3. + uv.y / 3., uv.x), sampleDataSize).r)).b;
        
        vec4 color = vec4(r, g, b, 1.);
        
        gl_FragColor = color;
      }`}
    />
  );
};
