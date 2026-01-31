export const convertVectorToGlsl = (strokes: any[], canvasWidth: number, canvasHeight: number): string => {
  if (!strokes || strokes.length === 0) {
    return '';
  }

  // Limit number of strokes to prevent shader from becoming too large
  const maxStrokes = 10;
  const maxPointsPerStroke = 50;
  const limitedStrokes = strokes.slice(0, maxStrokes);

  const numPaths = limitedStrokes.length;
  const scale = Math.min(canvasWidth, canvasHeight) / 2;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const pathSegments = limitedStrokes
    .map((stroke, strokeIndex) => {
      const points = stroke.points;
      if (!points || points.length < 2) return null;

      // Downsample points if there are too many
      let sampledPoints = points;
      if (points.length > maxPointsPerStroke) {
        sampledPoints = [];
        const step = points.length / maxPointsPerStroke;
        for (let i = 0; i < maxPointsPerStroke; i++) {
          const index = Math.floor(i * step);
          sampledPoints.push(points[index]);
        }
        // Always include the last point
        sampledPoints.push(points[points.length - 1]);
      }

      const normalizedPoints = sampledPoints.map((p: any) => ({
        x: (p.x - centerX) / scale,
        y: -(p.y - centerY) / scale, // Flip Y for shader coordinates
      }));

      const pathLength = normalizedPoints.length - 1;

      let segmentCode = '';
      for (let i = 0; i < normalizedPoints.length - 1; i++) {
        const p1 = normalizedPoints[i];
        const p2 = normalizedPoints[i + 1];
        const segmentStart = i / pathLength;
        const segmentEnd = (i + 1) / pathLength;

        segmentCode += `
    if (localT >= ${segmentStart.toFixed(3)} && localT <= ${segmentEnd.toFixed(3)}) {
      float segT = (localT - ${segmentStart.toFixed(3)}) / ${(segmentEnd - segmentStart).toFixed(3)};
      return mix(vec2(${p1.x.toFixed(3)}, ${p1.y.toFixed(3)}), vec2(${p2.x.toFixed(3)}, ${p2.y.toFixed(3)}), segT);
    }`;
      }

      return segmentCode;
    })
    .filter(seg => seg !== null);

  const pathCases = pathSegments
    .map(
      (segmentCode, i) => `
  if (index == ${i}) {
    float localT = fract(t);${segmentCode}
    return vec2(0.0, 0.0);
  }`
    )
    .join('\n');

  const glslCode = `
#define NUM_PATHS ${numPaths}

vec2 getPathPoint(int index, float t) {
${pathCases}
  return vec2(0.0, 0.0);
}

vec2 drawPath(float t) {
  float cycleTime = float(NUM_PATHS);
  float pathIndex = mod(t, cycleTime);
  int index = int(pathIndex);
  
  if (index >= NUM_PATHS) index = NUM_PATHS - 1;
  return getPathPoint(index, t);
}
`;

  return glslCode.trim();
};
