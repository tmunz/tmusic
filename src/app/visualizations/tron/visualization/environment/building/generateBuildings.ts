export type BuildingVector = [number, number, number];

export interface BuildingSection {
  position: BuildingVector;
  size: BuildingVector;
  shape: 'box' | 'cylinder';
  roofCut?: [number, number];
  roundProfile?: [number, number][]; // Height fraction and radius fraction.
}

export interface GeneratedBuilding {
  id: string;
  kind: 'block' | 'stepped' | 'twin' | 'spire' | 'cylinder' | 'oval' | 'tapered' | 'flared' | 'round-stepped' | 'dome';
  sections: BuildingSection[];
}

export interface BuildingArea {
  x: number;
  z: number;
  size: number;
}

export const BUILDING_ROAD_HALF_WIDTH = 24;
export const BUILDING_ARENA_CLEARANCE = 15;

// A tile owns its random sequence, so returning to it restores the same skyline.
function tileRandom(x: number, z: number) {
  let seed = (Math.imul(x, 73856093) ^ Math.imul(z, 19349663) ^ 83492791) >>> 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateBuildings(
  tileX: number,
  tileZ: number,
  tileSize: number,
  arena?: BuildingArea
): GeneratedBuilding[] {
  const random = tileRandom(tileX, tileZ);
  const buildings: GeneratedBuilding[] = [];
  const lotSize = tileSize / 2;
  const kinds: GeneratedBuilding['kind'][] = [
    'block',
    'stepped',
    'twin',
    'spire',
    'cylinder',
    'cylinder',
    'oval',
    'tapered',
    'flared',
    'round-stepped',
    'dome',
  ];

  for (let lotX = 0; lotX < 2; lotX++) {
    for (let lotZ = 0; lotZ < 2; lotZ++) {
      const x = (tileX + (lotX + 0.5) / 2) * tileSize;
      const z = (tileZ + (lotZ + 0.5) / 2) * tileSize;
      const width = lotSize * (0.42 + random() * 0.28);
      const depth = lotSize * (0.42 + random() * 0.28);
      const height = 18 + random() * 52;
      const kind = kinds[Math.floor(random() * kinds.length)];
      const direction = random() * Math.PI * 2;

      // Keep the entire footprint away from the infinite straight driving route.
      if (x - width / 2 <= BUILDING_ROAD_HALF_WIDTH && x + width / 2 >= -BUILDING_ROAD_HALF_WIDTH) continue;
      if (
        arena &&
        Math.abs(x - arena.x) <= arena.size / 2 + BUILDING_ARENA_CLEARANCE + width / 2 &&
        Math.abs(z - arena.z) <= arena.size / 2 + BUILDING_ARENA_CLEARANCE + depth / 2
      )
        continue;

      const sections: BuildingSection[] = [];
      const box = (offsetX: number, bottom: number, w: number, h: number, d: number) => {
        sections.push({ position: [x + offsetX, bottom + h / 2, z], size: [w, h, d], shape: 'box' });
      };

      switch (kind) {
        case 'block':
          box(0, 0, width, height, depth);
          break;
        case 'stepped':
          box(0, 0, width, height * 0.45, depth);
          box(0, height * 0.45, width * 0.7, height * 0.35, depth * 0.7);
          box(0, height * 0.8, width * 0.4, height * 0.2, depth * 0.4);
          break;
        case 'twin':
          box(0, 0, width, height * 0.12, depth);
          box(-width * 0.3, height * 0.12, width * 0.4, height * 0.88, depth * 0.8);
          box(width * 0.3, height * 0.12, width * 0.4, height * 0.7, depth * 0.8);
          break;
        case 'spire':
          box(0, 0, width, height * 0.2, depth);
          box(0, height * 0.2, width * 0.45, height * 0.95, depth * 0.45);
          break;
        case 'round-stepped':
          for (let tier = 0; tier < 3; tier++) {
            const scale = 1 - tier * 0.28;
            sections.push({
              position: [x, (height * (tier + 0.5)) / 3, z],
              size: [width * scale, height / 3, depth * scale],
              shape: 'cylinder',
            });
          }
          break;
        case 'cylinder':
        case 'oval':
        case 'tapered':
        case 'flared':
        case 'dome': {
          const diameter = Math.min(width, depth);
          const section: BuildingSection = {
            position: [x, height / 2, z],
            size: kind === 'oval' ? [width, height, depth * 0.65] : [diameter, height, diameter],
            shape: 'cylinder',
          };
          if (kind === 'tapered')
            section.roundProfile = [
              [0, 1],
              [1, 0.4],
            ];
          if (kind === 'flared')
            section.roundProfile = [
              [0, 0.48],
              [0.25, 0.48],
              [1, 1],
            ];
          if (kind === 'dome') {
            section.roundProfile = [
              [0, 1],
              [0.7, 1],
            ];
            for (let ring = 1; ring < 8; ring++) {
              const angle = (ring * Math.PI) / 16;
              section.roundProfile.push([0.7 + Math.sin(angle) * 0.3, Math.cos(angle)]);
            }
            section.roundProfile.push([1, 0]);
          }
          sections.push(section);
          break;
        }
      }

      // Cut exposed roofs on a diagonal plane, always within the original bounds.
      const roofSections = kind === 'dome' ? [] : kind === 'twin' ? sections.slice(1) : sections.slice(-1);
      roofSections.forEach((section, index) => {
        const cut = Math.min(section.size[1] * 0.4, Math.max(section.size[0], section.size[2]) * 0.8);
        const angle = direction + (index * Math.PI) / 2;
        section.roofCut = [Math.cos(angle) * cut, Math.sin(angle) * cut];
      });

      buildings.push({ id: `building-${tileX}-${tileZ}-${lotX}-${lotZ}`, kind, sections });
    }
  }

  return buildings;
}
