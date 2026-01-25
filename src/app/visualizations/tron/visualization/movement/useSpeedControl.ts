import { useTronStore } from '../state/TronStore';

export interface SpeedControlConfig {
  minSpeed: number;
  maxSpeed: number;
  speedChangeRate: number;
}

export const useSpeedControl = (id: string) => {
  const updateSpeed = useTronStore(state => state.updateSpeed);
  const character = useTronStore(state => state.characters[id]);

  const targetSpeed = character?.speed.target ?? 0;
  const actualSpeed = character?.speed.actual ?? 0;

  const updateActualSpeed = (delta: number, speedChangeRate: number) => {
    let newActual = actualSpeed;

    if (actualSpeed < targetSpeed) {
      newActual = Math.min(targetSpeed, actualSpeed + speedChangeRate * delta);
    } else if (actualSpeed > targetSpeed) {
      newActual = Math.max(targetSpeed, actualSpeed - speedChangeRate * delta);
    }

    if (newActual !== actualSpeed) {
      updateSpeed(id, newActual);
    }
  };

  return {
    updateActualSpeed,
  };
};
