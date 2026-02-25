import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { convertPulsarData, IntensitySettings } from './PulsarDataConverter';
import { interpolation } from '../../../utils/ShaderUtils';

export interface PulsarProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  intensitySettings: IntensitySettings;
}

export const Pulsar = ({ width, height, sampleProvider, intensitySettings }: PulsarProps) => {

  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(
    sampleProvider,
    (sp) => convertPulsarData(sp, intensitySettings)
  );

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
    };
  };

  return (
    <ShaderImage
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
        precision highp float;

        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;
        
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;

        ${interpolation}

        void main() {
          vec2 uv = vUv;
          float a = 0.;
          float h = .9;
          float lines = sampleDataSize.x;
          float distance = h / (lines - 1.);
          float strokeWidth = 2.5 / vSize.y;

          for (float i = 1.; i <= lines; i++) {
            float currLine = lines - i; // from top to bottom
            float value = interpolation(sampleData, vec2(currLine/lines, uv.x), sampleDataSize).r * (1. - h);
            float d = uv.y - value - currLine * distance;
            a += min(1. - smoothstep(strokeWidth * .5, strokeWidth, d), 1.); // upper line edge
            a *= smoothstep(0., strokeWidth * .5, d); // lower line edge and mask
          }
          gl_FragColor = vec4(vec3(1.), a);
        }
      `}
    />
  );
};
