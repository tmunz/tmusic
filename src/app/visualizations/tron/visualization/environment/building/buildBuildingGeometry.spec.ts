import { buildBuildingGeometry, BUILDING_CYLINDER_SIDES } from './buildBuildingGeometry';
import { BuildingSection, generateBuildings } from './generateBuildings';

it.each(['box', 'cylinder'] as const)('creates a closed %s with a planar slanted roof and no floor bands', shape => {
  const section: BuildingSection = { shape, position: [0, 10, 0], size: [10, 20, 10], roofCut: [6, -2] };
  const geometry = buildBuildingGeometry([section]);
  try {
    const positions = geometry.bodies.getAttribute('position');
    const normals = geometry.bodies.getAttribute('normal');
    const roofHeights = new Set<number>();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(20);
      expect(Math.abs(x)).toBeLessThanOrEqual(5);
      expect(Math.abs(z)).toBeLessThanOrEqual(5);
      if (y > 0) {
        expect(y).toBeCloseTo(16 + (6 * x) / 10 - (2 * z) / 10);
        roofHeights.add(y);
      }
      expect(Math.hypot(normals.getX(i), normals.getY(i), normals.getZ(i))).toBeCloseTo(1);
    }
    expect(roofHeights.size).toBeGreaterThan(1);
    const sides = shape === 'box' ? 4 : BUILDING_CYLINDER_SIDES;
    expect(positions.count).toBe((sides * 2 + (sides - 2) * 2) * 3);
    expect(geometry.outlines.getAttribute('position').count).toBe((sides * 2 + 4) * 2);

    // Every undirected triangle edge belongs to two faces: no holes at the cut roof.
    const edges = new Map<string, number>();
    const vertex = (index: number) => [positions.getX(index), positions.getY(index), positions.getZ(index)].join(',');
    for (let i = 0; i < positions.count; i += 3) {
      for (let edge = 0; edge < 3; edge++) {
        const key = [vertex(i + edge), vertex(i + ((edge + 1) % 3))].sort().join('|');
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    edges.forEach(count => expect(count).toBe(2));
  } finally {
    geometry.bodies.dispose();
    geometry.outlines.dispose();
  }
});

it.each(['tapered', 'flared', 'dome'] as const)(
  'builds a closed %s silhouette without internal horizontal outlines',
  kind => {
    const buildings = Array.from({ length: 20 }, (_, x) => generateBuildings(x + 1, 4, 50)).flat();
    const section = buildings.find(building => building.kind === kind)!.sections[0];
    const geometry = buildBuildingGeometry([section]);
    try {
      const positions = geometry.bodies.getAttribute('position');
      const normals = geometry.bodies.getAttribute('normal');
      const edges = new Map<string, number>();
      const vertex = (index: number) => [positions.getX(index), positions.getY(index), positions.getZ(index)].join(',');
      for (let i = 0; i < positions.count; i++) {
        expect(Number.isFinite(positions.getY(i))).toBe(true);
        expect(positions.getY(i)).toBeGreaterThanOrEqual(-0.00001);
        expect(positions.getY(i)).toBeLessThanOrEqual(section.size[1] + 0.00001);
        expect(Math.hypot(normals.getX(i), normals.getY(i), normals.getZ(i))).toBeCloseTo(1);
      }
      for (let i = 0; i < positions.count; i += 3) {
        for (let edge = 0; edge < 3; edge++) {
          const key = [vertex(i + edge), vertex(i + ((edge + 1) % 3))].sort().join('|');
          edges.set(key, (edges.get(key) ?? 0) + 1);
        }
      }
      edges.forEach(count => expect(count).toBe(2));
      const outlines = geometry.outlines.getAttribute('position');
      for (let i = 0; i < outlines.count; i += 2) {
        const y = outlines.getY(i);
        if (Math.abs(y - outlines.getY(i + 1)) < 0.00001) expect(y).toBeCloseTo(0);
      }
    } finally {
      geometry.bodies.dispose();
      geometry.outlines.dispose();
    }
  }
);
