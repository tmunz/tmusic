import { useRef, useEffect, useCallback } from 'react';
import { Stroke } from '../DrawingCanvas';
import { simplifyPath } from './VectorUtils';

interface UseVectorVisualizationProps {
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  strokes: Stroke[];
  enabled: boolean;
  speed?: number;
  angleThreshold?: number;
  onTimeUpdate?: (time: number) => void;
  onStrokeIndexUpdate?: (index: number) => void;
  onTotalDurationUpdate?: (duration: number) => void;
}

export const useVectorVisualization = ({
  ctx,
  canvas,
  strokes,
  enabled,
  speed = 1,
  angleThreshold = 0,
  onTimeUpdate,
  onStrokeIndexUpdate,
  onTotalDurationUpdate,
}: UseVectorVisualizationProps) => {
  const timeRef = useRef(0);
  const currentPointRef = useRef<{ x: number; y: number } | null>(null);
  const callbacksRef = useRef({ onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate });

  useEffect(() => {
    callbacksRef.current = { onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate };
  }, [onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate]);

  const drawVectorVisualization = useCallback(() => {
    if (!ctx || !canvas || !enabled || !strokes || strokes.length === 0) {
      return;
    }

    const totalPoints = strokes.reduce((sum, s) => sum + s.points.length, 0);
    if (totalPoints === 0) return;

    const scale = Math.min(canvas.width, canvas.height) / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate total path lengths for all strokes
    const strokeData: Array<{
      points: Array<{ x: number; y: number }>;
      length: number;
      distances: number[];
      normalizedDistances: number[];
    }> = [];
    let totalPathLength = 0;

    for (const stroke of strokes) {
      if (!stroke || stroke.points.length < 2) {
        strokeData.push({ points: [], length: 0, distances: [], normalizedDistances: [] });
        continue;
      }

      const normalizedPoints = stroke.points.map((p: any) => ({
        x: (p.x - centerX) / scale,
        y: -(p.y - centerY) / scale,
      }));

      const simplifiedPoints = simplifyPath(normalizedPoints, angleThreshold);

      const canvasPoints = simplifiedPoints.map(p => ({
        x: p.x * scale + centerX,
        y: -p.y * scale + centerY,
      }));

      // Calculate cumulative distances
      const distances = [0];
      let totalDistance = 0;
      for (let i = 1; i < canvasPoints.length; i++) {
        const p1 = canvasPoints[i - 1];
        const p2 = canvasPoints[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        totalDistance += segmentLength;
        distances.push(totalDistance);
      }

      const normalizedDistances = distances.map(d => (totalDistance > 0 ? d / totalDistance : 0));

      strokeData.push({
        points: canvasPoints,
        length: totalDistance,
        distances,
        normalizedDistances,
      });

      totalPathLength += totalDistance;
    }

    // Calculate time ranges for each stroke based on path length
    const timeRanges: Array<{ start: number; end: number }> = [];
    let cumulativeTime = 0;
    for (const data of strokeData) {
      const strokeDuration = totalPathLength > 0 ? data.length / totalPathLength : 0;
      timeRanges.push({ start: cumulativeTime, end: cumulativeTime + strokeDuration });
      cumulativeTime += strokeDuration;
    }

    const totalPeriod = totalPathLength / 100.0;
    const normalizedTime = (((timeRef.current % totalPeriod) + totalPeriod) % totalPeriod) / totalPeriod;

    if (callbacksRef.current.onTimeUpdate) callbacksRef.current.onTimeUpdate(timeRef.current);
    if (callbacksRef.current.onTotalDurationUpdate) callbacksRef.current.onTotalDurationUpdate(totalPeriod);

    // Find which stroke we're currently on
    let currentStrokeIndex = 0;
    let t = 0;
    for (let i = 0; i < timeRanges.length; i++) {
      if (normalizedTime >= timeRanges[i].start && normalizedTime < timeRanges[i].end) {
        currentStrokeIndex = i;
        const duration = timeRanges[i].end - timeRanges[i].start;
        t = duration > 0 ? (normalizedTime - timeRanges[i].start) / duration : 0;
        break;
      }
    }

    if (callbacksRef.current.onStrokeIndexUpdate) callbacksRef.current.onStrokeIndexUpdate(currentStrokeIndex);

    const currentStrokeData = strokeData[currentStrokeIndex];
    if (!currentStrokeData || currentStrokeData.points.length < 2) return;

    const canvasPoints = currentStrokeData.points;
    const normalizedDistances = currentStrokeData.normalizedDistances;

    // Draw all start points (vector origins)
    ctx.fillStyle = `hsla(${currentStrokeIndex * 137.5}, 70%, 50%, 0.5)`;
    for (let i = 0; i < canvasPoints.length - 1; i++) {
      const point = canvasPoints[i];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Find which segment we're on based on arc-length parameterization
    let segmentIndex = 0;
    for (let i = 0; i < normalizedDistances.length - 1; i++) {
      if (t >= normalizedDistances[i] && t <= normalizedDistances[i + 1]) {
        segmentIndex = i;
        break;
      }
    }

    const idx = Math.min(segmentIndex, canvasPoints.length - 2);
    const segmentStart = normalizedDistances[idx];
    const segmentEnd = normalizedDistances[idx + 1];
    const segmentRange = segmentEnd - segmentStart;
    const segT = segmentRange > 0 ? (t - segmentStart) / segmentRange : 0;

    const p1 = canvasPoints[idx];
    const p2 = canvasPoints[idx + 1];

    const currentX = p1.x + (p2.x - p1.x) * segT;
    const currentY = p1.y + (p2.y - p1.y) * segT;

    // Draw current point
    ctx.fillStyle = `hsl(${currentStrokeIndex * 137.5}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw direction indicator (small line showing direction of travel)
    if (idx + 1 < canvasPoints.length) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length > 0) {
        const dirX = dx / length;
        const dirY = dy / length;
        const arrowLength = 20;

        ctx.strokeStyle = `hsl(${currentStrokeIndex * 137.5}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX + dirX * arrowLength, currentY + dirY * arrowLength);
        ctx.stroke();
      }
    }

    currentPointRef.current = { x: currentX, y: currentY };
    timeRef.current += 0.01 * speed;
  }, [ctx, canvas, enabled, strokes, speed, angleThreshold]);

  const getCurrentPoint = useCallback(() => {
    return currentPointRef.current;
  }, []);

  useEffect(() => {
    return () => {
      timeRef.current = 0;
    };
  }, []);

  return {
    drawVectorVisualization,
    getCurrentPoint,
    timeRef,
  };
};
