import { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { TronState, Mode, CharacterState, PlayerState } from './TronState';
import { TronActionType } from './TronAction';
import { tronStateReducer } from './TronStateReducer';

const TronContext = createContext<{ tronState: TronState; dispatch: Dispatch<TronActionType> } | undefined>(undefined);

const USER_CHARACTER_ID = 'user';

export const TronStateProvider = ({ children }: { children: ReactNode }) => {
  const userCharacter: CharacterState = {
    id: USER_CHARACTER_ID,
    position: { x: 0, y: 0, z: 0 },
    color: '#66eeff',
    isDisintegrated: false,
    vehicle: {
      speed: { actual: 0, target: 0, max: 0, min: 0 },
    },
  };

  const userPlayer: PlayerState = {
    id: USER_CHARACTER_ID,
    insideBattleground: true,
    points: 0,
    alive: true,
  };

  const [tronState, dispatch] = useReducer(tronStateReducer, {
    characters: { [USER_CHARACTER_ID]: userCharacter },
    userId: USER_CHARACTER_ID,
    mode: Mode.NONE,
    game: {
      position: { x: 0, y: 0, z: 0 },
      battlegroundSize: 400,
      players: { [USER_CHARACTER_ID]: userPlayer },
    },
    world: {
      tileSize: 50,
    },
  });

  return <TronContext.Provider value={{ tronState, dispatch }}>{children}</TronContext.Provider>;
};

export const useTronState = () => {
  const context = useContext(TronContext);
  if (!context) {
    throw new Error('useTronState must be used within a TronStateProvider');
  }

  const { tronState, dispatch } = context;

  return {
    tronState,
    dispatch,
    getUserPlayer: () => tronState.game.players[tronState.userId],
    getUserCharacter: () => tronState.characters[tronState.userId],
    getCharacter: (characterId: string) => tronState.characters[characterId],
    getPlayer: (playerId: string) => tronState.game.players[playerId],
    getPlayerCharacter: (playerId: string) => {
      const player = tronState.game.players[playerId];
      return player ? tronState.characters[player.id] : undefined;
    },
  };
};
