import { BUILDING_ARENA_CLEARANCE, BUILDING_ROAD_HALF_WIDTH, generateBuildings } from './generateBuildings';

it('restores the same buildings regardless of tile generation order', () => {
  const original = generateBuildings(-3, 5, 50);
  generateBuildings(4, -8, 50);
  expect(generateBuildings(-3, 5, 50)).toEqual(original);
  expect(generateBuildings(-3, 6, 50)).not.toEqual(original);
});

it('preserves surviving buildings when the arena hides other lots in their tile', () => {
  const original = generateBuildings(3, 2, 50);
  const filtered = generateBuildings(3, 2, 50, { x: 140, z: 112.5, size: 20 });
  expect(filtered.length).toBeGreaterThan(0);
  expect(filtered.length).toBeLessThan(original.length);
  filtered.forEach(building => expect(building).toEqual(original.find(candidate => candidate.id === building.id)));
});

it('leaves the whole infinite driving avenue clear, including building edges', () => {
  let count = 0;
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      for (const building of generateBuildings(x, z, 50)) {
        count++;
        for (const section of building.sections) {
          expect(Math.abs(section.position[0]) - section.size[0] / 2).toBeGreaterThan(BUILDING_ROAD_HALF_WIDTH);
        }
      }
    }
  }
  expect(count).toBeGreaterThan(0);
});

it('keeps every section outside a moved battle area plus its safety margin', () => {
  const arena = { x: 150, z: -100, size: 200 };
  let count = 0;
  for (let x = -2; x <= 7; x++) {
    for (let z = -7; z <= 2; z++) {
      for (const building of generateBuildings(x, z, 50, arena)) {
        count++;
        for (const section of building.sections) {
          const outsideX = Math.abs(section.position[0] - arena.x) - section.size[0] / 2;
          const outsideZ = Math.abs(section.position[2] - arena.z) - section.size[2] / 2;
          expect(Math.max(outsideX, outsideZ)).toBeGreaterThan(arena.size / 2 + BUILDING_ARENA_CLEARANCE);
        }
      }
    }
  }
  expect(count).toBeGreaterThan(0);
  expect(generateBuildings(3, -2, 50, arena)).toEqual([]);
});

it('generates all ten silhouettes, with grounded sections contained in their tile', () => {
  const kinds = new Set<string>();
  const ids = new Set<string>();
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      for (const building of generateBuildings(x, z, 50)) {
        kinds.add(building.kind);
        expect(ids.has(building.id)).toBe(false);
        ids.add(building.id);
        expect(building.sections[0].position[1] - building.sections[0].size[1] / 2).toBeCloseTo(0);
        for (const section of building.sections) {
          expect(section.position[0] - section.size[0] / 2).toBeGreaterThan(x * 50);
          expect(section.position[0] + section.size[0] / 2).toBeLessThan((x + 1) * 50);
          expect(section.position[2] - section.size[2] / 2).toBeGreaterThan(z * 50);
          expect(section.position[2] + section.size[2] / 2).toBeLessThan((z + 1) * 50);
          section.size.forEach(value => expect(value).toBeGreaterThan(0));
        }
      }
    }
  }
  expect([...kinds].sort()).toEqual([
    'block',
    'cylinder',
    'dome',
    'flared',
    'oval',
    'round-stepped',
    'spire',
    'stepped',
    'tapered',
    'twin',
  ]);
});

it('favors curved buildings and gives their silhouettes different radius profiles', () => {
  const buildings = Array.from({ length: 20 }, (_, x) => generateBuildings(x + 1, 4, 50)).flat();
  const round = buildings.filter(building => building.sections.every(section => section.shape === 'cylinder'));
  expect(round.length).toBeGreaterThan(buildings.length / 2);
  for (const kind of ['tapered', 'flared', 'dome'] as const) {
    const building = buildings.find(candidate => candidate.kind === kind);
    expect(building).toBeDefined();
    const section = building!.sections[0];
    expect(section.roundProfile).toBeDefined();
    expect(section.roundProfile![0][0]).toBe(0);
    expect(section.roundProfile!.slice(-1)[0][0]).toBe(1);
    if (kind === 'dome') expect(section.roofCut).toBeUndefined();
    else expect(section.roofCut).toBeDefined();
  }
});
