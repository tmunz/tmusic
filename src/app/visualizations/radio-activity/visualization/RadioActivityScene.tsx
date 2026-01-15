import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { LinearFilter } from 'three';

export interface RadioActivitySceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  centerDataRatio?: number;
  radiationDataRatio?: number;
}

export const RadioActivityScene = ({ width, height, sampleProvider, centerDataRatio = 0.5, radiationDataRatio = 0.8 }: RadioActivitySceneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      volume: { value: sampleProvider.getAvg()[0] / 255. },
      centerDataRatio: { value: centerDataRatio },
      radiationDataRatio: { value: radiationDataRatio },
    };
  };

  return (
    <ShaderImage
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

        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float volume;
        uniform float centerDataRatio;
        uniform float radiationDataRatio;

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
          
          float normalizedAngle = angle + PI - (PI / 3.0);
          
          vec4 color = vec4(0., 0., 0., 0.);
          
          float minRadius = 0.07;
          float circleRadius = minRadius + volume * centerDataRatio * 0.1;
          float innerRadius = circleRadius + 0.03;
          float outerRadius = 0.4;
          
          if (dist > innerRadius && dist < outerRadius) {
            float sectorSize = PI / 3.0;
            float sector = mod(normalizedAngle, sectorSize * 2.0);
            
            if (sector < sectorSize) {
              float radialPos = (dist - innerRadius) / (outerRadius - innerRadius);
              float sampleIndex = radialPos;
              
              float visibleSectorIndex = floor(normalizedAngle / (sectorSize * 2.0));
              float positionInSector = sector / sectorSize;
              float frequencyIndex = (visibleSectorIndex + positionInSector) / 3.0;
              
              vec2 dataUv = vec2(frequencyIndex, sampleIndex);
              float sampleValue = texture2D(sampleData, dataUv).r;
              
              vec4 valueColor = vec4(0.764, 0.098, 0.149, 1.0) * (1.0 - radiationDataRatio + sampleValue * radiationDataRatio);
              color = valueColor;
            }
          }

          float circle = smoothstep(circleRadius, circleRadius - 0.001, dist);
          vec4 redColor = vec4(0.764, 0.098, 0.149, 1.0);
          color = mix(color, redColor, circle);
          
          gl_FragColor = color;
        }`}
    />
  );
};
