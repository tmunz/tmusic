import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../sampleProvider/SampleProvider';
import { useSampleProviderTexture } from '../../../sampleProvider/useSampleProviderTexture';
import { RootState } from '@react-three/fiber';
import { fragmentShader } from './shaders/mondrian.gsgl';

export interface MondrianVisualizationProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  borderWidth?: number;
}

export const MondrianVisualization = ({
  width,
  height,
  sampleProvider,
  borderWidth = 1.0,
}: MondrianVisualizationProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = (rootState: RootState) => {
    updateSampleTexture();
    return {
      resolution: { value: { x: width, y: height } },
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      borderWidth: { value: borderWidth / height },
    };
  };

  return (
    <ShaderImage
      objectFit="contain"
      width={width}
      height={height}
      getUniforms={getUniforms}
      fragmentShader={fragmentShader}
    />
  );
};
