import { useRef, useEffect, useState } from 'react';

export interface ControlsState {
  direction: number;
  acceleration: number;
  camera: number;
}

export const useUserInput = () => {
  const keysPressed = useRef<Set<string>>(new Set());
  const [cameraCounter, setCameraCounter] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Vehicle controls
      if (key === 'a' || key === 'd' || key === 'w' || key === 's') {
        e.preventDefault();
        keysPressed.current.add(key);
      }

      // Camera mode switching
      if (key === 'c') {
        e.preventDefault();
        setCameraCounter(prev => prev + 1);
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

  const getControlsState = (): ControlsState => {
    const left = keysPressed.current.has('a');
    const right = keysPressed.current.has('d');
    const accelerate = keysPressed.current.has('w');
    const decelerate = keysPressed.current.has('s');

    return {
      direction: left ? -1 : right ? 1 : 0,
      acceleration: accelerate ? 1 : decelerate ? -1 : 0,
      camera: cameraCounter,
    };
  };

  return getControlsState;
};
