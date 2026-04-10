import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { interpolation } from '../../../utils/ShaderUtils';

export interface CrossingSceneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  numberOfSections?: number;
  offsetAngle?: number;
  sectionWidth?: number;
  sectionLength?: number;
}

export const CrossingScene = ({
  width,
  height,
  sampleProvider,
  numberOfSections = 4,
  offsetAngle = 0.0,
  sectionWidth = 0.2,
  sectionLength = 0.8,
}: CrossingSceneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      numberOfSections: { value: numberOfSections },
      offsetAngle: { value: offsetAngle },
      sectionWidth: { value: sectionWidth },
      sectionLength: { value: sectionLength },
    };
  };

  return (
    <ShaderImage
      objectFit="contain"
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={`
        precision mediump float;
        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;

        uniform sampler2D image;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float numberOfSections;
        uniform float offsetAngle;
        uniform float sectionWidth;
        uniform float sectionLength;

        ${interpolation}

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
          
          vec2 relativeUv = uv - center;
          float angle = atan(relativeUv.y, relativeUv.x);
          float distance = length(relativeUv);
          float adjustedAngle = angle + radians(offsetAngle);
          
          // Determine which section based on angle
          float normalizedAngle = (adjustedAngle + PI) / (2.0 * PI); // 0 to 1
          float sectionIndex = floor(normalizedAngle * numberOfSections);
          
          // Calculate the center angle of this section
          float sectionCenterAngle = (sectionIndex) * (2.0 * PI / numberOfSections) - radians(offsetAngle);
          

          vec2 relativePosToSector = uv - center;
          float rotationAngle = -sectionCenterAngle - PI / numberOfSections;
          float cosRot = cos(rotationAngle);
          float sinRot = sin(rotationAngle);
          vec2 rotatedPos = vec2(
            relativePosToSector.x * cosRot - relativePosToSector.y * sinRot,
            relativePosToSector.x * sinRot + relativePosToSector.y * cosRot
          );
          
          vec2 dataUV = vec2(
            fract(2.0 - rotatedPos.y * 1. / sectionWidth / numberOfSections + sectionIndex / numberOfSections + 0.5 * (1. / numberOfSections)),
            - rotatedPos.x * 2. / sectionLength
          );

          float sampleValue = interpolation(sampleData, dataUV, sampleDataSize, vec2(0.0, 1.0)).r;
          float alpha = smoothstep(sectionWidth / 2.0, sectionWidth / 2.0 - 0.001, abs(rotatedPos.y)) * smoothstep(0.5, 0.5 - 0.001, abs(rotatedPos.x / sectionLength));
          vec4 color = vec4(vec3(0.5 + sampleValue * 0.5), alpha);

          gl_FragColor = color;
        }`}
    />
  );
};
