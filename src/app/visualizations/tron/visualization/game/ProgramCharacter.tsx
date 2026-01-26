import { forwardRef, useRef } from 'react';
import { Mesh, Object3D } from 'three';
import { Character, CharacterProps } from '../character/Character';
import { VehicleHandle } from '../object/vehicle/Vehicle';
import { useProgramControls } from './useProgramControls';
import { useFrame } from '@react-three/fiber';

interface ProgramCharacterProps extends CharacterProps {
  debugMode?: boolean;
}

export const ProgramCharacter = forwardRef<Object3D, ProgramCharacterProps>(
  ({ id, color, sampleProvider, position = [0, 0, 0], rotation = [0, 0, 0], debugMode = false }, ref) => {
    const vehicleRef = useRef<VehicleHandle>(null);
    const debugMeshRef = useRef<Mesh>(null);
    const [getProgramControls, { targetPositionRef }] = useProgramControls({
      characterId: id,
      characterRef: vehicleRef,
    });

    useFrame(() => {
      if (debugMode && debugMeshRef.current && targetPositionRef.current) {
        debugMeshRef.current.position.copy(targetPositionRef.current);
      }
    });

    return (
      <>
        <Character
          ref={ref}
          vehicleRef={vehicleRef}
          id={id}
          sampleProvider={sampleProvider}
          color={color}
          position={position}
          rotation={rotation}
          getControlsState={getProgramControls}
        />
        {debugMode && (
          <mesh ref={debugMeshRef}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={color || '#ffffff'} wireframe={false} transparent opacity={0.8} />
          </mesh>
        )}
      </>
    );
  }
);
