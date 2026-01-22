import { useRef, useEffect, useState } from 'react';
import { Object3D } from 'three';
import { useTronStore } from '../state/TronStore';
import { CameraMode } from './CameraMode';
import { FollowCamera } from './FollowCamera';
import { ObserverCamera } from './ObserverCamera';
import { BirdsEyeCamera } from './BirdsEyeCamera';
import { Mode } from '../state/TronState';
import { useUserInput } from '../UserInput';

interface TronCameraProps {
  userRef: React.RefObject<Object3D>;
  companionRef: React.RefObject<Object3D>;
}

export const TronCamera = ({ userRef, companionRef }: TronCameraProps) => {
  const userId = useTronStore(state => state.userId);
  const isDisintegrated = useTronStore(state => state.characters[state.userId]?.isDisintegrated);
  const mode = useTronStore(state => state.mode);
  const getControlsState = useUserInput();
  const [cameraTarget, setCameraTarget] = useState<React.RefObject<Object3D>>(userRef);
  const cameraStiffnessRef = useRef(1);

  // switch camera targets during user disintegration and respawn
  useEffect(() => {
    const checkAndSwitchCamera = () => {
      if (isDisintegrated === undefined) {
        return;
      }

      if (isDisintegrated) {
        setCameraTarget(current => {
          if (current === userRef) {
            cameraStiffnessRef.current = 0.5;
            return companionRef;
          }
          return current;
        });
      } else {
        setCameraTarget(current => {
          if (current === companionRef) {
            if (userRef.current && companionRef.current) {
              const distance = userRef.current.position.distanceTo(companionRef.current.position);
              const maxSwitchDistance = 3;

              if (distance < maxSwitchDistance) {
                cameraStiffnessRef.current = 1;
                return userRef;
              }
            } else {
              cameraStiffnessRef.current = 1;
              return userRef;
            }
          }
          return current;
        });
      }
    };

    const interval = setInterval(checkAndSwitchCamera, 100);
    return () => clearInterval(interval);
  }, [isDisintegrated, userId, userRef, companionRef]);

  const cameraModes = [CameraMode.FOLLOW, CameraMode.OBSERVER, CameraMode.BIRDS_EYE];
  const cameraCounter = getControlsState().camera;
  const cameraMode = cameraModes[cameraCounter % cameraModes.length];

  switch (cameraMode) {
    case CameraMode.OBSERVER:
      return <ObserverCamera targetRef={userRef} />;
    case CameraMode.FOLLOW:
      return (
        <FollowCamera
          targetRef={cameraTarget}
          stiffness={cameraStiffnessRef.current}
          drift={mode === Mode.LIGHTCYCLE_BATTLE ? 0 : 2}
        />
      );
    case CameraMode.BIRDS_EYE:
      return <BirdsEyeCamera targetRef={userRef} />;
    default:
      return null;
  }
};
