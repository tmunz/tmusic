export interface Character {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: string;
  vehicle: {
    speed: {
      actual: number;
      target: number;
      min: number;
      max: number;
    };
  };
}
