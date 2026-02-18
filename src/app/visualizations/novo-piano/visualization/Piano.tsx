import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { RootState } from '@react-three/fiber';
import { interpolation } from '../../../utils/ShaderUtils';

export interface PianoProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  intensity?: number;
}

export const Piano = ({ sampleProvider, width, height, intensity = 1.0 }: PianoProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = (rootState: RootState) => {
    updateSampleTexture();

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      intensity: { value: intensity },
      resolution: { value: [width, height] },
    };
  };

  return (
    <ShaderImage
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vPosition;

      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      uniform float intensity;
      uniform vec2 resolution;

      ${interpolation}

      bool getKeyState(float sampleX, float intensityMult, float areaStart, float areaEnd, float areaHeight, float uvY, float keyHeight) {
        vec2 sampleUv = vec2(sampleX, 0.0);
        float sampleValue = interpolation(sampleData, sampleUv, sampleDataSize).r;
        float keyOffset = intensityMult * sampleValue * 0.05;
        float keyStart = areaStart + keyOffset;
        float keyEnd = areaEnd + keyOffset;
        bool visible = uvY > keyStart && uvY < keyEnd;
        float keyY = (uvY - keyStart) / areaHeight;
        bool inKeyArea = visible && keyY > (1.0 - keyHeight);
        return inKeyArea;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = resolution.x / resolution.y;
        
        float keyAreaHeight = 0.15 * aspect;
        float keyAreaCenter = 0.5;
        float keyAreaStart = keyAreaCenter - keyAreaHeight / 2.0;
        float keyAreaEnd = keyAreaCenter + keyAreaHeight / 2.0;
        
        float whiteKeys = floor((sampleDataSize.x / 12.0) * 7.0 + 1.);
        
        // Normalize UV within key area (0 = top of keys, 1 = bottom)
        float keyY = (uv.y - keyAreaStart) / keyAreaHeight;
        float whiteKeyX = uv.x * whiteKeys;
        float whiteKeyIndex = floor(whiteKeyX);
        float whiteKeyPosition = fract(whiteKeyX);
        
        // Black keys
        float blackKeyX = whiteKeyX - 0.5;
        float blackKeyIndex = floor(blackKeyX);
        float blackKeyPosition = fract(blackKeyX);
        float distanceFromBlackCenter = abs(blackKeyPosition - 0.5);
        
        float blackKeyWidth = 0.6;
        float blackKeyHeight = 0.65;
        bool inBlackKeyX = distanceFromBlackCenter < (blackKeyWidth * 0.5);
        
        // Determine black key octave position for pattern
        float blackOctavePos = mod(blackKeyIndex, 7.0);
        bool validBlackKey = blackOctavePos != 2.0 && blackOctavePos != 6.0;
        // Don't draw black key if it's beyond the last white key
        validBlackKey = validBlackKey && blackKeyIndex < (whiteKeys - 1.0);
        inBlackKeyX = inBlackKeyX && validBlackKey;

        bool inWhiteKeyY = getKeyState(whiteKeyIndex/whiteKeys, -intensity * aspect, keyAreaStart, keyAreaEnd, keyAreaHeight, uv.y, 1.0);
        float gapSize = 0.02;
        bool isInGap = whiteKeyPosition < gapSize || whiteKeyPosition > (1.0 - gapSize);
        bool inWhiteKey =  !isInGap && inWhiteKeyY;

        bool inBlackKeyY = getKeyState(blackKeyIndex/whiteKeys, intensity * aspect, keyAreaStart, keyAreaEnd, keyAreaHeight, uv.y, blackKeyHeight);
        bool inBlackKey = inBlackKeyX && inBlackKeyY;
        
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        
        if (inBlackKey) {
          color = vec4(vec3(0.05, 0.05, 0.05), 1.0);
        } else if (inWhiteKey) {
          color = vec4(vec3(0.95, 0.95, 0.95), 1.0);
        }

        gl_FragColor = color;
      }`}
    />
  );
};
