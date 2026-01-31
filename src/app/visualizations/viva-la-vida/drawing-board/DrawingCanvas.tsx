import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
}

interface DrawingCanvasProps {
  strokes: Stroke[];
  currentStroke: Point[];
  backgroundOpacity: number;
  backgroundImageUrl?: string;
  onStrokeComplete: (stroke: Stroke) => void;
  onStrokeUpdate: (points: Point[]) => void;
  onStrokeStart: (point: Point) => void;
  onCanvasDimensionsChange?: (width: number, height: number) => void;
  showGrid?: boolean;
  onBeforeRender?: () => void;
  onAfterRender?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

export interface DrawingCanvasHandle {
  getContext: () => CanvasRenderingContext2D | null;
  getCanvas: () => HTMLCanvasElement | null;
  requestRender: () => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  (
    {
      strokes,
      currentStroke,
      backgroundOpacity,
      backgroundImageUrl,
      onStrokeComplete,
      onStrokeUpdate,
      onStrokeStart,
      onCanvasDimensionsChange,
      showGrid = true,
      onBeforeRender,
      onAfterRender,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(800);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const animationFrameRef = useRef<number>();

    useImperativeHandle(ref, () => ({
      getContext: () => canvasRef.current?.getContext('2d') || null,
      getCanvas: () => canvasRef.current,
      requestRender: () => {},
    }));

    useEffect(() => {
      const img = new Image();
      img.src = backgroundImageUrl || '';
      img.onload = () => {
        imageRef.current = img;
        // Set canvas dimensions based on image aspect ratio
        const aspectRatio = img.width / img.height;
        const maxHeight = 600;
        const height = maxHeight;
        const width = Math.round(height * aspectRatio);
        setCanvasWidth(width);
        setCanvasHeight(height);
        onCanvasDimensionsChange?.(width, height);
      };
    }, [backgroundImageUrl, onCanvasDimensionsChange]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = () => {
        if (onBeforeRender) {
          onBeforeRender();
        }

        // base color
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background image with opacity
        if (imageRef.current) {
          ctx.globalAlpha = backgroundOpacity;
          const imgAspect = imageRef.current.width / imageRef.current.height;
          const canvasAspect = canvas.width / canvas.height;

          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;

          // Contain mode
          if (canvasAspect > imgAspect) {
            drawWidth = canvas.height * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
          } else {
            drawHeight = canvas.width / imgAspect;
            offsetY = (canvas.height - drawHeight) / 2;
          }

          ctx.drawImage(imageRef.current, offsetX, offsetY, drawWidth, drawHeight);
          ctx.globalAlpha = 1.0;
        }

        if (showGrid) {
          drawGrid(canvas, ctx);
        }

        // Draw strokes
        strokes.forEach(stroke => {
          if (stroke.points.length > 0) {
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
              ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
          }
        });

        // Draw current stroke
        if (currentStroke.length > 0) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
          for (let i = 1; i < currentStroke.length; i++) {
            ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
          }
          ctx.stroke();
        }

        // start point
        ctx.fillStyle = '#aaaaaa';
        strokes.forEach(stroke => {
          if (stroke.points.length > 0) {
            ctx.beginPath();
            ctx.arc(stroke.points[0].x, stroke.points[0].y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        if (onAfterRender) {
          onAfterRender(ctx, canvas);
        }

        // Continue animation loop if onAfterRender is provided
        if (onAfterRender) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      };

      render();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [strokes, currentStroke, backgroundOpacity, canvasWidth, canvasHeight, showGrid, onBeforeRender, onAfterRender]);

    const drawGrid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onStrokeStart({ x, y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onStrokeUpdate([...currentStroke, { x, y }]);
    };

    const handleMouseUp = () => {
      if (currentStroke.length > 1) {
        onStrokeComplete({ points: currentStroke });
      }
      setIsDrawing(false);
    };

    return (
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    );
  }
);
