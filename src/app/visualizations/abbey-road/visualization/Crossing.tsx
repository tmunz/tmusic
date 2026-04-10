import { useRef } from 'react';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { RootState } from '@react-three/fiber';
import { interpolation } from '../../../utils/ShaderUtils';
import { useSampleProviderActive } from '../../../sampleProvider/useSampleProviderActive';

export interface CrossingProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  perspectiveEffect?: number;
  direction?: number;
  intensity?: number;
}

export const Crossing = ({
  sampleProvider,
  width,
  height,
  perspectiveEffect = 0.08,
  direction = 0,
  intensity = 1.0,
}: CrossingProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);
  const active = useSampleProviderActive(sampleProvider);

  const { current: imageUrls } = useRef({
    image: require('../abbey-road.jpg'),
    mask: require('./crossing-mask.jpg'),
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
      intensity: { value: intensity },
      isActive: { value: active ? 1.0 : 0.0 },
    };
  };

  return (
    <ShaderImage
      imageUrls={imageUrls}
      objectFit="fill"
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vPosition;
      varying vec2 vSize;

      uniform sampler2D image;
      uniform sampler2D mask;
      uniform sampler2D sampleData;
      uniform vec2 sampleDataSize;
      uniform sampler2D depthMap;
      uniform vec2 perspective;
      uniform vec2 perspectiveEffect;
      uniform float direction;
      uniform float intensity;
      uniform float isActive;

      ${interpolation}
      
      vec2 directionUv(vec2 uv, float dir) {
        if (dir < 0.5) return uv; // 0
        if (dir < 1.5) return vec2(1. - uv.y, 1. - uv.x); // 1
        if (dir < 2.5) return vec2(uv.x, 1. - uv.y); // 2
        if (dir < 3.5) return vec2(1. - uv.y, uv.x); // 3
        return uv;
      }
      
      vec2 getContainUv(vec2 uv, vec2 imageSize, vec2 canvasSize) {
        vec2 imageAspect = imageSize / imageSize.y;
        vec2 canvasAspect = canvasSize / canvasSize.y;
        
        vec2 scale;
        if (canvasAspect.x > imageAspect.x) {
          scale = vec2(imageAspect.x / canvasAspect.x, 1.0);
        } else {
          scale = vec2(1.0, canvasAspect.x / imageAspect.x);
        }
        
        vec2 offset = (vec2(1.0) - scale) * 0.5;
        return (uv - offset) / scale;
      }

      void main() {
        vec2 uv = vUv;
        vec2 imageSize = vec2(1.0);
        vec2 containUv = getContainUv(uv, imageSize, vSize);
        
        bool inBounds = containUv.x >= 0.0 && containUv.x <= 1.0 && containUv.y >= 0.0 && containUv.y <= 1.0;

        float depth = texture2D(depthMap, containUv).r;
        vec2 perspectiveValue = perspective * perspectiveEffect * 0.1;
        vec2 offset = (depth - 0.5) * perspectiveValue;
        vec2 containUvOffset = containUv + offset;
        vec2 perspectiveUv = vec2((containUvOffset.x - .55) / (.53 - containUvOffset.y), containUvOffset.y);

        float stripes = 1.614;
        float normalizedX = perspectiveUv.x * stripes + 0.842;
        float stripeIndex = floor(normalizedX + 0.5);
        float positionInStripe = mod(normalizedX * 2., 2.);
        vec2 xCoord = vec2((stripeIndex + fract(positionInStripe)) / stripes, positionInStripe < 1. ? 1. : 0.);
        
        vec2 crossingUv = vec2(fract(xCoord.x * .4 + 0.25), 1. - perspectiveUv.y * 4.);
        crossingUv = directionUv(crossingUv, direction);

        // value interpolated, for direct access use: texture2D(sampleData, crossingUv, vec2(1.0, 1.0), true).r
        float sampleValue = interpolation(sampleData, crossingUv, sampleDataSize).r;

        bool isInCrossing = uv.y < 0.238 - offset.y;
        vec4 imageColor = vec4(texture2D(image, containUvOffset).rgb, texture2D(mask, containUvOffset).r);

        float sampleColorValue = (sampleValue * 0.5 - 0.25) * intensity * isActive;
        vec3 basedataColor = vec3(0.824, 0.820, 0.741);
        vec4 dataColor = vec4(basedataColor + sampleColorValue * basedataColor, mix(0.0, 1.0, inBounds || isInCrossing && xCoord.y > 0.5));
        vec4 color = mix(dataColor, imageColor, mix(0.0, imageColor.a, inBounds));

        gl_FragColor = color;
      }`}
    />
  );
};
