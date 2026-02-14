import { BufferGeometry, BufferAttribute } from 'three';

export function createLodGeometry(size: number, segments: number, lod: number): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const halfSize = size / 2;
  
  // Helper to get or create vertex
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

  // Convert grid coordinates to world coordinates
  const gridToWorld = (gridX: number, gridY: number): [number, number] => {
    return [
      (gridX / segments) * size - halfSize,
      (gridY / segments) * size - halfSize
    ];
  };

  // Define rings from center outward
  // Each ring: [startRow, endRow, startCol, endCol, cellSize]
  const center = segments / 2;
  const rings: Array<[number, number, number, number, number]> = [];
  
  if (lod >= 1) {
    rings.push([0, segments, 0, segments, 1]);
  } else {
    // Calculate increase frequency: 1/(1-lod) -> increase every 2^n rows/columns
    const n = lod === 0 ? 1 : Math.round(1 / (1 - lod));
    const rowsBeforeIncrease = Math.pow(2, n-1);
    
    const centerCells = 2;
    let currentStart = Math.floor(center - centerCells / 2);
    let currentEnd = currentStart + centerCells;
    let cellSize = 1;
    let rowsAtCurrentSize = 0;
    
    rings.push([currentStart, currentEnd, currentStart, currentEnd, cellSize]);
    rowsAtCurrentSize += 2;
    
    while (currentStart > 0 || currentEnd < segments) {
      const prevStart = currentStart;
      const prevEnd = currentEnd;
      
      if (rowsAtCurrentSize >= rowsBeforeIncrease) {
        cellSize++;
        rowsAtCurrentSize = 0;
      }
      
      const ringsWidth = 1;
      
      currentStart = Math.max(0, currentStart - ringsWidth * cellSize);
      currentEnd = Math.min(segments, currentEnd + ringsWidth * cellSize);
      
      // Add this ring (top, bottom, left, right strips)
      if (prevStart > currentStart) {
        rings.push([currentStart, prevStart, currentStart, currentEnd, cellSize]); // Top
      }
      if (currentEnd > prevEnd) {
        rings.push([prevEnd, currentEnd, currentStart, currentEnd, cellSize]); // Bottom
      }
      if (prevStart > currentStart) {
        rings.push([prevStart, prevEnd, currentStart, prevStart, cellSize]); // Left
      }
      if (currentEnd > prevEnd) {
        rings.push([prevStart, prevEnd, prevEnd, currentEnd, cellSize]); // Right
      }
      
      rowsAtCurrentSize += 1;
      
      // Stop if we've covered the entire grid or cell size is too large
      if ((currentStart <= 0 && currentEnd >= segments) || cellSize > segments / 4) {
        break;
      }
    }
  }
  
  // Store all cells for two-pass processing
  const cells: Array<[number, number, number, number]> = [];
  
  // First pass: Create all corner vertices
  for (const [rowStart, rowEnd, colStart, colEnd, cellSize] of rings) {
    for (let row = rowStart; row < rowEnd; row += cellSize) {
      for (let col = colStart; col < colEnd; col += cellSize) {
        const actualStepRow = Math.min(cellSize, rowEnd - row, segments - row);
        const actualStepCol = Math.min(cellSize, colEnd - col, segments - col);
        
        if (actualStepRow <= 0 || actualStepCol <= 0) continue;
        
        cells.push([row, col, actualStepRow, actualStepCol]);
        
        // Create corner vertices
        const [x0, y0] = gridToWorld(col, row);
        const [x1, y1] = gridToWorld(col + actualStepCol, row);
        const [x2, y2] = gridToWorld(col + actualStepCol, row + actualStepRow);
        const [x3, y3] = gridToWorld(col, row + actualStepRow);
        
        getVertex(x0, y0);
        getVertex(x1, y1);
        getVertex(x2, y2);
        getVertex(x3, y3);
      }
    }
  }
  
  // Helper to find all vertices along an edge
  const findVerticesAlongEdge = (
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number
  ): number[] => {
    const vertices: Array<{ idx: number; t: number }> = [];
    
    const [startX, startY] = gridToWorld(startCol, startRow);
    const [endX, endY] = gridToWorld(endCol, endRow);
    
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Check all possible grid points along the edge
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    
    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        const [x, y] = gridToWorld(c, r);
        const key = `${x.toFixed(6)},${y.toFixed(6)}`;
        
        if (vertexMap.has(key)) {
          // Check if this point is on the edge line
          const vx = x - startX;
          const vy = y - startY;
          
          // Cross product should be ~0 if point is on the line
          const cross = Math.abs(vx * dy - vy * dx);
          
          if (cross < 0.001 * length) {
            // Point is on the line, calculate parameter t
            const t = length > 0 ? (vx * dx + vy * dy) / (length * length) : 0;
            
            if (t >= -0.001 && t <= 1.001) {
              vertices.push({ idx: vertexMap.get(key)!, t });
            }
          }
        }
      }
    }
    
    // Sort by parameter t
    vertices.sort((a, b) => a.t - b.t);
    
    return vertices.map(v => v.idx);
  };
  
  // Second pass: Triangulate each cell with proper edge stitching
  for (const [row, col, actualStepRow, actualStepCol] of cells) {
    // Get corner positions
    const [x0, y0] = gridToWorld(col, row);
    const [x1, y1] = gridToWorld(col + actualStepCol, row);
    const [x2, y2] = gridToWorld(col + actualStepCol, row + actualStepRow);
    const [x3, y3] = gridToWorld(col, row + actualStepRow);
    
    // Find all vertices along each edge
    const bottomEdge = findVerticesAlongEdge(col, row, col + actualStepCol, row);
    const rightEdge = findVerticesAlongEdge(col + actualStepCol, row, col + actualStepCol, row + actualStepRow);
    const topEdge = findVerticesAlongEdge(col + actualStepCol, row + actualStepRow, col, row + actualStepRow);
    const leftEdge = findVerticesAlongEdge(col, row + actualStepRow, col, row);
    
    // Build boundary loop (removing the last vertex of each edge to avoid duplicates)
    const boundary: number[] = [];
    
    boundary.push(...bottomEdge);
    if (rightEdge.length > 1) boundary.push(...rightEdge.slice(1));
    if (topEdge.length > 1) boundary.push(...topEdge.slice(1));
    if (leftEdge.length > 1) boundary.push(...leftEdge.slice(1, -1));
    
    // Triangulate the cell
    if (boundary.length > 4) {
      // Complex boundary - use triangle fan from center
      const centerX = (x0 + x1 + x2 + x3) / 4;
      const centerY = (y0 + y1 + y2 + y3) / 4;
      const centerVertex = getVertex(centerX, centerY);
      
      for (let i = 0; i < boundary.length; i++) {
        const next = (i + 1) % boundary.length;
        indices.push(centerVertex, boundary[i], boundary[next]);
      }
    } else if (boundary.length === 4) {
      // Simple quad
      indices.push(boundary[0], boundary[1], boundary[2]);
      indices.push(boundary[0], boundary[2], boundary[3]);
    } else if (boundary.length === 3) {
      // Triangle
      indices.push(boundary[0], boundary[1], boundary[2]);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();

  return geometry;
}
