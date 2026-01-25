export const TronLightningEnvironment = () => {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 20, 200]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={1.5} />
      <hemisphereLight args={['#ffffff', '#ffffff', 1.0]} />
    </>
  );
};
