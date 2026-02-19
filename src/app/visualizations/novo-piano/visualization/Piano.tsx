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
      referenceNoteIndex: { value: sampleProvider.referenceNoteIndex },
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
      uniform float referenceNoteIndex;

      ${interpolation}

      // Map white key position in octave (0-6) to chromatic offset (0,2,4,5,7,9,11)
      // White keys: C  D  E  F  G  A  B
      // Chromatic:  0  2  4  5  7  9  11
      float whiteKeyToChromaticOffset(float whiteKeyInOctave) {
        if (whiteKeyInOctave >= 6.0) return 11.0;      // B
        else if (whiteKeyInOctave >= 5.0) return 9.0;  // A
        else if (whiteKeyInOctave >= 4.0) return 7.0;  // G
        else if (whiteKeyInOctave >= 3.0) return 5.0;  // F
        else if (whiteKeyInOctave >= 2.0) return 4.0;  // E
        else if (whiteKeyInOctave >= 1.0) return 2.0;  // D
        else return 0.0;                               // C
      }
      
      // Map chromatic position (0-11) to white key position in octave (0-6)
      float chromaticToWhiteKeyOffset(float chromaticPos) {
        if (chromaticPos >= 11.0) return 6.0;      // B
        else if (chromaticPos >= 9.0) return 5.0;  // A
        else if (chromaticPos >= 7.0) return 4.0;  // G
        else if (chromaticPos >= 5.0) return 3.0;  // F
        else if (chromaticPos >= 4.0) return 2.0;  // E
        else if (chromaticPos >= 2.0) return 1.0;  // D
        else return 0.0;                           // C
      }

      float getWhiteKeyChromaticPos(float keyIndex, float startChromaticNote) {
        float whiteKeyOctavePos = mod(keyIndex, 7.0);
        float chromaticOffset = whiteKeyToChromaticOffset(whiteKeyOctavePos);
        return mod(startChromaticNote + chromaticOffset, 12.0);
      }
      
      float sampleIndexToWhiteKeyIndex(float sampleIndex) {
        float octaves = floor(sampleIndex / 12.0);
        float chromaticPos = mod(sampleIndex, 12.0);
        float whiteKeyInOctave = chromaticToWhiteKeyOffset(chromaticPos);
        return octaves * 7.0 + whiteKeyInOctave;
      }
      
      float whiteKeyIndexToSampleIndex(float whiteKeyIndex, float startChromaticNote) {
        float octaves = floor(whiteKeyIndex / 7.0);
        float keyInOctave = mod(whiteKeyIndex, 7.0);
        float chromaticOffset = whiteKeyToChromaticOffset(keyInOctave);
        float chromaticPosFromStart = octaves * 12.0 + chromaticOffset;
        return chromaticPosFromStart + startChromaticNote;
      }

      bool getKeyState(float sampleX, float intensityMult, float areaStart, float areaEnd, float areaHeight, float uvY, float keyHeight) {
        vec2 sampleUv = vec2(sampleX, 0.0);
        float sampleValue = texture(sampleData, sampleUv).r;
        float keyOffset = intensityMult * sampleValue * 0.1;
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
    
        float startChromaticNote = mod(9.0 - mod(referenceNoteIndex, 12.0), 12.0);
        
        // Black keys exist after white keys at chromatic positions: 0(C#), 2(D#), 5(F#), 7(G#), 9(A#)
        // No black key after E(4) or B(11)
        float chromaticPos = getWhiteKeyChromaticPos(blackKeyIndex, startChromaticNote);
        bool validBlackKey = chromaticPos != 4.0 && chromaticPos != 11.0;
        
        // Don't draw black key if it's beyond the last white key or before the first white key
        validBlackKey = validBlackKey && blackKeyIndex >= 0.0 && blackKeyIndex < (whiteKeys - 1.0);
        inBlackKeyX = inBlackKeyX && validBlackKey;

        // Convert white key index to sample index for correct data mapping
        float whiteSampleIndex = whiteKeyIndexToSampleIndex(whiteKeyIndex, startChromaticNote);
        float whiteSampleX = mod(whiteSampleIndex, sampleDataSize.x) / sampleDataSize.x;
        
        bool inWhiteKeyY = getKeyState(whiteSampleX, -intensity * aspect, keyAreaStart, keyAreaEnd, keyAreaHeight, uv.y, 1.0);
        float gapSize = 0.02;
        bool isInGap = whiteKeyPosition < gapSize || whiteKeyPosition > (1.0 - gapSize);
        bool inWhiteKey =  !isInGap && inWhiteKeyY;

        // For black keys, calculate the chromatic position between two white keys
        float blackSampleIndex = whiteKeyIndexToSampleIndex(blackKeyIndex, startChromaticNote) + 1.0;
        float blackSampleX = mod(blackSampleIndex, sampleDataSize.x) / sampleDataSize.x;
        
        bool inBlackKeyY = getKeyState(blackSampleX, intensity * aspect, keyAreaStart, keyAreaEnd, keyAreaHeight, uv.y, blackKeyHeight);
        bool inBlackKey = inBlackKeyX && inBlackKeyY;
        
        /////////////////////////////////////////////////////////
        // Calculate reference keys for coloring
        float referenceWhiteKey = sampleIndexToWhiteKeyIndex(referenceNoteIndex); // A4
        float cBelowReference = sampleIndexToWhiteKeyIndex(referenceNoteIndex - 8.0); // C4
        
        // Check if current white key is a reference key
        bool isReferenceKey = abs(whiteKeyIndex - referenceWhiteKey) < 0.5;
        bool isCKey = abs(whiteKeyIndex - cBelowReference) < 0.5;
        /////////////////////////////////////////////////////////
        
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        
        // Debug: Show sample values in y 0.9-1.0 range
        // if (uv.y >= 0.9 && uv.y <= 1.0) {
        //   vec2 sampleUv = vec2(uv.x, 0.0);
        //   float debugValue = texture(sampleData, sampleUv).r;
        //   color = vec4(vec3(debugValue), 1.0);
        // }
        
        if (inBlackKey) {
          color = vec4(vec3(0.05, 0.05, 0.05), 1.0);
        } else if (inWhiteKey) {
          if (isReferenceKey) {
            color = vec4(0.0, 0.8, 0.0, 1.0); // Green for A4
          } else if (isCKey) {
            color = vec4(0.8, 0.0, 0.0, 1.0); // Red for C
          } else {
            color = vec4(vec3(0.95, 0.95, 0.95), 1.0);
          }
        }

        gl_FragColor = color;
      }`}
    />
  );
};
