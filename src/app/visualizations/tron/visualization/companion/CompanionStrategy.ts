import { RefObject } from 'react';
import { Object3D, Vector3 } from 'three';
import { SpeedCharacteristics } from '../movement/SpeedCharactersistic';
import { TurnCharacteristics } from '../movement/TurnCharacteristics';

export interface CompanionStrategyResult {
  position: Vector3;
  speed: number;
  activated: boolean;
}

export type CompanionStrategyCalculator = (time: number, angleDiff: number) => CompanionStrategyResult;

export type CompanionStrategyHook = (
  companionRef: RefObject<Object3D>,
  targetRef: RefObject<Object3D>,
  config?: any
) => CompanionStrategyCalculator;

export interface CompanionStrategy {
  hook: CompanionStrategyHook;
  movementCharacteristics: TurnCharacteristics & SpeedCharacteristics;
  config?: any;
}
