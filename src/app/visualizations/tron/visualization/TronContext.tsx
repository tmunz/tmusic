import { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { CameraMode } from './camera/CameraMode';

export interface TronState {
  user: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    vehicle: {
      speed: {
        actual: number;
        target: number;
        min: number;
        max: number;
      };
    };
  };
  game: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    active: boolean;
    battlegroundSize: number;
    userInsideBattleground: boolean;
  };
  world: {
    tileSize: number;
  };
  cameraMode: CameraMode;
}

export enum TronAction {
  UPDATE_VEHICLE_SPEED = 'UPDATE_VEHICLE_SPEED',
  SET_VEHILE_PARAMS = 'SET_VEHILE_PARAMS',
  SET_TARGET_SPEED = 'SET_TARGET_SPEED',
  SET_CAMERA_MODE = 'SET_CAMERA_MODE',
  START_GAME = 'START_GAME',
  UPDATE_USER_BATTLEGROUND_STATUS = 'UPDATE_USER_BATTLEGROUND_STATUS',
  UPDATE_USER_POSITION = 'UPDATE_USER_POSITION',
}

type Action =
  | { type: TronAction.UPDATE_VEHICLE_SPEED; actual: number }
  | { type: TronAction.SET_VEHILE_PARAMS; max: number; min: number }
  | { type: TronAction.SET_TARGET_SPEED; target: number }
  | { type: TronAction.SET_CAMERA_MODE; mode: CameraMode }
  | { type: TronAction.START_GAME; position: { x: number; y: number; z: number } }
  | { type: TronAction.UPDATE_USER_BATTLEGROUND_STATUS; inside: boolean }
  | { type: TronAction.UPDATE_USER_POSITION; position: { x: number; y: number; z: number } };

const tronStateReducer = (state: TronState, action: Action): TronState => {
  switch (action.type) {
    case TronAction.UPDATE_VEHICLE_SPEED:
      return {
        ...state,
        user: {
          ...state.user,
          vehicle: {
            ...state.user.vehicle,
            speed: {
              ...state.user.vehicle.speed,
              actual: action.actual,
            },
          },
        },
      };
    case TronAction.SET_VEHILE_PARAMS:
      return {
        ...state,
        user: {
          ...state.user,
          vehicle: {
            ...state.user.vehicle,
            speed: {
              ...state.user.vehicle.speed,
              max: action.max,
              min: action.min,
            },
          },
        },
      };
    case TronAction.SET_TARGET_SPEED:
      return {
        ...state,
        user: {
          ...state.user,
          vehicle: {
            ...state.user.vehicle,
            speed: {
              ...state.user.vehicle.speed,
              target: action.target,
            },
          },
        },
      };
    case TronAction.SET_CAMERA_MODE:
      return {
        ...state,
        cameraMode: action.mode,
      };
    case TronAction.START_GAME:
      const tileSize = state.world.tileSize;
      const tileX = Math.round(action.position.x / tileSize);
      const tileZ = Math.round(action.position.z / tileSize);
      const snappedX = tileX * tileSize;
      const snappedZ = tileZ * tileSize;
      
      return {
        ...state,
        game: {
          ...state.game,
          position: {
            x: snappedX,
            y: action.position.y,
            z: snappedZ,
          },
          active: true,
        },
      };
    case TronAction.UPDATE_USER_BATTLEGROUND_STATUS:
      return {
        ...state,
        game: {
          ...state.game,
          userInsideBattleground: action.inside,
        },
      };
    case TronAction.UPDATE_USER_POSITION:
      return {
        ...state,
        user: {
          ...state.user,
          position: action.position,
        },
      };
    default:
      return state;
  }
};

const TronContext = createContext<{ tronState: TronState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

export const TronStateProvider = ({ children }: { children: ReactNode }) => {
  const [tronState, dispatch] = useReducer(tronStateReducer, {
    user: {
      position: { x: 0, y: 0, z: 0 },
      vehicle: {
        speed: { actual: 0, target: 0, max: 0, min: 0 },
      },
    },
    game: {
      position: { x: 0, y: 0, z: 0 },
      active: false,
      battlegroundSize: 400,
      userInsideBattleground: true,
    },
    world: {
      tileSize: 50,
    },
    cameraMode: CameraMode.FOLLOW,
  });

  return <TronContext.Provider value={{ tronState, dispatch }}>{children}</TronContext.Provider>;
};

export const useTronState = () => {
  const context = useContext(TronContext);
  if (!context) {
    throw new Error('useTronState must be used within a TronStateProvider');
  }
  return context;
};
