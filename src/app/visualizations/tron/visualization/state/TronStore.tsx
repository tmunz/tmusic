import { create } from 'zustand';
import { TronState, Mode, CharacterState, PlayerState } from './TronState';

export const USER_CHARACTER_ID = 'user';
export const USER_COMPANION_CHARACTER_ID = 'user-companion';

const userCharacter: CharacterState = {
  id: USER_CHARACTER_ID,
  color: '#66eeff',
  isDisintegrated: false,
  speed: { actual: 0, target: 0, max: 0, min: 0 },
  companionId: USER_COMPANION_CHARACTER_ID,
};

const companionCharacter: CharacterState = {
  id: USER_COMPANION_CHARACTER_ID,
  color: '#ffffff',
  isDisintegrated: false,
  speed: { actual: 0, target: 0, max: 60, min: 0 },
};

const userPlayer: PlayerState = {
  id: USER_CHARACTER_ID,
  insideBattleground: true,
  outsideTimeRemaining: 5,
  points: 0,
};

const initialState: TronState = {
  characters: {
    [USER_CHARACTER_ID]: userCharacter,
    [USER_COMPANION_CHARACTER_ID]: companionCharacter,
  },
  userId: USER_CHARACTER_ID,
  mode: Mode.NONE,
  game: {
    position: { x: 0, y: 0, z: 0 },
    battlegroundSize: 200,
    players: { [USER_CHARACTER_ID]: userPlayer },
  },
  world: {
    tileSize: 50,
  },
};

export { initialState };

interface TronStore extends TronState {
  // Getters
  getGameMode: () => Mode;
  getUserPlayer: () => PlayerState | undefined;
  getUserCharacter: () => CharacterState | undefined;
  getCharacter: (characterId: string) => CharacterState | undefined;
  getPlayer: (playerId: string) => PlayerState | undefined;
  getPlayerCharacter: (playerId: string) => CharacterState | undefined;

  // Actions
  updateSpeed: (characterId: string, speed: number) => void;
  setVehicleParams: (characterId: string, max: number, min: number) => void;
  setSpeed: (characterId: string, target: number, actual?: number) => void;
  setGameMode: (mode: Mode) => void;
  startGame: (position: { x: number; y: number; z: number }) => void;
  updatePlayerBattlegroundStatus: (playerId: string, inside: boolean) => void;
  updatePlayerOutsideTimer: (playerId: string, delta: number) => void;
  resetPlayerOutsideTimer: (playerId: string) => void;
  addCharacter: (character: CharacterState) => void;
  removeCharacter: (characterId: string) => void;
  addPlayer: (player: PlayerState) => void;
  removePlayer: (playerId: string) => void;
  handleLightCycleBattleDisintegration: (crashingPlayerId: string, wallOwnerId: string | undefined) => void;
  setDisintegration: (characterId: string, isDisintegrated: boolean) => void;
  init: () => void;
}

