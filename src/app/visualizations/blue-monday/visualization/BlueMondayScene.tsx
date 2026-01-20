import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { LinearFilter } from 'three';
import { useRef } from 'react';

export interface BlueMondaySceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  coverOpacity?: number;
  dataStartAngle?: number;
}

export const BlueMondayScene = ({
  width,
  height,
  sampleProvider,
  coverOpacity = 0.5,
  dataStartAngle = 0,
}: BlueMondaySceneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const { current: imageUrls } = useRef({
    cover: require('./blue-monday-cover.png'),
    label: require('./blue-monday-label.png'),
  });

  const rotationRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const getUniforms = () => {
    updateSampleTexture();

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = now;

    const hz = sampleProvider.hz;
    if (hz > 0) {
      rotationRef.current -= 2 * Math.PI * hz * deltaTime;
    }

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      coverOpacity: { value: coverOpacity },
      rotation: { value: rotationRef.current },
      dataStartAngle: { value: (dataStartAngle * Math.PI) / 180 },
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
      vertexShader={`
        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;
        
        void main() {
          vUv = uv;
          vSize = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
          vPosition = vec2(position + 0.5) * vSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        precision mediump float;
        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;

        uniform sampler2D cover;
        uniform sampler2D label;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float coverOpacity;
        uniform float rotation;
        uniform float dataStartAngle;

        vec4 dataColor = vec4(1.);
        float innerRadius = 0.122;
        float outerRadius = 0.49;

        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, -s, s, c);
          return m * v;
        }

        void main() {
          const float PI = 3.14159265;
          
          float aspectRatio = vSize.x / vSize.y;
          vec2 uv = vUv;
          if (aspectRatio > 1.0) {
            uv.x = (uv.x - 0.5) * aspectRatio + 0.5;
          } else {
            uv.y = (uv.y - 0.5) / aspectRatio + 0.5;
          }
          
          vec2 center = vec2(0.5, 0.5);
          vec2 fromCenter = uv - center;
          float dist = length(fromCenter);
          float angle = atan(fromCenter.y, fromCenter.x);
          
          float normalizedAngle = (angle + PI * 0.5 + dataStartAngle) / (2.0 * PI);
          normalizedAngle = mod(normalizedAngle, 1.0);
        
          vec4 color = vec4(0., 0., 0., 0.);
          
          if (dist >= innerRadius && dist <= outerRadius) {
            float frequencyIndex = normalizedAngle;
            float radialPos = (dist - innerRadius) / (outerRadius - innerRadius);
            
            float sampleY = frequencyIndex * sampleDataSize.y;
            float sampleY0 = floor(sampleY);
            float sampleY1 = sampleY0 + 1.0;
            float sampleFrac = fract(sampleY);
            
            float u = radialPos;
            float v0 = 1.0 - (sampleY0 + 0.5) / sampleDataSize.y;
            float v1 = 1.0 - (sampleY1 + 0.5) / sampleDataSize.y;
            
            float sampleValue0 = texture2D(sampleData, vec2(u, v0)).r;
            float sampleValue1 = texture2D(sampleData, vec2(u, v1)).r;
            float sampleValue = mix(sampleValue0, sampleValue1, sampleFrac);
            
            color = mix(vec4(0.,0.,0.,1.), dataColor, sampleValue);
          }
          
          vec2 rotatedFromCenter = rotate(fromCenter, rotation);
          vec2 rotatedUv = rotatedFromCenter + center;
          vec4 labelColor = texture2D(label, rotatedUv);
          color = mix(color, labelColor, labelColor.a);
          
          if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
            vec4 coverColor = texture2D(cover, uv);
            vec3 blendedRgb = mix(color.rgb, coverColor.rgb, coverColor.a * coverOpacity);
            color = vec4(blendedRgb, max(color.a, coverColor.a * coverOpacity));
          }
          
          gl_FragColor = color;
        }`}
    />
  );
};
