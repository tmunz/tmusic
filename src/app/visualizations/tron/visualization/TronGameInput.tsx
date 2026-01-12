import { useRef, useEffect } from 'react';
import { useTronGameState, TronGameAction } from './TronGameContext';
import { CameraMode } from './camera/CameraMode';

export interface ControlsState {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  decelerate: boolean;
}

export const useGameInput = () => {
  const keysPressed = useRef<Set<string>>(new Set());
  const { tronGameState, dispatch } = useTronGameState();

  useEffect(() => {
    const cameraModes = [CameraMode.FOLLOW, CameraMode.OBSERVER, CameraMode.BIRDS_EYE];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Vehicle controls
      if (key === 'a' || key === 'd' || key === 'w' || key === 's') {
        keysPressed.current.add(key);
      }

      // Camera mode switching
      if (key === 'c') {
        const currentIndex = cameraModes.indexOf(tronGameState.cameraMode);
        const nextIndex = (currentIndex + 1) % cameraModes.length;
        dispatch({
          type: TronGameAction.SET_CAMERA_MODE,
          mode: cameraModes[nextIndex],
        });
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
  }, [tronGameState.cameraMode, dispatch]);

  const getControlsState = (): ControlsState => ({
    left: keysPressed.current.has('a'),
    right: keysPressed.current.has('d'),
    accelerate: keysPressed.current.has('w'),
    decelerate: keysPressed.current.has('s'),
  });

  return getControlsState;
};
