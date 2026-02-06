import { simplifyPath } from './VectorUtils';

export const convertVectorToGlsl = (
  strokes: any[],
  canvasWidth: number,
  canvasHeight: number,
  angleThreshold: number = 0
): string => {
  if (!strokes || strokes.length === 0) {
    return '';
  }

  const maxPointsPerStroke = 50;
  const numPaths = strokes.length;
  const scale = Math.min(canvasWidth, canvasHeight) / 2;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // First pass: calculate total path lengths for all strokes
  const strokeLengths: number[] = [];
  let totalPathLength = 0;

  const pathSegments = strokes
    .map((stroke, strokeIndex) => {
      const points = stroke.points;
      if (!points || points.length < 2) {
        strokeLengths.push(0);
        return null;
      }

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

      // Apply path simplification based on angle threshold
      const simplifiedPoints = simplifyPath(normalizedPoints, angleThreshold);

      // Calculate cumulative distances for arc-length parameterization
      const distances = [0];
      let totalDistance = 0;
      for (let i = 1; i < simplifiedPoints.length; i++) {
        const p1 = simplifiedPoints[i - 1];
        const p2 = simplifiedPoints[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        totalDistance += segmentLength;
        distances.push(totalDistance);
      }

      strokeLengths.push(totalDistance);
      totalPathLength += totalDistance;

      // Normalize distances to [0, 1]
      const normalizedDistances = distances.map(d => (totalDistance > 0 ? d / totalDistance : 0));

      let segmentCode = '';
      for (let i = 0; i < simplifiedPoints.length - 1; i++) {
        const p1 = simplifiedPoints[i];
        const p2 = simplifiedPoints[i + 1];
        const segmentStart = normalizedDistances[i];
        const segmentEnd = normalizedDistances[i + 1];

        segmentCode += `
    if (localT >= ${segmentStart.toFixed(3)} && localT <= ${segmentEnd.toFixed(3)}) {
      float segT = (localT - ${segmentStart.toFixed(3)}) / ${(segmentEnd - segmentStart).toFixed(3)};
      return mix(vec2(${p1.x.toFixed(3)}, ${p1.y.toFixed(3)}), vec2(${p2.x.toFixed(3)}, ${p2.y.toFixed(3)}), segT);
    }`;
      }

      return segmentCode;
    })
    .filter(seg => seg !== null);

  // Calculate cumulative time boundaries based on path lengths
  const timeRanges: Array<{ start: number; end: number }> = [];
  let cumulativeTime = 0;
  for (let i = 0; i < strokeLengths.length; i++) {
    const strokeDuration = totalPathLength > 0 ? strokeLengths[i] / totalPathLength : 0;
    timeRanges.push({ start: cumulativeTime, end: cumulativeTime + strokeDuration });
    cumulativeTime += strokeDuration;
  }

  const pathCases = pathSegments
    .map((segmentCode, i) => {
      const range = timeRanges[i];
      const duration = range.end - range.start;
      return `
  if (t >= ${range.start.toFixed(6)} && t < ${range.end.toFixed(6)}) {
    float localT = ${duration > 0 ? `(t - ${range.start.toFixed(6)}) / ${duration.toFixed(6)}` : '0.0'};${segmentCode}
    return vec2(0.0, 0.0);
  }`;
    })
    .join('\n');

  const glslCode = `
#define NUM_PATHS ${numPaths}

vec2 getPathPoint(float t) {
${pathCases}
  return vec2(0.0, 0.0);
}

vec2 drawPath(float t) {
  float normalizedT = fract(t / ${totalPathLength.toFixed(8)});
  return getPathPoint(normalizedT);
}
`;

  return glslCode.trim();
};
