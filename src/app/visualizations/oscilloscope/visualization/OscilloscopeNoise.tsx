import { useBlueNoise } from '../../../utils/noise/useBlueNoise';

export const OscilloscopeNoise = () => {
  const noiseTexture = useBlueNoise();

  return (
    <mesh renderOrder={999} position={[0, 0, 0.1]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={noiseTexture}
        transparent={true}
        opacity={0.002}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  );
};
