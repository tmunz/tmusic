import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { RootState } from '@react-three/fiber';
import { interpolation } from '../../../utils/ShaderUtils';
import { useKeyColors } from './useKeyColors';
import { useMemo } from 'react';
import { DataTexture, RGBAFormat, UnsignedByteType } from 'three';

export interface PianoProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  intensity?: number;
  colorGradient?: number;
  colorSparks?: number;
  perspective?: number;
  debug?: boolean;
}

export const Piano = ({
  sampleProvider,
  width,
  height,
  intensity = 1.0,
  colorGradient = 0.0,
  colorSparks = 0.0,
  perspective = 0.0,
  debug = false,
}: PianoProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const keyColors = useKeyColors(sampleProvider.frequencyBands, colorGradient, colorSparks);

  const keyColorTexture = useMemo(() => {
    const texture = new DataTexture(keyColors, keyColors.length / 4, 1, RGBAFormat, UnsignedByteType);
    texture.needsUpdate = true;
    return texture;
  }, [keyColors]);

  const getUniforms = (rootState: RootState) => {
    updateSampleTexture();

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      intensity: { value: intensity },
      referenceNoteIndex: { value: sampleProvider.referenceNoteIndex },
      colorGradient: { value: colorGradient },
      colorSparks: { value: colorSparks },
      perspective: { value: perspective },
      keyColor: { value: keyColorTexture },
      debug: { value: debug },
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
      varying vec2 vSize;

      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      uniform float intensity;
      uniform float referenceNoteIndex;
      uniform float colorGradient;
      uniform float colorSparks;
      uniform float perspective;
      uniform sampler2D keyColor;
      uniform bool debug;
      
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
      
      float sampleIndexToWhiteKeyIndex(float sampleIndex, float startChromaticNote) {
        float absoluteChromatic = sampleIndex + startChromaticNote;
        float octaves = floor(absoluteChromatic / 12.0);
        float chromaticPos = mod(absoluteChromatic, 12.0);
        float whiteKeyInOctave = chromaticToWhiteKeyOffset(chromaticPos);
        float startWhiteKeyOffset = chromaticToWhiteKeyOffset(startChromaticNote);
        return octaves * 7.0 + whiteKeyInOctave - startWhiteKeyOffset;
      }
      
      float whiteKeyIndexToSampleIndex(float whiteKeyIndex, float startChromaticNote) {
        float startWhiteKeyOffset = chromaticToWhiteKeyOffset(startChromaticNote);
        float adjustedWhiteKeyIndex = whiteKeyIndex + startWhiteKeyOffset;
        float octaves = floor(adjustedWhiteKeyIndex / 7.0);
        float keyInOctave = mod(adjustedWhiteKeyIndex, 7.0);
        float chromaticOffset = whiteKeyToChromaticOffset(keyInOctave);
        float absoluteChromatic = octaves * 12.0 + chromaticOffset;
        return absoluteChromatic - startChromaticNote;
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
        // padding
        vec2 uv = vec2(-0.1 + vUv.x * 1.2, vUv.y);

        // perspective transformation (division creates straight lines to vanishing point)
        float p = 1.0 + perspective * (1. - uv.y);
        uv.x = 0.5 + (uv.x - 0.5) / p;
        uv = vec2(
          uv.x = 0.5 + (uv.x - 0.5) / p / (1. - perspective * 0.6),
          pow(uv.y, 1.0 + perspective * 0.2) + perspective * 0.3
        );
        
        // limit to piano area
        if (uv.x < 0.0 || uv.x > 1.0) {
          gl_FragColor = vec4(0.0);
          return;
        }
        
        float aspect = vSize.x / vSize.y;
        
        float keyAreaHeight = 0.14 * aspect;
        float keyAreaCenter = 0.5;
        float keyAreaStart = keyAreaCenter - keyAreaHeight / 2.0;
        float keyAreaEnd = keyAreaCenter + keyAreaHeight / 2.0;
        
        float whiteKeys = floor((sampleDataSize.x / 12.0) * 7.0 + 1.);
        
        float keyY = (uv.y - keyAreaStart) / keyAreaHeight;
        float whiteKeyX = uv.x * whiteKeys;
        float whiteKeyIndex = floor(whiteKeyX);
        float whiteKeyPosition = fract(whiteKeyX);
        
        // Black keys
        float blackKeyX = whiteKeyX - 0.5;
        float blackKeyIndex = floor(blackKeyX);
        float blackKeyPosition = fract(blackKeyX);
        float distanceFromBlackCenter = abs(blackKeyPosition - 0.5);
        
        float blackKeyWidth = 0.8;
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
        
        vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
        
        if (debug && 0.1 <= uv.y && uv.y <= 1.) {
          float debugValue = texture(sampleData, vec2(uv.x, 0.0)).r;
          color = vec4(vec3(debugValue), 1.0);
        }
        if (debug && 0.0 <= uv.y && uv.y <= 0.1) {
          color = texture(keyColor, vec2(uv.x, 0.0));
        }
        
        if (inBlackKey) {
          vec4 colorKey = texture(keyColor, vec2(blackSampleX, 0.0));
          color = mix(vec4(0.05, 0.05, 0.05, 1.0), colorKey, colorKey.a);
        } else if (inWhiteKey) {
          vec4 colorKey = texture(keyColor, vec2(whiteSampleX, 0.0));
          color = mix(vec4(0.95, 0.95, 0.95, 1.0), colorKey, colorKey.a);
          if (debug) {

            float referenceWhiteKey = sampleIndexToWhiteKeyIndex(referenceNoteIndex, startChromaticNote); // A4
            float cBelowReference = sampleIndexToWhiteKeyIndex(referenceNoteIndex - 9.0, startChromaticNote); // C4 (9 semitones below A4)
            bool isReferenceKey = abs(whiteKeyIndex - referenceWhiteKey) < 0.5;
            bool isCKey = abs(whiteKeyIndex - cBelowReference) < 0.5;
            if (isReferenceKey) {
              color = vec4(0.0, 0.8, 0.0, 1.0); // Green for A4
            } else if (isCKey) {
              color = vec4(0.8, 0.0, 0.0, 1.0); // Red for C
            }
          }  
        }

        gl_FragColor = color;
      }`}
    />
  );
};
