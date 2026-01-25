export interface MovementControlState {
  speed: number;
  direction: number; // [-1, 1] --- 1 = left (CCW), 0 = neutral, -1 = right (CW)
  pitch?: number; // [-1, 1] --- 1 = up, 0 = neutral, -1 = down
}
