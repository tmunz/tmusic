import { useRef } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { LinearFilter } from 'three';
import { RootState } from '@react-three/fiber';
import { interpolation } from '../../../utils/ShaderUtils';

export interface CrossingProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  perspectiveEffect?: number;
  direction?: number;
}

export const Crossing = ({ sampleProvider, width, height, perspectiveEffect = 0.08, direction = 0 }: CrossingProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const { current: imageUrls } = useRef({
    image: require('./crossing.png'),
    depthMap: require('./crossing-depth-map.jpg'),
  });

  const getUniforms = (rootState: RootState) => {
    updateSampleTexture();

    return {
      perspective: { value: [rootState.pointer.x ?? 0, rootState.pointer.y ?? 0] },
      perspectiveEffect: { value: [perspectiveEffect, perspectiveEffect] },
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      direction: { value: direction },
    };
  };

  return (
    <ShaderImage
      imageUrls={imageUrls}
      objectFit="contain"
      width={width}
      height={height}
      getUniforms={getUniforms}
      imageFilter={LinearFilter}
      fragmentShader={`
      precision mediump float;
      varying vec2 vUv;

      uniform sampler2D image;
      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      uniform sampler2D depthMap;
      uniform vec2 perspective;
      uniform vec2 perspectiveEffect;
      uniform float direction;

      ${interpolation}
      
      vec2 directionUv(vec2 uv, float dir) {
        if (dir < 0.5) return uv; // 0
        if (dir < 1.5) return vec2(1. - uv.y, 1. - uv.x); // 1
        if (dir < 2.5) return vec2(uv.x, 1. - uv.y); // 2
        if (dir < 3.5) return vec2(1. - uv.y, uv.x); // 3
        return uv;
      }

      void main() {
        vec2 uv = vUv;

        float depth = texture2D(depthMap, uv).r;
        vec2 perspectiveValue = perspective * perspectiveEffect * 0.1;
        uv += (depth - 0.5) * perspectiveValue;
        vec2 perspectiveUv = vec2((uv.x - .55) / (.53 - uv.y), uv.y);

        float stripes = 1.65;
        float normalizedX = perspectiveUv.x * stripes;
        float stripeIndex = floor(normalizedX + 0.5);
        float positionInStripe = fract(normalizedX * 2.);
        float xCoord = (stripeIndex + positionInStripe) / stripes;
        
        vec2 crossingUv = vec2(fract(xCoord * .392 + 0.428), 1. - perspectiveUv.y * 4.);
        crossingUv = directionUv(crossingUv, direction);
        // value interpolated, for direct access use: texture2D(sampleData, crossingUv, vec2(1.0, 1.0), true).r
        float sampleValue = interpolation(sampleData, crossingUv, sampleDataSize).r;
        
        vec4 color = texture2D(image, uv);

        float sampleColorValue = sampleValue * 0.5 - 0.25;
        vec3 dataColor = vec3(0.824, 0.820, 0.741) + sampleColorValue;
        // dataColor = texture2D(image, crossingUv).rgb;
        color = mix(vec4(dataColor, 1.0), color, color.a);

        gl_FragColor = color;
      }`}
    />
  );
};
