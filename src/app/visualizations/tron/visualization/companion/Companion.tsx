import { useRef, RefObject, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Object3D, Vector3 } from 'three';
import { Bit } from '../object/Bit';
import { WireframeTransitionObject } from '../object/WireframeTransitionObject';
import { useMovement } from '../movement/useMovement';
import { useSpeedControl } from '../movement/useSpeedControl';
import { MovementControlState } from '../movement/MovementControlState';
import { useCompanionIdle, IDLE_MOVEMENT_CHARACTERISTICS } from './useCompanionIdle';
import { useTronStore } from '../state/TronStore';

interface CompanionProps {
  id: string;
  characterId: string;
  targetRef: RefObject<Object3D>;
  verticalOffset?: number;
  debugMode?: boolean;
}

export const Companion = forwardRef<Object3D, CompanionProps>(
  ({ id, characterId, targetRef, verticalOffset = 0, debugMode = false }, ref) => {
    const targetBasePositionRef = useRef<Mesh>(null);
    const targetPositionRef = useRef<Mesh>(null);
    const companionRef = useRef<Group>(null);
    const movement = useMovement(id);
    const speedControl = useSpeedControl(id);
    const setTargetSpeed = useTronStore(state => state.setTargetSpeed);
    const actualSpeed = useTronStore(state => state.characters[id]?.speed.actual ?? 0);
    const companionIdle = useCompanionIdle(companionRef, targetRef, characterId, { verticalOffset });
    const directionToTargetRef = useRef(new Vector3());
    const [activated, setActivated] = useState<boolean>(false);

    useImperativeHandle(ref, () => companionRef.current!);

    useEffect(() => {
      if (companionRef.current) {
        companionRef.current.position.y = verticalOffset;
      }
    }, [companionRef.current, verticalOffset]);

    const calculateMovementControls = (
      companion: Object3D,
      targetPosition: Vector3,
      currentSpeed: number
    ): MovementControlState => {
      directionToTargetRef.current.subVectors(targetPosition, companion.position);
      const targetAngle = Math.atan2(-directionToTargetRef.current.x, -directionToTargetRef.current.z);

      let angleDiff = targetAngle - companion.rotation.y;
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      const direction = Math.max(-1, Math.min(1, angleDiff));

      const horizontalDistance = Math.sqrt(directionToTargetRef.current.x ** 2 + directionToTargetRef.current.z ** 2);
      const targetPitch = Math.atan2(directionToTargetRef.current.y, horizontalDistance);
      let pitchDiff = targetPitch - companion.rotation.x;
      pitchDiff = Math.atan2(Math.sin(pitchDiff), Math.cos(pitchDiff));
      const pitch = Math.max(-1, Math.min(1, pitchDiff * 2));

      return { speed: currentSpeed, direction, pitch };
    };

    useFrame((state, delta) => {
      if (!companionRef.current || !targetRef.current) return;
      directionToTargetRef.current.subVectors(targetRef.current.position, companionRef.current.position);
      const targetAngle = Math.atan2(-directionToTargetRef.current.x, -directionToTargetRef.current.z);
      const angleDiff = targetAngle - companionRef.current.rotation.y;
      const angleDiffNormalized = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      const { basePosition, offset, speed, activated } = companionIdle(
        state.clock.elapsedTime,
        delta,
        angleDiffNormalized
      );
      if (!basePosition) return;
      const position = new Vector3().addVectors(basePosition, offset);
      if (debugMode && targetBasePositionRef.current && targetPositionRef.current) {
        targetBasePositionRef.current.position.copy(basePosition);
        targetPositionRef.current.position.copy(position);
      }

      setTargetSpeed(id, speed);
      speedControl.updateActualSpeed(delta, IDLE_MOVEMENT_CHARACTERISTICS.speedChangeRate);

      setActivated(activated);

      const movementControls = calculateMovementControls(companionRef.current, position, actualSpeed);

      movement.updateFrame({
        delta,
        controls: movementControls,
        object: companionRef.current,
        movementCharacteristics: IDLE_MOVEMENT_CHARACTERISTICS,
      });
    });

    return (
      <>
        {debugMode && (
          <>
            <mesh ref={targetBasePositionRef}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshBasicMaterial color="red" />
            </mesh>
            <mesh ref={targetPositionRef}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
          </>
        )}
        <group ref={companionRef}>
          {debugMode ? (
            <>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color={activated ? 'red' : 'green'} wireframe />
              </mesh>
              <mesh position={[0, 0, -2]}>
                <planeGeometry args={[0.5, 2]} />
                <meshBasicMaterial color="blue" side={2} />
              </mesh>
            </>
          ) : (
            <WireframeTransitionObject>
              <Bit activated={activated} />
            </WireframeTransitionObject>
          )}
        </group>
      </>
    );
  }
);
