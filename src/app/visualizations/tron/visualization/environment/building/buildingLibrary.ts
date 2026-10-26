import { Box3, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { addBuildingBattleGradient, cloneBuildingMaterial } from './buildingBattleMaterial';
import { buildBuildingGeometry } from './buildBuildingGeometry';
import {
  BUILDING_ARENA_CLEARANCE,
  BUILDING_ROAD_HALF_WIDTH,
  BuildingArea,
  GeneratedBuilding,
  generateBuildings,
} from './generateBuildings';
import { createWireframeCreateMaterial } from '../../object/useWireframeCreate';

export const BUILDING_LIBRARY_SIZE = 30;
export const BUILDING_DENSITY = 0.1;

export function createBuildingLibrary() {
  const candidates: GeneratedBuilding[] = [];
  const kinds = new Set<string>();
  const selected: GeneratedBuilding[] = [];
  for (let tile = 1; tile <= 100 && (selected.length < 10 || candidates.length < 30); tile++) {
    for (const building of generateBuildings(tile, 0, 50)) {
      if (!kinds.has(building.kind)) {
        kinds.add(building.kind);
        selected.push(building);
      } else candidates.push(building);
    }
  }
  candidates.sort(
    (a, b) =>
      Number(b.sections.every(s => s.shape === 'cylinder')) - Number(a.sections.every(s => s.shape === 'cylinder'))
  );
  selected.push(...candidates.slice(0, BUILDING_LIBRARY_SIZE - selected.length));

  const battleMix = { value: 0 };
  return selected.map((building, index) => {
    const origin = building.sections[0].position;
    const sections = building.sections.map(section => ({
      ...section,
      position: [
        (section.position[0] - origin[0]) * 2,
        section.position[1] * 3,
        (section.position[2] - origin[2]) * 2,
      ] as [number, number, number],
      size: [section.size[0] * 2, section.size[1] * 3, section.size[2] * 2] as [number, number, number],
      roofCut: section.roofCut ? ([section.roofCut[0] * 3, section.roofCut[1] * 3] as [number, number]) : undefined,
    }));
    const geometry = buildBuildingGeometry(sections);
    const bounds = new Box3();
    sections.forEach(section =>
      bounds.union(new Box3().setFromCenterAndSize(new Vector3(...section.position), new Vector3(...section.size)))
    );
    const bodyMaterial = new MeshStandardMaterial({
      color: '#000000',
      roughness: 0.7,
      metalness: 0.35,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const fadeMaterial = cloneBuildingMaterial(bodyMaterial);
    fadeMaterial.transparent = true;
    const outlineMaterial = new LineBasicMaterial({ color: '#00ddee', toneMapped: false });
    addBuildingBattleGradient(outlineMaterial, bounds.min.y, bounds.max.y, battleMix);
    const model = new Group();
    model.add(new Mesh(geometry.bodies, bodyMaterial), new LineSegments(geometry.outlines, outlineMaterial));
    const wireframe = new Group();
    const revealMaterial = createWireframeCreateMaterial('#00ddee', bounds.min.y, bounds.max.y, true);
    addBuildingBattleGradient(revealMaterial, bounds.min.y, bounds.max.y, battleMix);
    wireframe.add(new Mesh(geometry.bodies, revealMaterial));
    return { index, kind: building.kind, sections, geometry, bounds, model, wireframe, fadeMaterial, battleMix };
  });
}

export type BuildingTemplate = ReturnType<typeof createBuildingLibrary>[number];

function placementHash(x: number, z: number, lot: number) {
  let hash = Math.imul(x, 73856093) ^ Math.imul(z, 19349663) ^ Math.imul(lot + 1, 83492791);
  hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
  return (hash ^ (hash >>> 16)) >>> 0;
}

export function placeBuildings(
  tiles: { x: number; z: number }[],
  tileSize: number,
  library: BuildingTemplate[],
  arena?: BuildingArea
) {
  return tiles.flatMap(tile => {
    const placements: { id: string; x: number; z: number; template: BuildingTemplate }[] = [];
    for (let lot = 0; lot < 4; lot++) {
      const hash = placementHash(tile.x, tile.z, lot);
      if (hash / 0x100000000 >= BUILDING_DENSITY) continue;
      const template = library[placementHash(tile.z, tile.x, lot + 4) % library.length];
      const x = (tile.x + (Math.floor(lot / 2) + 0.5) / 2) * tileSize;
      const z = (tile.z + ((lot % 2) + 0.5) / 2) * tileSize;
      const minX = x + template.bounds.min.x;
      const maxX = x + template.bounds.max.x;
      const minZ = z + template.bounds.min.z;
      const maxZ = z + template.bounds.max.z;
      if (minX <= BUILDING_ROAD_HALF_WIDTH && maxX >= -BUILDING_ROAD_HALF_WIDTH) continue;
      if (arena) {
        const extent = arena.size / 2 + BUILDING_ARENA_CLEARANCE;
        if (
          maxX >= arena.x - extent &&
          minX <= arena.x + extent &&
          maxZ >= arena.z - extent &&
          minZ <= arena.z + extent
        )
          continue;
      }
      placements.push({ id: `building-${tile.x}-${tile.z}-${lot}`, x, z, template });
    }
    return placements;
  });
}

export function cloneBuildingModel(template: Group) {
  const clone = template.clone(true);
  clone.traverse(child => {
    if (child instanceof Mesh) {
      child.material = Array.isArray(child.material)
        ? child.material.map(cloneBuildingMaterial)
        : cloneBuildingMaterial(child.material);
    }
  });
  return clone;
}

export function disposeBuildingLibrary(library: BuildingTemplate[]) {
  library.forEach(template => {
    template.fadeMaterial.dispose();
    template.geometry.bodies.dispose();
    template.geometry.outlines.dispose();
    [template.model, template.wireframe].forEach(group =>
      group.traverse(child => {
        if (child instanceof Mesh || child instanceof LineSegments) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => material.dispose());
        }
      })
    );
  });
}
