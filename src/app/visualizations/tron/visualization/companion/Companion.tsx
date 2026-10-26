import { useRef, RefObject, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { Bit } from '../object/Bit';
import { WireframeTransitionObject } from '../object/WireframeTransitionObject';
import { useMovement } from '../movement/useMovement';
import { useSpeedControl } from '../movement/useSpeedControl';
import { calculateMovementControls } from '../movement/calculateMovementControls';
import { CompanionStrategy } from './CompanionStrategy';
import { useCompanionIdle, IDLE_MOVEMENT_CHARACTERISTICS } from './useCompanionIdle';
import { useTronStore } from '../state/TronStore';
import { advanceCompanionWarningMovement, getCompanionWarningLevel, getCompanionWarningPose } from './companionWarning';

interface CompanionProps {
  id: string;
  characterId: string;
  targetRef: RefObject<Object3D>;
  verticalOffset?: number;
  debugMode?: boolean;
  strategy?: CompanionStrategy;
}

export const Companion = forwardRef<Object3D, CompanionProps>(
  ({ id, characterId, targetRef, verticalOffset = 0, debugMode = false, strategy }, ref) => {
    const targetPositionRef = useRef<Mesh>(null);
    const companionRef = useRef<Group>(null);
    const movement = useMovement(id);
    const speedControl = useSpeedControl(id);
    const setSpeed = useTronStore(state => state.setSpeed);
    const actualSpeed = useTronStore(state => state.characters[id]?.speed.actual ?? 0);
    const defaultStrategy: CompanionStrategy = {
      hook: useCompanionIdle,
      movementCharacteristics: IDLE_MOVEMENT_CHARACTERISTICS,
      config: { verticalOffset },
    };
    const activeStrategy = strategy ?? defaultStrategy;
    const strategyCalculator = activeStrategy.hook(
      companionRef,
      targetRef,
      activeStrategy.config ?? { verticalOffset }
    );

    const directionToTargetRef = useRef(new Vector3());
    const warningLevel = useRef(0);
    const warningPosition = useRef(new Vector3());
    const warningDirection = useRef(new Vector3());
    const warningSpeed = useRef(0);
    const warningTime = useRef(0);
    const warningRotation = useRef(new Quaternion());
    const wasWarning = useRef(false);
    const [activated, setActivated] = useState<boolean>(false);

    useImperativeHandle(ref, () => companionRef.current!);

    useEffect(() => {
      if (companionRef.current) {
        companionRef.current.position.y = verticalOffset;
      }
    }, [verticalOffset]);

    useFrame((state, delta) => {
      if (!companionRef.current || !targetRef.current) return;
      const companion = companionRef.current;
      const target = targetRef.current;
      const tron = useTronStore.getState();
      const player = tron.game.players[characterId];
      const targetWarning = player
        ? getCompanionWarningLevel(
            tron.mode,
            target.position,
            tron.game.position,
            tron.game.battlegroundSize,
            player.outsideTimeRemaining,
            tron.characters[characterId]?.isDisintegrated ?? false
          )
        : 0;
      const smoothing = 1 - Math.exp(-Math.min(delta, 0.1) * 10);
      warningLevel.current += (targetWarning - warningLevel.current) * smoothing;
      if (targetWarning > 0) {
        if (!wasWarning.current) {
          movement.reset();
          warningSpeed.current = Math.min(
            activeStrategy.movementCharacteristics.maxSpeed,
            tron.characters[id]?.speed.actual ?? 0
          );
          warningTime.current = 0;
        }
        wasWarning.current = true;
        warningTime.current += Math.min(delta, 0.1);
        getCompanionWarningPose(
          target.position,
          tron.game.position,
          warningLevel.current,
          warningTime.current,
          verticalOffset,
          warningPosition.current,
          warningDirection.current
        );
        warningSpeed.current = advanceCompanionWarningMovement(
          companion.position,
          warningPosition.current,
          warningSpeed.current,
          delta,
          activeStrategy.movementCharacteristics,
          directionToTargetRef.current
        );
        const yaw = Math.atan2(-warningDirection.current.x, -warningDirection.current.z);
        warningRotation.current.setFromAxisAngle(Object3D.DEFAULT_UP, yaw);
        companion.quaternion.slerp(warningRotation.current, smoothing);
        setActivated(true);
        if (debugMode && targetPositionRef.current) targetPositionRef.current.position.copy(warningPosition.current);
        return;
      }
      if (wasWarning.current) {
        wasWarning.current = false;
        movement.reset();
        companion.rotation.x = 0;
        companion.rotation.z = 0;
        tron.setSpeed(id, 0, 0);
      }
      directionToTargetRef.current.subVectors(targetRef.current.position, companionRef.current.position);
      const targetAngle = Math.atan2(-directionToTargetRef.current.x, -directionToTargetRef.current.z);
      const angleDiff = targetAngle - companionRef.current.rotation.y;
      const angleDiffNormalized = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      const { position, speed, activated } = strategyCalculator(state.clock.elapsedTime, angleDiffNormalized);
      if (!position) return;
      if (debugMode && targetPositionRef.current) {
        targetPositionRef.current.position.copy(position);
      }

      setSpeed(id, speed);
      speedControl.updateActualSpeed(
        delta,
        activeStrategy.movementCharacteristics.acceleration,
        activeStrategy.movementCharacteristics.deceleration
      );

      const movementControls = calculateMovementControls(companionRef.current, position, actualSpeed, true);

      setActivated(activated);

      movement.updateFrame({
        delta,
        controls: movementControls,
        object: companionRef.current,
        movementCharacteristics: activeStrategy.movementCharacteristics,
      });
    });

    return (
      <>
        {debugMode && (
          <>
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
              <Bit activated={activated} warningLevel={warningLevel} />
            </WireframeTransitionObject>
          )}
        </group>
      </>
    );
  }
);
