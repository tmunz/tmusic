import { forwardRef, useRef, useMemo } from 'react';
import { Mesh, Object3D, InstancedMesh, Matrix4, BoxGeometry, MeshBasicMaterial } from 'three';
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
    const forwardDebugMeshRef = useRef<Mesh>(null);
    const cellDebugMeshRef = useRef<InstancedMesh>(null);
    const [getProgramControls, { targetPositionRef, debugInfo }] = useProgramControls({
      characterId: id,
      characterRef: vehicleRef,
      difficulty: 1,
    });

    const cellGeometry = useMemo(() => new BoxGeometry(0.8, 0.2, 0.8), []);
    const cellMaterial = useMemo(
      () =>
        new MeshBasicMaterial({
          color: color || '#ffffff',
          transparent: true,
          opacity: 0.4,
          wireframe: true,
        }),
      [color]
    );

    useFrame(() => {
      if (debugMode && debugMeshRef.current && targetPositionRef.current) {
        debugMeshRef.current.position.copy(targetPositionRef.current);
      }

      if (debugMode && forwardDebugMeshRef.current && debugInfo.current?.forwardDirection) {
        forwardDebugMeshRef.current.position.copy(debugInfo.current.forwardDirection);
      }

      if (debugMode && cellDebugMeshRef.current && debugInfo.current) {
        const cells = debugInfo.current.checkedCells;
        const mesh = cellDebugMeshRef.current;

        if (mesh.count !== cells.length) {
          mesh.count = cells.length;
        }

        const matrix = new Matrix4();
        cells.forEach((cell, i) => {
          matrix.setPosition(cell.x, cell.y, cell.z);
          mesh.setMatrixAt(i, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
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
          <>
            <mesh ref={debugMeshRef}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color={color || '#ffffff'} wireframe={false} transparent opacity={0.8} />
            </mesh>
            <mesh ref={forwardDebugMeshRef}>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshBasicMaterial color="#ff0000" wireframe={false} transparent opacity={0.6} />
            </mesh>
            <instancedMesh ref={cellDebugMeshRef} args={[cellGeometry, cellMaterial, 100]} frustumCulled={false} />
          </>
        )}
      </>
    );
  }
);
