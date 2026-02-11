import { BufferGeometry, BufferAttribute } from 'three';

export function createLodGeometry(size: number, segments: number, lod: number): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const maxRows = segments;
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

  const getRowStep = (row: number): number => {
    if (lod >= 1) return 1;

    const progressiveLod = lod * lod;
    const opportunityFraction = lod === 0 ? 1 : Math.floor(1 / (1 - progressiveLod));

    let currentStep = 1;
    let rowBoundary = 0;
    let opportunityCount = 0;
    let iterationsAtCurrentStep = 0;

    for (let i = 0; i < segments; i++) {
      const nextBoundary = rowBoundary + currentStep;

      if (row >= rowBoundary && row < nextBoundary) {
        return currentStep;
      }

      iterationsAtCurrentStep++;
      rowBoundary = nextBoundary;

      let canConsiderIncrease = false;
      if (currentStep === 1) {
        canConsiderIncrease = iterationsAtCurrentStep >= 4;
      } else {
        canConsiderIncrease = iterationsAtCurrentStep >= 2;
      }

      if (canConsiderIncrease) {
        const remainingRows = maxRows - rowBoundary;
        const nextStep = currentStep * 2;
        const canDouble = remainingRows >= 2 * nextStep;

        if (canDouble) {
          opportunityCount++;
          const shouldIncrease = opportunityCount % opportunityFraction === 0;

          if (shouldIncrease && lod < 1) {
            currentStep = nextStep;
            iterationsAtCurrentStep = 0;
          } else {
            iterationsAtCurrentStep = 0;
          }
        } else {
          iterationsAtCurrentStep = 0;
        }
      }
    }
    return currentStep;
  };


  for (let sector = 0; sector < 6; sector++) {
    const angle1 = (sector / 6) * Math.PI * 2;
    const angle2 = ((sector + 1) / 6) * Math.PI * 2;

    for (let row = 0; row < maxRows;) {
      const step = getRowStep(row);
      const prevStep = row > 0 ? getRowStep(row - 1) : step;
      const nextRow = Math.min(row + step, maxRows);
      const isStepTransition = row > 0 && step > prevStep;
      const colCount = row === 0 ? 0 : row;

      for (let col = 0; col <= colCount; col += step) {
        const nextCol = Math.min(col + step, nextRow);

        const r1 = (row / maxRows) * radius;
        const r2 = (nextRow / maxRows) * radius;
        const t1 = row > 0 ? col / row : 0;
        const t2 = nextRow > 0 ? col / nextRow : 0;
        const t3 = nextRow > 0 ? nextCol / nextRow : 0;

        const x1 = Math.cos(angle1) * r1 * (1 - t1) + Math.cos(angle2) * r1 * t1;
        const y1 = Math.sin(angle1) * r1 * (1 - t1) + Math.sin(angle2) * r1 * t1;
        const x2 = Math.cos(angle1) * r2 * (1 - t2) + Math.cos(angle2) * r2 * t2;
        const y2 = Math.sin(angle1) * r2 * (1 - t2) + Math.sin(angle2) * r2 * t2;
        const x3 = Math.cos(angle1) * r2 * (1 - t3) + Math.cos(angle2) * r2 * t3;
        const y3 = Math.sin(angle1) * r2 * (1 - t3) + Math.sin(angle2) * r2 * t3;

        const v1 = getVertex(x1, y1);
        const v2 = getVertex(x2, y2);
        const v3 = getVertex(x3, y3);

        indices.push(v1, v2, v3);

        if (col < row) {
          const t4 = row > 0 ? nextCol / row : 0;
          const x4 = Math.cos(angle1) * r1 * (1 - t4) + Math.cos(angle2) * r1 * t4;
          const y4 = Math.sin(angle1) * r1 * (1 - t4) + Math.sin(angle2) * r1 * t4;
          const v4 = getVertex(x4, y4);

          // split the triangle (v1, v3, v4) which has two vertices at old edge
          if (isStepTransition) {
            let prevIntermediateCol = col;
            for (let intermediateCol = col + prevStep; intermediateCol < nextCol; intermediateCol += prevStep) {
              const tIntermediate = row > 0 ? intermediateCol / row : 0;
              const xIntermediate = Math.cos(angle1) * r1 * (1 - tIntermediate) + Math.cos(angle2) * r1 * tIntermediate;
              const yIntermediate = Math.sin(angle1) * r1 * (1 - tIntermediate) + Math.sin(angle2) * r1 * tIntermediate;
              const vIntermediate = getVertex(xIntermediate, yIntermediate);
              
              const tPrev = row > 0 ? prevIntermediateCol / row : 0;
              const xPrev = Math.cos(angle1) * r1 * (1 - tPrev) + Math.cos(angle2) * r1 * tPrev;
              const yPrev = Math.sin(angle1) * r1 * (1 - tPrev) + Math.sin(angle2) * r1 * tPrev;
              const vPrev = getVertex(xPrev, yPrev);
              
              indices.push(vPrev, v3, vIntermediate);
              
              prevIntermediateCol = intermediateCol;
            }
            const tPrev = row > 0 ? prevIntermediateCol / row : 0;
            const xPrev = Math.cos(angle1) * r1 * (1 - tPrev) + Math.cos(angle2) * r1 * tPrev;
            const yPrev = Math.sin(angle1) * r1 * (1 - tPrev) + Math.sin(angle2) * r1 * tPrev;
            const vPrev = getVertex(xPrev, yPrev);
            indices.push(vPrev, v3, v4);
          } else {
            indices.push(v1, v3, v4);
          }
        }
      }

      row = nextRow;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
  geometry.setIndex(indices);

  return geometry;
}
