export const calculateAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number => {
  const v1x = p1.x - p2.x;
  const v1y = p1.y - p2.y;
  const v2x = p3.x - p2.x;
  const v2y = p3.y - p2.y;

  const dot = v1x * v2x + v1y * v2y;
  const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const len2 = Math.sqrt(v2x * v2x + v2y * v2y);

  if (len1 === 0 || len2 === 0) return 0;

  const cosAngle = dot / (len1 * len2);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  return (angleRad * 180) / Math.PI;
};

export const simplifyPath = (points: any[], angleThresholdDegrees: number): any[] => {
  if (points.length <= 2) return points;
  if (angleThresholdDegrees <= 0) return points;
  const minDistance = 0.01; // Minimum distance between points in normalized coordinates
  const deduplicated = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const lastPoint = deduplicated[deduplicated.length - 1];
    const currentPoint = points[i];
    const dx = currentPoint.x - lastPoint.x;
    const dy = currentPoint.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= minDistance || i === points.length - 1) {
      deduplicated.push(currentPoint);
    }
  }

  if (deduplicated.length <= 2) return deduplicated;

  const simplified = [deduplicated[0]]; // Always keep first point

  for (let i = 1; i < deduplicated.length - 1; i++) {
    const prevPoint = simplified[simplified.length - 1];
    const currentPoint = deduplicated[i];
    const nextPoint = deduplicated[i + 1];

    const angle = calculateAngle(prevPoint, currentPoint, nextPoint);
    const deviation = Math.abs(180 - angle);
    if (deviation >= angleThresholdDegrees) {
      simplified.push(currentPoint);
    }
  }

  simplified.push(deduplicated[deduplicated.length - 1]);

  return simplified;
};
