import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Scene, Vector3 } from 'three';
import * as THREE from 'three';
import { useTronGameState } from '../TronGameContext';

interface SpeedBarProps {
  color: string;
  width?: number;
}

export const SpeedBar = ({ color, width = 200 }: SpeedBarProps) => {
  const { tronGameState } = useTronGameState();
  const virtualScene = useMemo(() => new Scene(), []);
  const { size: screenSize } = useThree();
  const speedBarCamera = useRef<THREE.OrthographicCamera>(null);

  const { actual, target, min, max } = tronGameState.userVehicle.speed;
  const actualPercentage = ((actual - min) / (max - min));
  const targetPercentage = ((target - min) / (max - min));

  const barHeight = 20;
  const padding = 10;

  const position = useMemo(
    () => new Vector3(
      screenSize.width / -2 + width / 2 + padding,
      screenSize.height / 2 - barHeight / 2 - padding,
      0
    ),
    [screenSize]
  );

  useFrame(({ gl }) => {
    if (!speedBarCamera.current) return;

    const originalAutoClear = gl.autoClear;
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(virtualScene, speedBarCamera.current);
    gl.autoClear = originalAutoClear;
  }, 2);

  return (
    <>
      <orthographicCamera
        ref={speedBarCamera}
        args={[
          screenSize.width / -2,
          screenSize.width / 2,
          screenSize.height / 2,
          screenSize.height / -2,
          0.1,
          200
        ]}
        position={[0, 0, 100]}
      />

      {createPortal(
        <>
          {/* Background track */}
          <mesh position={position}>
            <planeGeometry args={[width, barHeight]} />
            <meshBasicMaterial color="#333333" transparent opacity={0.5} />
          </mesh>

          {/* Actual speed fill */}
          <mesh position={new Vector3(
            position.x - width / 2 + (width * actualPercentage) / 2,
            position.y,
            position.z + 0.01
          )}>
            <planeGeometry args={[width * actualPercentage, barHeight]} />
            <meshBasicMaterial color={color} />
          </mesh>

          {/* Target speed line */}
          <mesh position={new Vector3(
            position.x - width / 2 + width * targetPercentage,
            position.y,
            position.z + 0.02
          )}>
            <planeGeometry args={[2, barHeight]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Border */}
          <lineLoop position={position}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={4}
                array={new Float32Array([
                  -width / 2, -barHeight / 2, 0.03,
                  width / 2, -barHeight / 2, 0.03,
                  width / 2, barHeight / 2, 0.03,
                  -width / 2, barHeight / 2, 0.03,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#666666" />
          </lineLoop>
        </>,
        virtualScene
      )}
    </>
  );
};
