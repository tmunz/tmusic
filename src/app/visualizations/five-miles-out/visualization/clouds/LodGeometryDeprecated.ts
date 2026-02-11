import { BufferGeometry, BufferAttribute } from 'three';

export function createLodGeometry(size: number, segments: number, lod: number): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const radius = size / 2;
  const vertexMap = new Map<string, number>();

  const getVertex = (x: number, y: number): number => {
    const key = `${x.toFixed(6)},${y.toFixed(6)}`;
    if (vertexMap.has(key)) {
      return vertexMap.get(key)!;
    }
    const index = positions.length / 3;
    positions.push(x, y, 0);
    uvs.push(x / size + 0.5, y / size + 0.5);
    normals.push(0, 0, 1);
    vertexMap.set(key, index);
    return index;
  };

  // Calculate radii with LOD-based distance scaling
  // For lod=1: linear spacing, for lod>1: exponential growth
  const radii: number[] = [0];
  if (lod === 1) {
    for (let i = 1; i <= segments; i++) {
      radii.push((i / segments) * radius);
    }
  } else {
    const baseDistance = (radius * (lod - 1)) / (Math.pow(lod, segments) - 1);
    let currentRadius = 0;
    for (let i = 0; i < segments; i++) {
      currentRadius += baseDistance * Math.pow(lod, i);
      radii.push(currentRadius);
    }
  }

  for (let ring = 0; ring < segments; ring++) {
    const r1 = radii[ring];
    const r2 = radii[ring + 1];

    for (let sector = 0; sector < 6; sector++) {
      const angle1 = (sector / 6) * Math.PI * 2;
      const angle2 = ((sector + 1) / 6) * Math.PI * 2;

      if (ring === 0) {
        const corner1 = getVertex(Math.cos(angle1) * r2, Math.sin(angle1) * r2);
        const corner2 = getVertex(Math.cos(angle2) * r2, Math.sin(angle2) * r2);
        const center = getVertex(0, 0);

        indices.push(center, corner1, corner2);
      } else if (ring % 2 === 1) {
        const prevCorner1 = getVertex(Math.cos(angle1) * r1, Math.sin(angle1) * r1);
        const prevCorner2 = getVertex(Math.cos(angle2) * r1, Math.sin(angle2) * r1);

        const corner1X = Math.cos(angle1) * r2;
        const corner1Y = Math.sin(angle1) * r2;
        const corner1 = getVertex(corner1X, corner1Y);

        const corner2X = Math.cos(angle2) * r2;
        const corner2Y = Math.sin(angle2) * r2;
        const corner2 = getVertex(corner2X, corner2Y);

        const middlePoint = getVertex((corner1X + corner2X) / 2, (corner1Y + corner2Y) / 2);
        indices.push(prevCorner1, corner1, middlePoint);
        indices.push(prevCorner1, middlePoint, prevCorner2);
        indices.push(prevCorner2, middlePoint, corner2);
      } else {
        const prevCorner1 = getVertex(Math.cos(angle1) * r1, Math.sin(angle1) * r1);
        const prevCorner2 = getVertex(Math.cos(angle2) * r1, Math.sin(angle2) * r1);

        const prevCorner1X = Math.cos(angle1) * r1;
        const prevCorner1Y = Math.sin(angle1) * r1;
        const prevCorner2X = Math.cos(angle2) * r1;
        const prevCorner2Y = Math.sin(angle2) * r1;
        const prevCenter = getVertex((prevCorner1X + prevCorner2X) / 2, (prevCorner1Y + prevCorner2Y) / 2);

        const corner1 = getVertex(Math.cos(angle1) * r2, Math.sin(angle1) * r2);
        const corner2 = getVertex(Math.cos(angle2) * r2, Math.sin(angle2) * r2);

        indices.push(prevCorner1, corner1, prevCenter);
        indices.push(corner1, corner2, prevCenter);
        indices.push(corner2, prevCorner2, prevCenter);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
  geometry.setIndex(indices);

  return geometry;
}
