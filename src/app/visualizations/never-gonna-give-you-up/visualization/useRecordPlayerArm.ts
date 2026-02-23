import { useRef } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';

export const useRecordPlayerArm = (
  sampleProvider: SampleProvider,
  recordPlayerArmSpeed: number,
  onRecordFinished?: () => void
) => {
  type RecordPlayerState = 'idle' | 'playing' | 'finished';
  const TRANSITION_SPEED = 0.6;
  const POSITIONS = {
    idle: 0,
    playingStart: 0.13,
    playingEnd: 0.76,
  };

  const armRotationRef = useRef(0);
  const recordPlayerStateRef = useRef<RecordPlayerState>('idle');
  const playingStartTimeRef = useRef(0);

  const updateArmRotation = (elapsedTime: number, deltaTime: number): number => {
    const isActive = sampleProvider.active;

    if (!isActive && recordPlayerStateRef.current !== 'idle') {
      recordPlayerStateRef.current = 'idle';
    } else if (isActive && recordPlayerStateRef.current === 'idle') {
      recordPlayerStateRef.current = 'playing';
      playingStartTimeRef.current = elapsedTime;
    }

    if (recordPlayerStateRef.current === 'idle') {
      const transitionSpeed = deltaTime * TRANSITION_SPEED;
      if (armRotationRef.current < POSITIONS.idle) {
        armRotationRef.current = Math.min(armRotationRef.current + transitionSpeed, POSITIONS.idle);
      } else if (armRotationRef.current > POSITIONS.idle) {
        armRotationRef.current = Math.max(armRotationRef.current - transitionSpeed, POSITIONS.idle);
      }
    } else if (recordPlayerStateRef.current === 'playing') {
      if (armRotationRef.current < POSITIONS.playingStart) {
        const transitionSpeed = deltaTime * TRANSITION_SPEED;
        armRotationRef.current = Math.min(armRotationRef.current + transitionSpeed, POSITIONS.playingStart);
      } else if (armRotationRef.current < POSITIONS.playingEnd) {
        const moveSpeed = recordPlayerArmSpeed * deltaTime * 0.005;
        armRotationRef.current = Math.min(armRotationRef.current + moveSpeed, POSITIONS.playingEnd);
      } else {
        recordPlayerStateRef.current = 'finished';
        onRecordFinished?.();
      }
    } else if (recordPlayerStateRef.current === 'finished') {
      const returnSpeed = deltaTime * TRANSITION_SPEED;
      armRotationRef.current = Math.max(armRotationRef.current - returnSpeed, POSITIONS.playingStart);
      if (armRotationRef.current <= POSITIONS.playingStart) {
        recordPlayerStateRef.current = 'playing';
        armRotationRef.current = POSITIONS.playingStart;
      }
    }
    return -armRotationRef.current;
  };

  return updateArmRotation;
};
