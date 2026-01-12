import { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { CameraMode } from './camera/CameraMode';

export interface TronGameState {
  userVehicle: {
    speed: {
      actual: number;
      target: number;
      min: number;
      max: number;
    };
    game: {
      position: {
        x: number;
        y: number;
        z: number;
      };
      active: boolean;
    };
  };
  cameraMode: CameraMode;
}

export enum TronGameAction {
  UPDATE_VEHICLE_SPEED = 'UPDATE_VEHICLE_SPEED',
  SET_VEHILE_PARAMS = 'SET_VEHILE_PARAMS',
  SET_TARGET_SPEED = 'SET_TARGET_SPEED',
  SET_CAMERA_MODE = 'SET_CAMERA_MODE',
  START_GAME = 'START_GAME',
}

type Action =
  | { type: TronGameAction.UPDATE_VEHICLE_SPEED; actual: number }
  | { type: TronGameAction.SET_VEHILE_PARAMS; max: number; min: number }
  | { type: TronGameAction.SET_TARGET_SPEED; target: number }
  | { type: TronGameAction.SET_CAMERA_MODE; mode: CameraMode }
  | { type: TronGameAction.START_GAME; position: { x: number; y: number; z: number } };

const tronGameStateReducer = (state: TronGameState, action: Action): TronGameState => {
  switch (action.type) {
    case TronGameAction.UPDATE_VEHICLE_SPEED:
      return {
        ...state,
        userVehicle: {
          ...state.userVehicle,
          speed: {
            ...state.userVehicle.speed,
            actual: action.actual,
          },
        },
      };
    case TronGameAction.SET_VEHILE_PARAMS:
      return {
        ...state,
        userVehicle: {
          ...state.userVehicle,
          speed: {
            ...state.userVehicle.speed,
            max: action.max,
            min: action.min,
          },
        },
      };
    case TronGameAction.SET_TARGET_SPEED:
      return {
        ...state,
        userVehicle: {
          ...state.userVehicle,
          speed: {
            ...state.userVehicle.speed,
            target: action.target,
          },
        },
      };
    case TronGameAction.SET_CAMERA_MODE:
      return {
        ...state,
        cameraMode: action.mode,
      };
    case TronGameAction.START_GAME:
      return {
        ...state,
        userVehicle: {
          ...state.userVehicle,
          game: {
            position: action.position,
            active: true,
          },
        },
      };
    default:
      return state;
  }
};

const TronGameContext = createContext<{ tronGameState: TronGameState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

export const TronGameProvider = ({ children }: { children: ReactNode }) => {
  const [tronGameState, dispatch] = useReducer(tronGameStateReducer, {
    userVehicle: {
      speed: { actual: 0, target: 0, max: 0, min: 0 },
      game: {
        position: { x: 0, y: 0, z: 0 },
        active: false,
      },
    },
    cameraMode: CameraMode.FOLLOW,
  });

  return <TronGameContext.Provider value={{ tronGameState, dispatch }}>{children}</TronGameContext.Provider>;
};

export const useTronGameState = () => {
  const context = useContext(TronGameContext);
  if (!context) {
    throw new Error('useTronGameState must be used within a TronGameProvider');
  }
  return context;
};
