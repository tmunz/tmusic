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
    sp => sp?.flat(channel) ?? new Float32Array()
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
          float h = 0.6;
          float lines = sampleDataSize.y;
          float distance = h / lines;
          float lineWidth = strokeWidth / vSize.y;

          for (float i = 1.; i <= lines; i++) {
            float currLine = lines - i; // from top to bottom
            // Convert waveform from -1 to 1 range to 0 to 1 range
            float rawValue = interpolation(sampleData, vec2(uv.x, currLine/lines), sampleDataSize).r;
            float value = (rawValue * 0.5 + 0.5) * max(1. / lines, (1. - h));
            float lineY = value + currLine * distance;
            
            // Calculate gradient for perpendicular distance
            float dx = 1.0 / sampleDataSize.x;
            float rawValuePrev = interpolation(sampleData, vec2(uv.x - dx, currLine/lines), sampleDataSize).r;
            float valuePrev = (rawValuePrev * 0.5 + 0.5) * max(1. / lines, (1. - h));
            float rawValueNext = interpolation(sampleData, vec2(uv.x + dx, currLine/lines), sampleDataSize).r;
            float valueNext = (rawValueNext * 0.5 + 0.5) * max(1. / lines, (1. - h));
            float gradient = (valueNext - valuePrev) / (2.0 * dx);
            
            // Perpendicular distance accounting for line angle
            float verticalDist = uv.y - lineY;
            float perpDist = abs(verticalDist) / sqrt(1.0 + gradient * gradient);
            
            float onePixel = 1.0 / vSize.y;
            float lineAlpha = 1.0 - smoothstep(lineWidth * 0.5 - onePixel, lineWidth * 0.5 + onePixel, perpDist);
            a += lineAlpha;
          }
          gl_FragColor = vec4(vec3(1.), a);
        }
      `}
    />;
};
