import { IUniform } from 'three';
import { RootState } from '@react-three/fiber';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { drawActor } from './Actor';
import { drawGround, getGroundY } from './Ground';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { useElapsed } from '../../../utils/useElapsed';
import { useSampleProviderActive } from '../../../sampleProvider/useSampleProviderActive';

export interface SceneProps {
  sampleProvider: SampleProvider;
  width: number;
  height: number;
  volumeFactor?: number;
  strokeNoise?: number;
}

export const Scene = ({ sampleProvider, width, height, volumeFactor = 0.5, strokeNoise = 0.5 }: SceneProps) => {
  // Inverted direction and flipped: newest value to the right, oldest left
  const [volumeTexture, updateVolumeTexture] = useSampleProviderTexture(
    sampleProvider,
    sp => {
      return new Uint8Array(sp ? sp.getAvg().reverse() : []);
    },
    sp => sp?.samples.length ?? 0,
    () => 1
  );

  const active = useSampleProviderActive(sampleProvider);
  const elapsed = useElapsed(active);

  const getUniforms = (rootState: RootState): Record<string, IUniform> => {
    updateVolumeTexture();

    // Fix min/max calculation and groundTexture assignment
    const volumeArray = volumeTexture?.image?.data ? Array.from(volumeTexture.image.data as Uint8Array) : [];
    const minVolume = volumeArray.length > 0 ? Math.min(...volumeArray) : 0;
    const maxVolume = volumeArray.length > 0 ? Math.max(...volumeArray) : 0;

    const groundFactor = volumeFactor ?? 1.0;
    let groundTexture = volumeTexture;
    if (volumeTexture?.image?.data) {
      const mappedData = Array.from(volumeTexture.image.data as Uint8Array).map(v => v * groundFactor);
      (volumeTexture.image.data as Uint8Array).set(mappedData);
      if ('needsUpdate' in volumeTexture) {
        (volumeTexture as any).needsUpdate = true;
      }
      groundTexture = volumeTexture;
    }

    return {
      time: { value: elapsed },
      aspectRatio: { value: (width as number) / (height as number) },
      volumeFactor: { value: volumeFactor },
      groundData: { value: groundTexture },
      groundDataSize: { value: { x: groundTexture.image.width, y: groundTexture.image.height } },
      minVolume: { value: minVolume / 255.0 },
      maxVolume: { value: maxVolume / 255.0 },
      currentVolume: {
        value: volumeArray.length > 0 ? volumeArray[volumeArray.length - 1] / 255.0 : 0,
      },
      strokeNoise: { value: strokeNoise },
    };
  };

  return (
    <ShaderImage
      imageUrls={{}}
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
        precision mediump float;
        varying vec2 vUv;
        uniform float time;
        uniform float aspectRatio;
        uniform float volumeFactor;
        uniform sampler2D groundData;
        uniform vec2 groundDataSize;
        uniform float currentVolume;
        uniform float minVolume;
        uniform float maxVolume;
        uniform float strokeNoise;

        vec4 lineColor = vec4(1.);
        
        // fillColor currently only used as marker on r channel
        // works only if 'a' is set, see blendOver in drawActor
        vec4 fillColor = vec4(1., 0., 0., 0.0001);
        
        float rand(float x) { 
          return fract(sin(x) * 71.5413291); 
        }
        
        float rand(vec2 x) { 
          return rand(dot(x, vec2(13.4251, 15.5128))); 
        }
        
        ${getGroundY}
        ${drawGround}
        ${drawActor}

        void main() {
          float yOffset = 0.5 * (1.0 - volumeFactor);
          vec2 uv = vec2((vUv.x - .5) * aspectRatio, vUv.y);
          vec2 groundUv = vec2((uv.x / aspectRatio) + 0.5, uv.y - yOffset);
          float groundY = getGroundY(groundUv.x, groundData, groundDataSize);
          vec4 actorColor = vec4(0.0);
          if (uv.y + 0.003 >= groundY + yOffset) {
            actorColor = drawActor(uv, time, lineColor, fillColor, groundUv, groundData, groundDataSize, yOffset, aspectRatio, currentVolume, minVolume, maxVolume );
          }
          vec4 color = mix(actorColor, drawGround(groundUv, groundY, lineColor),  step(actorColor.r, 0.5));

          float noiseValue = rand(vec2(fract(uv.x * 5343.1 + time), fract(uv.y * 123.02 + time))) * 2.0 - 1.0;
          color.a *= 1. - noiseValue * strokeNoise;

          color.a *= 1.;
          gl_FragColor = color;
        }
      `}
    />
  );
};
