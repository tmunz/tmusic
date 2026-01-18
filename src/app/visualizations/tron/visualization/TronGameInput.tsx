import { useRef, useEffect } from 'react';
import { CameraMode } from './camera/CameraMode';
import { useTronState } from './state/TronContext';
import { TronAction } from './state/TronAction';

export interface ControlsState {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  decelerate: boolean;
}

export const useGameInput = () => {
  const keysPressed = useRef<Set<string>>(new Set());
  const { tronState, dispatch } = useTronState();

  useEffect(() => {
    const cameraModes = [CameraMode.FOLLOW, CameraMode.OBSERVER, CameraMode.BIRDS_EYE];

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
        const currentIndex = cameraModes.indexOf(tronState.cameraMode);
        const nextIndex = (currentIndex + 1) % cameraModes.length;
        dispatch({
          type: TronAction.SET_CAMERA_MODE,
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
  }, [tronState.cameraMode, dispatch]);

  const getControlsState = (): ControlsState => ({
    left: keysPressed.current.has('a'),
    right: keysPressed.current.has('d'),
    accelerate: keysPressed.current.has('w'),
    decelerate: keysPressed.current.has('s'),
  });

  return getControlsState;
};
