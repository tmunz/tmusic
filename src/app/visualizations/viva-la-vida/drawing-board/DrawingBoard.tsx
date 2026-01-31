import { useState, useEffect, useRef, useCallback } from 'react';
import { DrawingCanvas, Point, Stroke, DrawingCanvasHandle } from './DrawingCanvas';
import { DrawingBoardControlBar } from './DrawingBoardControlBar';
import { CodeGenerationMode } from './CodeGenerationMode';
import { FourierOptionBar } from './fourier/FourierOptionBar';
import { GLSLOutput } from './glsl/GLSLOutput';
import { calculateDFT } from './fourier/FourierUtils';
import { convertFourierToGlsl } from './fourier/FourierToGlsl';
import { convertVectorToGlsl } from './vector/VectorToGlsl';
import { useFourierVisualization } from './fourier/useFourierVisualization';
import { useVectorVisualization } from './vector/useVectorVisualization';
import './DrawingBoard.css';

export interface DrawingBoardProps {
  backgroundImageUrl?: string;
  onPathGenerated?: (path: string) => void;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
}

export const DrawingBoard = ({
  backgroundImageUrl,
  onPathGenerated,
  speed = 1,
  onSpeedChange = () => {},
}: DrawingBoardProps) => {
  const [mode, setMode] = useState<'fourier' | 'vector'>('vector');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [glslCode, setGlslCode] = useState('');

  // Shared state
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [showTrail, setShowTrail] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  // Fourier-specific state
  const [harmonics, setHarmonics] = useState(12);
  const [reverseDirection, setReverseDirection] = useState(false);
  const [fourierData, setFourierData] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);

  const drawingCanvasRef = useRef<DrawingCanvasHandle>(null);
  const trailPointsRef = useRef<{ x: number; y: number; alpha: number }[]>([]);

  const { drawFourierEpicycles, getCurrentPoint } = useFourierVisualization({
    ctx: drawingCanvasRef.current?.getContext() || null,
    canvas: drawingCanvasRef.current?.getCanvas() || null,
    fourierData: fourierData || [],
    enabled: showAnimation && mode === 'fourier',
    speed,
    onTimeUpdate: setCurrentTime,
    onStrokeIndexUpdate: setCurrentStrokeIndex,
    onTotalDurationUpdate: setTotalDuration,
  });

  const { drawVectorVisualization, getCurrentPoint: getVectorCurrentPoint } = useVectorVisualization({
    ctx: drawingCanvasRef.current?.getContext() || null,
    canvas: drawingCanvasRef.current?.getCanvas() || null,
    strokes: strokes,
    enabled: showAnimation && mode === 'vector',
    speed,
    onTimeUpdate: setCurrentTime,
    onStrokeIndexUpdate: setCurrentStrokeIndex,
    onTotalDurationUpdate: setTotalDuration,
  });

  const applyToVisualization = () => {
    if (!glslCode) {
      alert('Generate code first by drawing some strokes!');
      return;
    }
    onPathGenerated && onPathGenerated(glslCode);
  };

  const generateCodeWithStrokes = useCallback(
    (strokesToUse: Stroke[]) => {
      const totalPoints = strokesToUse.reduce((sum, s) => sum + s.points.length, 0);
      if (totalPoints < 10) {
        return; // Silently skip if not enough points
      }

      if (mode === 'fourier') {
        const strokeTransformations = strokesToUse
          .map(stroke => {
            if (stroke.points.length < 2) return null;

            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            const scale = Math.min(canvasWidth, canvasHeight) / 2;

            const normalizedPoints = stroke.points.map(p => ({
              x: (p.x - centerX) / scale,
              y: -(p.y - centerY) / scale,
            }));

            const coefficients = calculateDFT(normalizedPoints, harmonics, reverseDirection);
            return {
              x: coefficients.x.filter(c => c.amplitude > 0.005),
              y: coefficients.y.filter(c => c.amplitude > 0.005),
              dcX: coefficients.dcX,
              dcY: coefficients.dcY,
            };
          })
          .filter(coeff => coeff !== null);

        const glslCode = convertFourierToGlsl(strokeTransformations as any[]);
        setGlslCode(glslCode);
        setFourierData(strokeTransformations as any[]);
      } else {
        const glslCode = convertVectorToGlsl(strokesToUse, canvasWidth, canvasHeight);
        setGlslCode(glslCode);
      }
    },
    [mode, harmonics, reverseDirection, canvasWidth, canvasHeight]
  );

  // Auto-regenerate code when mode changes
  useEffect(() => {
    if (strokes.length > 0) {
      generateCodeWithStrokes(strokes);
    }
  }, [mode, harmonics, reverseDirection, strokes, generateCodeWithStrokes]);

  const handleStrokeStart = (point: Point) => {
    setCurrentStroke([point]);
  };

  const handleStrokeUpdate = (points: Point[]) => {
    setCurrentStroke(points);
  };

  const handleStrokeComplete = (stroke: Stroke) => {
    const newStrokes = [...strokes, stroke];
    setStrokes(newStrokes);
    setCurrentStroke([]);

    // Automatically generate code after stroke is complete
    setTimeout(() => {
      generateCodeWithStrokes(newStrokes);
    }, 0);
  };

  const handleCanvasDimensionsChange = useCallback((width: number, height: number) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
  }, []);

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setGlslCode('');
    setFourierData([]);
    trailPointsRef.current = [];
  };

  const handleAfterRender = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const isFourierMode = mode === 'fourier' && showAnimation && fourierData && fourierData.length > 0;
      const isVectorMode = mode === 'vector' && showAnimation && strokes && strokes.length > 0;

      if (!isFourierMode && !isVectorMode) {
        trailPointsRef.current = [];
        return;
      }

      // Add current point to trail
      if (showTrail) {
        const currentPoint = isFourierMode ? getCurrentPoint() : getVectorCurrentPoint();
        if (currentPoint) {
          trailPointsRef.current.push({ ...currentPoint, alpha: 1 });
          if (trailPointsRef.current.length > 200) {
            trailPointsRef.current.shift();
          }
        }
      }

      // Draw trail
      if (showTrail && trailPointsRef.current.length > 1) {
        const trailLength = trailPointsRef.current.length;
        trailPointsRef.current.forEach((point, i) => {
          point.alpha = i / trailLength;
        });

        ctx.beginPath();
        ctx.moveTo(trailPointsRef.current[0].x, trailPointsRef.current[0].y);
        for (let i = 1; i < trailPointsRef.current.length; i++) {
          const point = trailPointsRef.current[i];
          ctx.strokeStyle = `rgba(255, 200, 100, ${point.alpha})`;
          ctx.lineWidth = 2;
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
        }
      }

      // Draw mode-specific visualization
      if (isFourierMode) {
        drawFourierEpicycles();
      } else if (isVectorMode) {
        drawVectorVisualization();
      }
    },
    [
      mode,
      showAnimation,
      fourierData,
      strokes,
      showTrail,
      getCurrentPoint,
      getVectorCurrentPoint,
      drawFourierEpicycles,
      drawVectorVisualization,
    ]
  );

  return (
    <div className="drawing-board">
      <DrawingBoardControlBar
        onApplyToVisualization={applyToVisualization}
        onClear={clearCanvas}
        animationSpeed={speed}
        onSpeedChange={onSpeedChange}
        showTrail={showTrail}
        onTrailToggle={setShowTrail}
        showAnimation={showAnimation}
        onAnimationToggle={setShowAnimation}
        backgroundOpacity={backgroundOpacity}
        onBackgroundOpacityChange={setBackgroundOpacity}
      />

      <CodeGenerationMode mode={mode} onModeChange={setMode} />

      {mode === 'fourier' && (
        <FourierOptionBar
          harmonics={harmonics}
          onHarmonicsChange={setHarmonics}
          reverseDirection={reverseDirection}
          onReverseDirectionToggle={setReverseDirection}
        />
      )}

      <div className="canvas-wrapper">
        <DrawingCanvas
          ref={drawingCanvasRef}
          strokes={strokes}
          currentStroke={currentStroke}
          backgroundOpacity={backgroundOpacity}
          backgroundImageUrl={backgroundImageUrl}
          onStrokeStart={handleStrokeStart}
          onStrokeUpdate={handleStrokeUpdate}
          onStrokeComplete={handleStrokeComplete}
          onCanvasDimensionsChange={handleCanvasDimensionsChange}
          onAfterRender={handleAfterRender}
        />
      </div>

      <GLSLOutput
        code={glslCode}
        strokeCount={strokes.length}
        totalPoints={strokes.reduce((sum, s) => sum + s.points.length, 0)}
        currentTime={showAnimation ? currentTime : undefined}
        totalDuration={showAnimation ? totalDuration : undefined}
        currentStrokeIndex={showAnimation ? currentStrokeIndex : undefined}
      />
    </div>
  );
};
