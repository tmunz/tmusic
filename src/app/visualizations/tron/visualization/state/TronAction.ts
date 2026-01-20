import { CharacterState, Mode, PlayerState } from './TronState';

export enum TronAction {
  UPDATE_VEHICLE_SPEED = 'UPDATE_VEHICLE_SPEED',
  SET_VEHILE_PARAMS = 'SET_VEHILE_PARAMS',
  SET_TARGET_SPEED = 'SET_TARGET_SPEED',
  SET_GAME_MODE = 'SET_GAME_MODE',
  START_GAME = 'START_GAME',
  UPDATE_PLAYER_BATTLEGROUND_STATUS = 'UPDATE_PLAYER_BATTLEGROUND_STATUS',
  UPDATE_CHARACTER_POSITION = 'UPDATE_CHARACTER_POSITION',
  ADD_CHARACTER = 'ADD_CHARACTER',
  REMOVE_CHARACTER = 'REMOVE_CHARACTER',
  ADD_PLAYER = 'ADD_PLAYER',
  REMOVE_PLAYER = 'REMOVE_PLAYER',
  UPDATE_PLAYER_POINTS = 'UPDATE_PLAYER_POINTS',
  UPDATE_PLAYER_ALIVE = 'UPDATE_PLAYER_ALIVE',
  RESPAWN_PLAYER = 'RESPAWN_PLAYER',
  VEHICLE_CRASH = 'VEHICLE_CRASH',
  SET_VEHICLE_DISINTEGRATING = 'SET_VEHICLE_DISINTEGRATING',
}

export type TronActionType =
  | { type: TronAction.UPDATE_VEHICLE_SPEED; characterId: string; actual: number }
  | { type: TronAction.SET_VEHILE_PARAMS; characterId: string; max: number; min: number }
  | { type: TronAction.SET_TARGET_SPEED; characterId: string; target: number }
  | { type: TronAction.SET_GAME_MODE; mode: Mode }
  | { type: TronAction.START_GAME; position: { x: number; y: number; z: number } }
  | { type: TronAction.UPDATE_PLAYER_BATTLEGROUND_STATUS; playerId: string; inside: boolean }
  | { type: TronAction.UPDATE_CHARACTER_POSITION; characterId: string; position: { x: number; y: number; z: number } }
  | { type: TronAction.ADD_CHARACTER; character: CharacterState }
  | { type: TronAction.REMOVE_CHARACTER; characterId: string }
  | { type: TronAction.ADD_PLAYER; player: PlayerState }
  | { type: TronAction.REMOVE_PLAYER; playerId: string }
  | { type: TronAction.UPDATE_PLAYER_POINTS; playerId: string; points: number }
  | { type: TronAction.UPDATE_PLAYER_ALIVE; playerId: string; alive: boolean }
  | { type: TronAction.RESPAWN_PLAYER; playerId: string; position: { x: number; y: number; z: number } }
  | { type: TronAction.VEHICLE_CRASH; crashingPlayerId: string; wallOwnerId: string | undefined }
  | { type: TronAction.SET_VEHICLE_DISINTEGRATING; characterId: string; isDisintegrated: boolean };