export const useTronStore = create<TronStore>((set, get) => ({
  ...initialState,

  // Getters
  getGameMode: () => {
    return get().mode;
  },
  getUserPlayer: () => {
    const state = get();
    return state.game.players[state.userId];
  },
  getUserCharacter: () => {
    const state = get();
    return state.characters[state.userId];
  },
  getCharacter: (characterId: string) => {
    return get().characters[characterId];
  },
  getPlayer: (playerId: string) => {
    return get().game.players[playerId];
  },
  getPlayerCharacter: (playerId: string) => {
    const state = get();
    const player = state.game.players[playerId];
    return player ? state.characters[player.id] : undefined;
  },

  // Actions
  updateSpeed: (characterId: string, speed: number) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            speed: {
              ...character.speed,
              actual: speed,
            },
          },
        },
      };
    });
  },

  setVehicleParams: (characterId: string, max: number, min: number) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            speed: {
              ...character.speed,
              max,
              min,
            },
          },
        },
      };
    });
  },

  setSpeed: (characterId: string, target: number, actual?: number) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            speed: {
              ...character.speed,
              target,
              ...(actual !== undefined && { actual }),
            },
          },
        },
      };
    });
  },

  setGameMode: (mode: Mode) => {
    set({ mode });
  },

  startGame: (position: { x: number; y: number; z: number }) => {
    const PLAYER_COUNT = 2;
    set(state => {
      const tileSize = state.world.tileSize;
      const tileX = Math.round(position.x / tileSize);
      const tileZ = Math.round(position.z / tileSize);
      const snappedX = tileX * tileSize;
      const snappedZ = tileZ * tileSize;

      // Create 4 program players
      const programColors = ['#ff8800', '#ffff00', '#88ff00'];
      const programCharacters: Record<string, CharacterState> = {};
      const programPlayers: Record<string, PlayerState> = {};

      for (let i = 0; i < PLAYER_COUNT; i++) {
        const programId = `program-${i}`;

        programCharacters[programId] = {
          id: programId,
          color: programColors[i],
          isDisintegrated: false,
          speed: { actual: 0, target: 0, max: 60, min: 0 },
        };

        programPlayers[programId] = {
          id: programId,
          insideBattleground: true,
          outsideTimeRemaining: 5,
          points: 0,
        };
      }

      return {
        ...state,
        mode: Mode.LIGHTCYCLE_BATTLE,
        characters: {
          ...state.characters,
          ...programCharacters,
        },
        game: {
          ...state.game,
          position: {
            x: snappedX,
            y: position.y,
            z: snappedZ,
          },
          players: {
            ...state.game.players,
            ...programPlayers,
          },
        },
      };
    });
  },

  updatePlayerBattlegroundStatus: (playerId: string, inside: boolean) => {
    set(state => {
      const player = state.game.players[playerId];
      if (!player) return state;

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [playerId]: {
              ...player,
              insideBattleground: inside,
            },
          },
        },
      };
    });
  },

  updatePlayerOutsideTimer: (playerId: string, delta: number) => {
    set(state => {
      const player = state.game.players[playerId];
      if (!player || player.insideBattleground) return state;

      const newTimeRemaining = Math.max(0, player.outsideTimeRemaining - delta);

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [playerId]: {
              ...player,
              outsideTimeRemaining: newTimeRemaining,
            },
          },
        },
      };
    });
  },

  resetPlayerOutsideTimer: (playerId: string) => {
    set(state => {
      const player = state.game.players[playerId];
      if (!player) return state;

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [playerId]: {
              ...player,
              outsideTimeRemaining: 5,
            },
          },
        },
      };
    });
  },

  addCharacter: (character: CharacterState) => {
    set(state => ({
      ...state,
      characters: {
        ...state.characters,
        [character.id]: character,
      },
    }));
  },

  removeCharacter: (characterId: string) => {
    set(state => {
      const { [characterId]: _, ...remainingCharacters } = state.characters;
      return {
        ...state,
        characters: remainingCharacters,
      };
    });
  },

  addPlayer: (player: PlayerState) => {
    set(state => ({
      ...state,
      game: {
        ...state.game,
        players: {
          ...state.game.players,
          [player.id]: player,
        },
      },
    }));
  },

  removePlayer: (playerId: string) => {
    set(state => {
      const { [playerId]: _, ...remainingPlayers } = state.game.players;
      return {
        ...state,
        game: {
          ...state.game,
          players: remainingPlayers,
        },
      };
    });
  },

  handleLightCycleBattleDisintegration: (crashingPlayerId: string, wallOwnerId?: string) => {
    set(state => {
      const crashingPlayer = state.game.players[crashingPlayerId];
      const crashingCharacter = state.characters[crashingPlayerId];
      if (!crashingPlayer || !crashingCharacter) return state;
      let newPlayers = {
        ...state.game.players,
        [crashingPlayerId]: {
          ...crashingPlayer,
          points: crashingPlayer.points - 1,
        },
      };
      if (wallOwnerId && wallOwnerId !== crashingPlayerId) {
        const wallOwner = state.game.players[wallOwnerId];
        if (wallOwner) {
          const newPoints = wallOwner.points + 1;
          newPlayers = {
            ...newPlayers,
            [wallOwnerId]: {
              ...wallOwner,
              points: newPoints,
            },
          };
        }
      }

      return {
        ...state,
        game: {
          ...state.game,
          players: newPlayers,
        },
        characters: {
          ...state.characters,
          [crashingPlayerId]: {
            ...crashingCharacter,
            isDisintegrated: true,
            speed: {
              ...crashingCharacter.speed,
              target: 0,
            },
          },
        },
      };
    });
  },

  setDisintegration: (characterId: string, isDisintegrated: boolean) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            isDisintegrated,
          },
        },
      };
    });
  },

  init: () => {
    set(initialState);
  },
}));
