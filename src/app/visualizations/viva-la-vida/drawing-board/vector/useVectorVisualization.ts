import { useRef, useEffect, useCallback } from 'react';
import { Stroke } from '../DrawingCanvas';

interface UseVectorVisualizationProps {
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  strokes: Stroke[];
  enabled: boolean;
  speed?: number;
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

    const periodPerStroke = 1;
    const totalPeriod = periodPerStroke * strokes.length;
    const normalizedTime = timeRef.current % totalPeriod;
    const currentStrokeIndex = Math.floor(normalizedTime / periodPerStroke);
    const strokeTime = normalizedTime % periodPerStroke;
    const t = strokeTime / periodPerStroke;

    if (callbacksRef.current.onTimeUpdate) callbacksRef.current.onTimeUpdate(timeRef.current);
    if (callbacksRef.current.onStrokeIndexUpdate) callbacksRef.current.onStrokeIndexUpdate(currentStrokeIndex);
    if (callbacksRef.current.onTotalDurationUpdate) callbacksRef.current.onTotalDurationUpdate(totalPeriod);

    const stroke = strokes[currentStrokeIndex];
    if (!stroke || stroke.points.length < 2) return;

    // Normalize points with Y-flip to match shader coordinates
    const scale = Math.min(canvas.width, canvas.height) / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const normalizedPoints = stroke.points.map(p => ({
      x: (p.x - centerX) / scale,
      y: -(p.y - centerY) / scale, // Flip Y for shader coordinates
    }));

    // Convert back to canvas space for drawing
    const canvasPoints = normalizedPoints.map(p => ({
      x: p.x * scale + centerX,
      y: -p.y * scale + centerY, // Flip Y back for canvas
    }));

    const totalSegments = canvasPoints.length - 1;
    const segmentIndex = Math.floor(t * totalSegments);
    const segT = t * totalSegments - segmentIndex;

    const idx = Math.min(segmentIndex, canvasPoints.length - 2);
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
  }, [ctx, canvas, enabled, strokes, speed]);

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
