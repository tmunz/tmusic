import { useRef, RefObject, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Object3D, Vector3 } from 'three';
import { Bit } from '../object/Bit';
import { WireframeTransitionObject } from '../object/WireframeTransitionObject';
import { useMovement } from '../movement/useMovement';
import { MovementControlState } from '../movement/MovementControlState';
import { useCompanionIdleMovement, IDLE_MOVEMENT_CHARACTERISTICS } from './useCompanionIdleMovement';

interface CompanionProps {
  targetRef: RefObject<Object3D>;
  verticalOffset?: number;
}

export const Companion = forwardRef<Object3D, CompanionProps>(({ targetRef, verticalOffset = 1 }, ref) => {
  const groupRef = useRef<Group>(null);
  const initializedRef = useRef(false);
  const movement = useMovement();
  const { getTargetPosition } = useCompanionIdleMovement(targetRef, { verticalOffset });
  const directionRef = useRef(new Vector3());

  useImperativeHandle(ref, () => groupRef.current!);

  const calculateMovementControls = (companion: Object3D, targetPosition: Vector3): MovementControlState => {
    directionRef.current.subVectors(targetPosition, companion.position);
    const distance = directionRef.current.length();
    const targetAngle = Math.atan2(directionRef.current.x, directionRef.current.z);
    let angleDiff = targetAngle - companion.rotation.y;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    let turnDirection = 0;
    const turnThreshold = 0.05;
    if (Math.abs(angleDiff) > turnThreshold) {
      turnDirection = angleDiff > 0 ? 1 : -1;
    }
    
    const speed = Math.min(distance * 5, IDLE_MOVEMENT_CHARACTERISTICS.maxSpeed);

    return {
      direction: turnDirection,
      speed,
    };
  };

  useFrame((_, delta) => {
    if (!groupRef.current || !targetRef.current) return;

    if (!initializedRef.current) {
      groupRef.current.position.set(
        targetRef.current.position.x,
        targetRef.current.position.y + verticalOffset,
        targetRef.current.position.z
      );
      initializedRef.current = true;
    }

    const targetPosition = getTargetPosition();
    if (!targetPosition) return;

    const movementControls = calculateMovementControls(groupRef.current, targetPosition);

    movement.updateFrame({
      delta,
      controls: movementControls,
      object: groupRef.current,
      movementCharacteristics: IDLE_MOVEMENT_CHARACTERISTICS,
      checkCollision: () => true,
      isDisintegrated: false,
    });
  });

  return (
    <group ref={groupRef}>
      <WireframeTransitionObject autoStart>
        <Bit position={[0, 0, 0]} activated={false} />
      </WireframeTransitionObject>
    </group>
  );
});
