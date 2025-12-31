import { useRef, useEffect } from 'react';

export interface ControlsState {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  decelerate: boolean;
}

export const useVehicleControls = () => {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'd' || key === 'w' || key === 's') {
        keysPressed.current.add(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getControlsState = (): ControlsState => ({
    left: keysPressed.current.has('a'),
    right: keysPressed.current.has('d'),
    accelerate: keysPressed.current.has('w'),
    decelerate: keysPressed.current.has('s'),
  });

  return getControlsState;
};
