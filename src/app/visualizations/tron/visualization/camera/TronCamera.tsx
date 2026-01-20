import { useRef, useEffect } from 'react';
import { Object3D } from 'three';
import { useTronState } from '../state/TronContext';
import { CameraMode } from './CameraMode';
import { FollowCamera } from './FollowCamera';
import { ObserverCamera } from './ObserverCamera';
import { BirdsEyeCamera } from './BirdsEyeCamera';
import { Mode } from '../state/TronState';
import { useUserInput } from '../UserInput';

interface TronCameraProps {
  vehicleRef: React.RefObject<Object3D>;
  companionRef: React.RefObject<Object3D>;
}

export const TronCamera = ({ vehicleRef, companionRef }: TronCameraProps) => {
  const { tronState } = useTronState();
  const getControlsState = useUserInput();
  const cameraTargetRef = useRef<React.RefObject<Object3D>>(vehicleRef);
  const cameraStiffnessRef = useRef(1);

  // switch camera targets during user disintegration and respawn
  useEffect(() => {
    const checkAndSwitchCamera = () => {
      const userCharacter = tronState.characters[tronState.userId];

      if (!userCharacter) {
        return;
      }

      if (userCharacter.isDisintegrated) {
        if (cameraTargetRef.current === vehicleRef) {
          cameraTargetRef.current = companionRef;
          cameraStiffnessRef.current = 0.5;
        }
      } else {
        if (cameraTargetRef.current === companionRef) {
          if (vehicleRef.current && companionRef.current) {
            const distance = vehicleRef.current.position.distanceTo(companionRef.current.position);
            const maxSwitchDistance = 3;

            if (distance < maxSwitchDistance) {
              cameraTargetRef.current = vehicleRef;
              cameraStiffnessRef.current = 1;
            }
          } else {
            cameraTargetRef.current = vehicleRef;
            cameraStiffnessRef.current = 1;
          }
        }
      }
    };

    const interval = setInterval(checkAndSwitchCamera, 100);
    return () => clearInterval(interval);
  }, [tronState.characters[tronState.userId]?.isDisintegrated, tronState.userId, vehicleRef, companionRef]);

  const cameraModes = [CameraMode.FOLLOW, CameraMode.OBSERVER, CameraMode.BIRDS_EYE];
  const cameraCounter = getControlsState().camera;
  const cameraMode = cameraModes[cameraCounter % cameraModes.length];

  switch (cameraMode) {
    case CameraMode.OBSERVER:
      return <ObserverCamera targetRef={vehicleRef} />;
    case CameraMode.FOLLOW:
      return (
        <FollowCamera
          targetRef={cameraTargetRef.current}
          stiffness={cameraStiffnessRef.current}
          drift={tronState.mode === Mode.LIGHTCYCLE_BATTLE ? 0 : 2}
        />
      );
    case CameraMode.BIRDS_EYE:
      return <BirdsEyeCamera targetRef={vehicleRef} />;
    default:
      return null;
  }
};
