import { Mesh, MeshStandardMaterial, ShaderMaterial } from 'three';
import * as geometryBuilder from './buildBuildingGeometry';
import { BUILDING_ARENA_CLEARANCE, BUILDING_ROAD_HALF_WIDTH } from './generateBuildings';
import { cloneBuildingModel, createBuildingLibrary, disposeBuildingLibrary, placeBuildings } from './buildingLibrary';

const library = createBuildingLibrary();
afterAll(() => disposeBuildingLibrary(library));

it('prebuilds exactly 30 different models covering all ten silhouettes', () => {
  expect(library).toHaveLength(30);
  expect(new Set(library.map(template => template.kind)).size).toBe(10);
  expect(new Set(library.map(template => JSON.stringify(template.sections))).size).toBe(30);
  library.forEach(template => {
    expect(template.geometry.bodies.boundingSphere).not.toBeNull();
    expect(template.geometry.outlines.boundingSphere).not.toBeNull();
    const mesh = template.wireframe.children[0] as Mesh;
    expect(mesh.geometry).toBe(template.geometry.bodies);
    expect((mesh.material as ShaderMaterial).fog).toBe(true);
    expect((mesh.material as ShaderMaterial).uniforms.fogFar).toBeDefined();
    expect((mesh.material as ShaderMaterial).uniforms.maxY.value).toBe(template.bounds.max.y);
  });
});

it('uses about one tenth of the old four-lots-per-tile density without building geometry during placement', () => {
  const build = jest.spyOn(geometryBuilder, 'buildBuildingGeometry');
  try {
    const tiles = Array.from({ length: 2000 }, (_, i) => ({ x: (i % 50) + 10, z: Math.floor(i / 50) }));
    const placements = placeBuildings(tiles, 50, library);
    const fraction = placements.length / (tiles.length * 4);
    expect(fraction).toBeGreaterThan(0.08);
    expect(fraction).toBeLessThan(0.12);
    expect(build).not.toHaveBeenCalled();
    placements.forEach(placement => expect(library[placement.template.index]).toBe(placement.template));
    expect(
      placeBuildings(tiles.slice().reverse(), 50, library)
        .reverse()
        .map(p => p.id)
        .sort()
    ).toEqual(placements.map(p => p.id).sort());
  } finally {
    build.mockRestore();
  }
});

it('keeps full footprints clear of the avenue and moved arena, preserving surviving placements', () => {
  const arena = { x: 150, z: -100, size: 200 };
  const tiles = Array.from({ length: 400 }, (_, i) => ({ x: (i % 20) - 8, z: Math.floor(i / 20) - 10 }));
  const original = placeBuildings(tiles, 50, library);
  const filtered = placeBuildings(tiles, 50, library, arena);
  expect(filtered.length).toBeGreaterThan(0);
  expect(filtered.length).toBeLessThan(original.length);
  filtered.forEach(placement => {
    expect(placement).toEqual(original.find(candidate => candidate.id === placement.id));
    const bounds = placement.template.bounds;
    const left = placement.x + bounds.min.x;
    const right = placement.x + bounds.max.x;
    const near = placement.z + bounds.min.z;
    const far = placement.z + bounds.max.z;
    expect(left > BUILDING_ROAD_HALF_WIDTH || right < -BUILDING_ROAD_HALF_WIDTH).toBe(true);
    const extent = arena.size / 2 + BUILDING_ARENA_CLEARANCE;
    expect(
      right < arena.x - extent || left > arena.x + extent || far < arena.z - extent || near > arena.z + extent
    ).toBe(true);
  });
});

it('shares geometry while giving placements independent fade materials and reveal uniforms', () => {
  const template = library[0];
  const model = cloneBuildingModel(template.model);
  const reveal = cloneBuildingModel(template.wireframe);
  const mesh = model.children[0] as Mesh;
  const wireframe = reveal.children[0] as Mesh;
  expect(mesh.geometry).toBe(template.geometry.bodies);
  expect(wireframe.geometry).toBe(template.geometry.bodies);
  expect(mesh.material).not.toBe((template.model.children[0] as Mesh).material);
  const material = wireframe.material as ShaderMaterial;
  material.uniforms.revealProgress.value = 0.5;
  expect(((template.wireframe.children[0] as Mesh).material as ShaderMaterial).uniforms.revealProgress.value).toBe(0);
  (mesh.material as ShaderMaterial).dispose();
  material.dispose();
});

it('keeps black surfaces and fade materials free of the battle color gradient', () => {
  library.forEach(template => {
    const material = (template.model.children[0] as Mesh).material as MeshStandardMaterial;
    expect(material.onBeforeCompile).toBe(MeshStandardMaterial.prototype.onBeforeCompile);
    expect(template.fadeMaterial.onBeforeCompile).toBe(MeshStandardMaterial.prototype.onBeforeCompile);
    expect(material.color.getHexString()).toBe('000000');
    expect(material.emissive.getHex()).toBe(0);
  });
});
