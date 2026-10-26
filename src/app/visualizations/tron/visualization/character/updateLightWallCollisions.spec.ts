import { Vector3 } from 'three';
import { LightWallPoint, updateLightWallCollisions } from './updateLightWallCollisions';

const point = (x: number): LightWallPoint => ({
  id: `point-${x}`,
  lower: new Vector3(x, 0, 0),
  upper: new Vector3(x, 1, 0),
});

function setup() {
  return {
    points: [point(0), point(1), point(2)],
    spawnPosition: new Vector3(10, 0, 0),
    thickness: 0.03,
    playerId: 'user',
    registeredSegments: new Set<string>(),
    registerObject: jest.fn(),
    unregisterObject: jest.fn(),
  };
}

it('keeps existing collision objects when a trail grows or its oldest point expires', () => {
  const state = setup();
  updateLightWallCollisions(state);
  expect(state.registerObject).toHaveBeenCalledTimes(2);
  state.registerObject.mockClear();

  state.points.push(point(3));
  updateLightWallCollisions(state);
  expect(state.registerObject).toHaveBeenCalledTimes(1);
  expect(state.registerObject.mock.calls[0][0].id).toBe('point-2');
  state.registerObject.mockClear();

  state.points.shift();
  updateLightWallCollisions(state);
  expect(state.registerObject).not.toHaveBeenCalled();
  expect(state.unregisterObject).toHaveBeenCalledWith('point-0');
  expect([...state.registeredSegments]).toEqual(['point-1', 'point-2']);
});

it('removes and restores segments when the vehicle moves through the exclusion zone', () => {
  const state = setup();
  updateLightWallCollisions(state);
  state.spawnPosition.set(0, 0, 0);
  updateLightWallCollisions(state);
  expect(state.registeredSegments.size).toBe(0);
  expect(state.unregisterObject).toHaveBeenCalledTimes(2);

  state.spawnPosition.set(10, 0, 0);
  state.registerObject.mockClear();
  updateLightWallCollisions(state);
  expect(state.registerObject).toHaveBeenCalledTimes(2);

  state.points = [];
  state.unregisterObject.mockClear();
  updateLightWallCollisions(state);
  expect(state.unregisterObject).toHaveBeenCalledTimes(2);
  expect(state.registeredSegments.size).toBe(0);
});

it('includes wall thickness in broad-phase bounds and preserves ownership', () => {
  const state = setup();
  updateLightWallCollisions(state);
  const wall = state.registerObject.mock.calls[0][0];
  expect(wall.playerId).toBe('user');
  expect(wall.type).toBe('wall');
  expect(wall.orientedCorners).toHaveLength(8);
  expect(wall.boundingBox.min.z).toBeCloseTo(-0.015);
  expect(wall.boundingBox.max.z).toBeCloseTo(0.015);
  wall.orientedCorners.forEach((corner: Vector3) => expect(wall.boundingBox.containsPoint(corner)).toBe(true));
});

it('registers only one additional collider per update for a full length rolling trail', () => {
  const state = setup();
  state.points = Array.from({ length: 500 }, (_, i) => point(i));
  state.spawnPosition.set(1000, 0, 0);
  updateLightWallCollisions(state);
  expect(state.registerObject).toHaveBeenCalledTimes(499);
  state.registerObject.mockClear();

  for (let i = 500; i < 600; i++) {
    state.points.shift();
    state.points.push(point(i));
    updateLightWallCollisions(state);
  }
  expect(state.registerObject).toHaveBeenCalledTimes(100);
  expect(state.unregisterObject).toHaveBeenCalledTimes(100);
  expect(state.registeredSegments.size).toBe(499);
});
