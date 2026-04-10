import { useMemo } from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

export interface OscilloscopePostProcessingProps {
  exposure?: number;
  glow?: number;
}

export const OscilloscopePostProcessing = ({ exposure = 1.0, glow = 1.0 }: OscilloscopePostProcessingProps) => {
  const brightness = useMemo(() => {
    return Math.pow(2, exposure - 2.0);
  }, [exposure]);

  return (
    <EffectComposer>
      <Bloom
        intensity={glow * brightness}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        kernelSize={KernelSize.LARGE}
        blendFunction={BlendFunction.ADD}
      />

      <Bloom
        intensity={glow * brightness * 0.5}
        luminanceThreshold={0.05}
        luminanceSmoothing={0.7}
        kernelSize={KernelSize.VERY_LARGE}
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  );
};
