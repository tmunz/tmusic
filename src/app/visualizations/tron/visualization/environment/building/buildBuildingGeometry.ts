import { BufferGeometry, Float32BufferAttribute } from 'three';
import { BuildingSection, BuildingVector } from './generateBuildings';

export const BUILDING_CYLINDER_SIDES = 32;

// Both surfaces and outlines use the same roof vertices, including the angled cut.
export function buildBuildingGeometry(sections: BuildingSection[]) {
  const faces: number[] = [];
  const edges: number[] = [];
  const triangle = (a: BuildingVector, b: BuildingVector, c: BuildingVector) => faces.push(...a, ...b, ...c);
  const line = (a: BuildingVector, b: BuildingVector) => edges.push(...a, ...b);

  sections.forEach(({ position, size, shape, roofCut = [0, 0], roundProfile }) => {
    const [x, y, z] = position;
    const [w, h, d] = size;
    // Counterclockwise when seen from above. Boxes and cylinders share the extrusion logic.
    const footprint: [number, number][] =
      shape === 'cylinder'
        ? Array.from({ length: BUILDING_CYLINDER_SIDES }, (_, i) => {
            const angle = (-i * Math.PI * 2) / BUILDING_CYLINDER_SIDES;
            return [Math.cos(angle) / 2, Math.sin(angle) / 2];
          })
        : [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5],
          ];
    const profile: [number, number][] =
      shape === 'cylinder' && roundProfile
        ? roundProfile
        : [
            [0, 1],
            [1, 1],
          ];
    const rings: BuildingVector[][] = profile.map(([height, radius], ring) =>
      footprint.map(([px, pz]) => [
        x + px * w * radius,
        y -
          h / 2 +
          height * h -
          (ring === profile.length - 1
            ? (Math.abs(roofCut[0]) + Math.abs(roofCut[1])) / 2 - roofCut[0] * px * radius - roofCut[1] * pz * radius
            : 0),
        z + pz * d * radius,
      ])
    );
    const bottom = rings[0];
    const top = rings[rings.length - 1];
    const pointed = profile[profile.length - 1][1] === 0;

    for (let ring = 0; ring < rings.length - 1; ring++) {
      const lower = rings[ring];
      const upper = rings[ring + 1];
      const apex = profile[ring + 1][1] === 0;
      for (let i = 0; i < footprint.length; i++) {
        const next = (i + 1) % footprint.length;
        triangle(lower[i], lower[next], upper[next]);
        if (!apex) triangle(lower[i], upper[next], upper[i]);
        // Follow curved silhouettes without adding horizontal bands at profile rings.
        if (shape === 'box' || i % (BUILDING_CYLINDER_SIDES / 4) === 0) line(lower[i], upper[i]);
      }
    }
    for (let i = 0; i < footprint.length; i++) {
      const next = (i + 1) % footprint.length;
      line(bottom[i], bottom[next]);
      if (!pointed) line(top[i], top[next]);
    }
    for (let i = 1; i < footprint.length - 1; i++) {
      if (!pointed) triangle(top[0], top[i], top[i + 1]);
      triangle(bottom[0], bottom[i + 1], bottom[i]);
    }
  });

  const bodies = new BufferGeometry();
  bodies.setAttribute('position', new Float32BufferAttribute(faces, 3));
  bodies.computeVertexNormals();
  bodies.computeBoundingSphere();
  const outlines = new BufferGeometry();
  outlines.setAttribute('position', new Float32BufferAttribute(edges, 3));
  outlines.computeBoundingSphere();
  return { bodies, outlines };
}
