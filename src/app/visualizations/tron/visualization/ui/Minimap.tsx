import { OrthographicCamera, useFBO } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Scene, Vector3 } from 'three';
import * as THREE from 'three';

interface MinimapProps {
  targetRef: React.RefObject<THREE.Mesh>;
  size?: number;
}

export function Minimap({ targetRef, size = 200 }: MinimapProps): JSX.Element {
  const miniMap = useRef<THREE.Mesh>(null);
  const miniMapCamera = useRef<THREE.OrthographicCamera>(null);
  const playerMarker = useRef<THREE.Mesh>(null);
  const virtualScene = useMemo(() => new Scene(), []);
  const { size: screenSize } = useThree();
  const buffer = useFBO(size * 2, size * 2);

  const screenPosition = useMemo(
    () => new Vector3(screenSize.width / -2 + size / 2 + 10, screenSize.height / 2 - size / 2 - 50, 0),
    [screenSize, size]
  ); 

  const mapSize = 100;
  const mapCamera = useRef<THREE.OrthographicCamera>(null);

  useFrame(({ gl, camera, scene }) => {
    if (!miniMapCamera.current || !mapCamera.current || !targetRef.current) return; 

    const playerPos = targetRef.current.position;
    mapCamera.current.position.set(playerPos.x, playerPos.y + 50, playerPos.z);
    mapCamera.current.lookAt(playerPos.x, playerPos.y, playerPos.z);
    mapCamera.current.updateMatrixWorld();

    const currentRenderTarget = gl.getRenderTarget();
    gl.setRenderTarget(buffer);
    gl.clear();
    gl.render(scene, mapCamera.current);
    gl.setRenderTarget(currentRenderTarget);

    if (playerMarker.current && targetRef.current) {
      playerMarker.current.rotation.z = targetRef.current.rotation.y;
    }
  });

  useFrame(({ gl }) => {
    if (!miniMapCamera.current) return;
    
    const originalAutoClear = gl.autoClear;
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, miniMapCamera.current);
    gl.autoClear = originalAutoClear;
  }, 2);

  return (
    <>
      <OrthographicCamera
        ref={miniMapCamera}
        makeDefault={false}
        position={[0, 0, 100]}
        left={screenSize.width / -2}
        right={screenSize.width / 2}
        top={screenSize.height / 2}
        bottom={screenSize.height / -2}
        near={0.1}
        far={200}
      />

      <OrthographicCamera 
        ref={mapCamera}
        makeDefault={false}
        left={-mapSize / 2}
        right={mapSize / 2}
        top={mapSize / 2}
        bottom={-mapSize / 2}
        near={0.1}
        far={200} 
      />

      {createPortal(
        <>
          <mesh ref={miniMap} position={screenPosition}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={buffer.texture} toneMapped={false} />
          </mesh>

          <lineLoop position={screenPosition}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={4}
                array={new Float32Array([
                  -size / 2, -size / 2, 0,
                  size / 2, -size / 2, 0,
                  size / 2, size / 2, 0,
                  -size / 2, size / 2, 0,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#66EEFF" />
          </lineLoop>

          <mesh ref={playerMarker} position={screenPosition}>
            <coneGeometry args={[size / 20, size / 10, 3]} />
            <meshBasicMaterial color="#66EEFF" side={THREE.DoubleSide} />
          </mesh> 
        </>,
        virtualScene
      )}
    </>
  );
}
