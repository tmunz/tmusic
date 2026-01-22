import { create } from 'zustand';
import { TronState, Mode, CharacterState, PlayerState } from './TronState';

const USER_CHARACTER_ID = 'user';

const userCharacter: CharacterState = {
  id: USER_CHARACTER_ID,
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

const initialState: TronState = {
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
};

interface TronStore extends TronState {
  // Getters
  getUserPlayer: () => PlayerState | undefined;
  getUserCharacter: () => CharacterState | undefined;
  getCharacter: (characterId: string) => CharacterState | undefined;
  getPlayer: (playerId: string) => PlayerState | undefined;
  getPlayerCharacter: (playerId: string) => CharacterState | undefined;

  // Actions
  updateVehicleSpeed: (characterId: string, actual: number) => void;
  setVehicleParams: (characterId: string, max: number, min: number) => void;
  setTargetSpeed: (characterId: string, target: number) => void;
  setGameMode: (mode: Mode) => void;
  startGame: (position: { x: number; y: number; z: number }) => void;
  updatePlayerBattlegroundStatus: (playerId: string, inside: boolean) => void;
  addCharacter: (character: CharacterState) => void;
  removeCharacter: (characterId: string) => void;
  addPlayer: (player: PlayerState) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerPoints: (playerId: string, points: number) => void;
  updatePlayerAlive: (playerId: string, alive: boolean) => void;
  crash: (crashingPlayerId: string, wallOwnerId: string | undefined) => void;
  setVehicleDisintegrating: (characterId: string, isDisintegrated: boolean) => void;
}

export const useTronStore = create<TronStore>((set, get) => ({
  ...initialState,

  // Getters
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
  updateVehicleSpeed: (characterId: string, actual: number) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                actual,
              },
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
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                max,
                min,
              },
            },
          },
        },
      };
    });
  },

  setTargetSpeed: (characterId: string, target: number) => {
    set(state => {
      const character = state.characters[characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [characterId]: {
            ...character,
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                target,
              },
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
    set(state => {
      const tileSize = state.world.tileSize;
      const tileX = Math.round(position.x / tileSize);
      const tileZ = Math.round(position.z / tileSize);
      const snappedX = tileX * tileSize;
      const snappedZ = tileZ * tileSize;

      return {
        ...state,
        mode: Mode.LIGHTCYCLE_BATTLE,
        game: {
          ...state.game,
          position: {
            x: snappedX,
            y: position.y,
            z: snappedZ,
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

  updatePlayerPoints: (playerId: string, points: number) => {
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
              points,
            },
          },
        },
      };
    });
  },

  updatePlayerAlive: (playerId: string, alive: boolean) => {
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
              alive,
            },
          },
        },
      };
    });
  },

  crash: (crashingPlayerId: string, wallOwnerId: string | undefined) => {
    set(state => {
      const crashingPlayer = state.game.players[crashingPlayerId];
      if (!crashingPlayer) return state;

      // Update crashing player points
      let newPlayers = {
        ...state.game.players,
        [crashingPlayerId]: {
          ...crashingPlayer,
          points: crashingPlayer.points - 1,
        },
      };

      // Update wall owner points if different player
      if (wallOwnerId && wallOwnerId !== crashingPlayerId) {
        const wallOwner = state.game.players[wallOwnerId];
        if (wallOwner) {
          newPlayers = {
            ...newPlayers,
            [wallOwnerId]: {
              ...wallOwner,
              points: wallOwner.points + 1,
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
      };
    });
  },

  setVehicleDisintegrating: (characterId: string, isDisintegrated: boolean) => {
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
}));
