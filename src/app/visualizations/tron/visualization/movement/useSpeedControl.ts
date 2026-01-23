import { useRef } from 'react';

export interface SpeedControlConfig {
  minSpeed: number;
  maxSpeed: number;
  speedChangeRate: number;
}

export const useSpeedControl = () => {
  const targetSpeedRef = useRef(0);
  const actualSpeedRef = useRef(0);

  const updateTargetSpeed = (delta: number, config: SpeedControlConfig, acceleration: number): number => {
    const { maxSpeed, minSpeed, speedChangeRate } = config;
    const speedDelta = speedChangeRate * delta * acceleration;
    const newTarget = Math.min(maxSpeed, Math.max(minSpeed, targetSpeedRef.current + speedDelta));
    targetSpeedRef.current = newTarget;
    return newTarget;
  };

  const updateActualSpeed = (delta: number, speedChangeRate: number): number => {
    if (actualSpeedRef.current < targetSpeedRef.current) {
      actualSpeedRef.current = Math.min(targetSpeedRef.current, actualSpeedRef.current + speedChangeRate * delta);
    } else if (actualSpeedRef.current > targetSpeedRef.current) {
      actualSpeedRef.current = Math.max(targetSpeedRef.current, actualSpeedRef.current - speedChangeRate * delta);
    }
    return actualSpeedRef.current;
  };

  const setTargetSpeed = (speed: number) => {
    targetSpeedRef.current = speed;
  };

  const getTargetSpeed = () => {
    return targetSpeedRef.current;
  };

  const getActualSpeed = () => {
    return actualSpeedRef.current;
  };

  const setActualSpeed = (speed: number) => {
    actualSpeedRef.current = speed;
  };

  const reset = () => {
    targetSpeedRef.current = 0;
    actualSpeedRef.current = 0;
  };

  return {
    updateTargetSpeed,
    updateActualSpeed,
    setTargetSpeed,
    getTargetSpeed,
    getActualSpeed,
    setActualSpeed,
    reset,
  };
};
