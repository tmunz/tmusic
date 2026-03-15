import { Channel, SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { interpolation } from '../../../utils/ShaderUtils';

export interface WaveformSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  channel: Channel;
  strokeWidth?: number;
}

export const WaveformScene = ({
  width,
  height,
  sampleProvider,
  channel,
  strokeWidth = 2.5,
}: WaveformSceneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(
    sampleProvider,
    sp => sp?.flat(channel) ?? new Uint8Array()
  );

  const getUniforms = () => {
    updateSampleTexture();

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      strokeWidth: { value: strokeWidth },
    };
  };

  return <ShaderImage
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
        uniform float strokeWidth;

        ${interpolation}

        void main() {
          vec2 uv = vUv;
          float a = 0.;
          float h = .9;
          float lines = sampleDataSize.y;
          float distance = h / lines;
          float lineWidth = strokeWidth / vSize.y;

          for (float i = 1.; i <= lines; i++) {
            float currLine = lines - i; // from top to bottom
            float value = interpolation(sampleData, vec2(uv.x, currLine/lines), sampleDataSize).r * max(1. / lines, (1. - h));
            float d = uv.y - value - currLine * distance;
            float onePixel = 1.0 / vSize.y;
            float halfWidth = lineWidth * 0.5;
            float lineAlpha = 1.0 - smoothstep(halfWidth - onePixel, halfWidth + onePixel, abs(d));
            a += lineAlpha;
          }
          gl_FragColor = vec4(vec3(1.), a);
        }
      `}
    />;
};
