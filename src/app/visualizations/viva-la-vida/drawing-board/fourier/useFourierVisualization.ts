import { useRef, useEffect, useCallback } from 'react';

interface FourierCoefficient {
  frequency: number;
  amplitude: number;
  phase: number;
}

interface FourierStroke {
  x: FourierCoefficient[];
  y: FourierCoefficient[];
  dcX: number;
  dcY: number;
}

interface UseFourierVisualizationProps {
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
  fourierData: FourierStroke[];
  enabled: boolean;
  speed?: number;
  onTimeUpdate?: (time: number) => void;
  onStrokeIndexUpdate?: (index: number) => void;
  onTotalDurationUpdate?: (duration: number) => void;
}

export const useFourierVisualization = ({
  ctx,
  canvas,
  fourierData,
  enabled,
  speed = 1,
  onTimeUpdate,
  onStrokeIndexUpdate,
  onTotalDurationUpdate,
}: UseFourierVisualizationProps) => {
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const currentPointRef = useRef<{ x: number; y: number } | null>(null);
  const callbacksRef = useRef({ onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate });

  useEffect(() => {
    callbacksRef.current = { onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate };
  }, [onTimeUpdate, onStrokeIndexUpdate, onTotalDurationUpdate]);

  const drawFourierEpicycles = useCallback(() => {
    if (!ctx || !canvas || !enabled || !fourierData || fourierData.length === 0) {
      return;
    }

    const scale = Math.min(canvas.width, canvas.height) / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const periodPerStroke = 1;
    const totalPeriod = periodPerStroke * fourierData.length;
    const normalizedTime = timeRef.current % totalPeriod;
    const currentStrokeIndex = Math.floor(normalizedTime / periodPerStroke);
    const strokeTime = normalizedTime % periodPerStroke;

    if (callbacksRef.current.onTimeUpdate) callbacksRef.current.onTimeUpdate(timeRef.current);
    if (callbacksRef.current.onStrokeIndexUpdate) callbacksRef.current.onStrokeIndexUpdate(currentStrokeIndex);
    if (callbacksRef.current.onTotalDurationUpdate) callbacksRef.current.onTotalDurationUpdate(totalPeriod);

    const stroke = fourierData[currentStrokeIndex];
    if (!stroke) return;

    const strokeIndex = currentStrokeIndex;
    ctx.strokeStyle = `hsla(${strokeIndex * 137.5}, 70%, 60%, 0.5)`;
    ctx.lineWidth = 1;

    let prevX = centerX + stroke.dcX * scale;
    let prevY = centerY - stroke.dcY * scale;

    const maxLen = Math.max(stroke.x.length, stroke.y.length);

    for (let i = 0; i < maxLen; i++) {
      const xCoeff = stroke.x[i];
      const yCoeff = stroke.y[i];

      const xAngle = xCoeff ? xCoeff.frequency * strokeTime * Math.PI * 2 + xCoeff.phase : 0;
      const xRadius = xCoeff ? xCoeff.amplitude * scale : 0;
      const xDelta = xRadius * Math.cos(xAngle);

      const yAngle = yCoeff ? yCoeff.frequency * strokeTime * Math.PI * 2 + yCoeff.phase : 0;
      const yRadius = yCoeff ? yCoeff.amplitude * scale : 0;
      const yDelta = -yRadius * Math.cos(yAngle);

      const radius = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

      ctx.beginPath();
      ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
      ctx.stroke();
      const nextX = prevX + xDelta;
      const nextY = prevY + yDelta;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      prevX = nextX;
      prevY = nextY;
    }

    ctx.fillStyle = `hsl(${strokeIndex * 137.5}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(prevX, prevY, 6, 0, Math.PI * 2);
    ctx.fill();

    currentPointRef.current = { x: prevX, y: prevY };
    timeRef.current += 0.01 * speed;
  }, [ctx, canvas, enabled, fourierData, speed]);

  const getCurrentPoint = useCallback(() => {
    return currentPointRef.current;
  }, []);

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  return {
    drawFourierEpicycles,
    getCurrentPoint,
    timeRef,
  };
};
