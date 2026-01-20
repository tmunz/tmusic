import { useRef, useEffect, useState } from 'react';

export interface ControlsState {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  decelerate: boolean;
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

  const getControlsState = (): ControlsState => ({
    left: keysPressed.current.has('a'),
    right: keysPressed.current.has('d'),
    accelerate: keysPressed.current.has('w'),
    decelerate: keysPressed.current.has('s'),
    camera: cameraCounter,
  });

  return getControlsState;
};
