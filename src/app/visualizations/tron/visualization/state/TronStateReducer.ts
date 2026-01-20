import { TronState, Mode } from './TronState';
import { TronAction, TronActionType } from './TronAction';

export const tronStateReducer = (state: TronState, action: TronActionType): TronState => {
  switch (action.type) {
    case TronAction.UPDATE_VEHICLE_SPEED: {
      const character = state.characters[action.characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.characterId]: {
            ...character,
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                actual: action.actual,
              },
            },
          },
        },
      };
    }
    case TronAction.SET_VEHILE_PARAMS: {
      const character = state.characters[action.characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.characterId]: {
            ...character,
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                max: action.max,
                min: action.min,
              },
            },
          },
        },
      };
    }
    case TronAction.SET_TARGET_SPEED: {
      const character = state.characters[action.characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.characterId]: {
            ...character,
            vehicle: {
              ...character.vehicle,
              speed: {
                ...character.vehicle.speed,
                target: action.target,
              },
            },
          },
        },
      };
    }
    case TronAction.SET_GAME_MODE:
      return {
        ...state,
        mode: action.mode,
      };
    case TronAction.START_GAME:
      const tileSize = state.world.tileSize;
      const tileX = Math.round(action.position.x / tileSize);
      const tileZ = Math.round(action.position.z / tileSize);
      const snappedX = tileX * tileSize;
      const snappedZ = tileZ * tileSize;

      return {
        ...state,
        mode: Mode.LIGHTCYCLE_BATTLE,
        game: {
          ...state.game,
          position: {
            x: snappedX,
            y: action.position.y,
            z: snappedZ,
          },
        },
      };
    case TronAction.UPDATE_PLAYER_BATTLEGROUND_STATUS: {
      const player = state.game.players[action.playerId];
      if (!player) return state;

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [action.playerId]: {
              ...player,
              insideBattleground: action.inside,
            },
          },
        },
      };
    }
    case TronAction.UPDATE_CHARACTER_POSITION: {
      const character = state.characters[action.characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.characterId]: {
            ...character,
            position: action.position,
          },
        },
      };
    }
    case TronAction.ADD_CHARACTER: {
      return {
        ...state,
        characters: {
          ...state.characters,
          [action.character.id]: action.character,
        },
      };
    }
    case TronAction.REMOVE_CHARACTER: {
      const { [action.characterId]: _, ...remainingCharacters } = state.characters;
      return {
        ...state,
        characters: remainingCharacters,
      };
    }
    case TronAction.ADD_PLAYER: {
      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [action.player.id]: action.player,
          },
        },
      };
    }
    case TronAction.REMOVE_PLAYER: {
      const { [action.playerId]: _, ...remainingPlayers } = state.game.players;
      return {
        ...state,
        game: {
          ...state.game,
          players: remainingPlayers,
        },
      };
    }
    case TronAction.UPDATE_PLAYER_POINTS: {
      const player = state.game.players[action.playerId];
      if (!player) return state;

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [action.playerId]: {
              ...player,
              points: action.points,
            },
          },
        },
      };
    }
    case TronAction.UPDATE_PLAYER_ALIVE: {
      const player = state.game.players[action.playerId];
      if (!player) return state;

      return {
        ...state,
        game: {
          ...state.game,
          players: {
            ...state.game.players,
            [action.playerId]: {
              ...player,
              alive: action.alive,
            },
          },
        },
      };
    }
    case TronAction.RESPAWN_PLAYER: {
      const character = state.characters[action.playerId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.playerId]: {
            ...character,
            position: action.position,
          },
        },
      };
    }
    case TronAction.VEHICLE_CRASH: {
      const crashingPlayer = state.game.players[action.crashingPlayerId];
      if (!crashingPlayer) return state;

      // Update crashing player points
      let newPlayers = {
        ...state.game.players,
        [action.crashingPlayerId]: {
          ...crashingPlayer,
          points: crashingPlayer.points - 1,
        },
      };

      // Update wall owner points if different player
      if (action.wallOwnerId && action.wallOwnerId !== action.crashingPlayerId) {
        const wallOwner = state.game.players[action.wallOwnerId];
        if (wallOwner) {
          newPlayers = {
            ...newPlayers,
            [action.wallOwnerId]: {
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
    }
    case TronAction.SET_VEHICLE_DISINTEGRATING: {
      const character = state.characters[action.characterId];
      if (!character) return state;

      return {
        ...state,
        characters: {
          ...state.characters,
          [action.characterId]: {
            ...character,
            isDisintegrated: action.isDisintegrated,
          },
        },
      };
    }
    default:
      return state;
  }
};
