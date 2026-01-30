import { useRef, useState, useEffect } from 'react';
import { calculateDFT, generateGLSLCode } from './fourierUtils';
import './FourierDrawing.css';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

export const FourierDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [harmonics, setHarmonics] = useState(12);
  const [glslCode, setGlslCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const [reverseDirection, setReverseDirection] = useState(false);

  useEffect(() => {
    // Load background image
    const img = new Image();
    img.src = require('../viva-la-vida.jpg');
    img.onload = () => {
      imageRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
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

    // Draw grid
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

    // Draw center lines
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw all completed strokes
    strokes.forEach(stroke => {
      if (stroke.points.length > 0) {
        ctx.strokeStyle = '#4fc3f7';
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
      ctx.strokeStyle = '#81c784';
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

    // Draw dots at stroke starts
    ctx.fillStyle = '#ff4081';
    strokes.forEach(stroke => {
      if (stroke.points.length > 0) {
        ctx.beginPath();
        ctx.arc(stroke.points[0].x, stroke.points[0].y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [strokes, currentStroke, backgroundOpacity]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (currentStroke.length > 1) {
      setStrokes(prev => [...prev, { points: currentStroke }]);
    }
    setCurrentStroke([]);
    setIsDrawing(false);
  };

  const generateCode = () => {
    const totalPoints = strokes.reduce((sum, s) => sum + s.points.length, 0);
    if (totalPoints < 10) {
      alert('Draw more points! (at least 10)');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Combine all strokes into one path
    let allPoints: Point[] = [];

    strokes.forEach((stroke, index) => {
      allPoints = allPoints.concat(stroke.points);
      if (index < strokes.length - 1 && stroke.points.length > 0 && strokes[index + 1].points.length > 0) {
        const lastPoint = stroke.points[stroke.points.length - 1];
        const nextPoint = strokes[index + 1].points[0];
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const t = i / (steps + 1);
          allPoints.push({
            x: lastPoint.x + (nextPoint.x - lastPoint.x) * t,
            y: lastPoint.y + (nextPoint.y - lastPoint.y) * t,
          });
        }
      }
    });

    // Normalize points to -1 to 1 range centered at canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 2;

    const normalizedPoints = allPoints.map(p => ({
      x: (p.x - centerX) / scale,
      y: -(p.y - centerY) / scale, // Flip Y for shader coordinates
    }));

    // Calculate DFT
    const coefficients = calculateDFT(normalizedPoints, harmonics, reverseDirection);

    // Generate GLSL code
    const code = generateGLSLCode(coefficients);
    setGlslCode(code);
    setShowPreview(true);
  };

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setGlslCode('');
    setShowPreview(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(glslCode);
  };

  return (
    <div className="fourier-drawing">
      <div className="controls">
        <h2>Fourier Path Generator</h2>
        <p>Draw a path on the canvas below:</p>
        <div className="control-row">
          <label>
            Harmonics:
            <input
              type="number"
              min="3"
              max="100"
              value={harmonics}
              onChange={e => setHarmonics(parseInt(e.target.value))}
            />
          </label>
          <label>
            Background:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={backgroundOpacity}
              onChange={e => setBackgroundOpacity(parseFloat(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={reverseDirection}
              onChange={e => setReverseDirection(e.target.checked)}
            />
            Reverse direction
          </label>
          <button onClick={generateCode} disabled={strokes.length === 0}>
            Generate GLSL Code
          </button>
          <button onClick={clearCanvas}>Clear</button>
        </div>
        <p className="info">
          Strokes: {strokes.length} | Total points: {strokes.reduce((sum, s) => sum + s.points.length, 0)}
        </p>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {glslCode && (
        <div className="code-output">
          <div className="code-header">
            <h3>Generated GLSL Code:</h3>
            <button onClick={copyToClipboard}>Copy to Clipboard</button>
          </div>
          <pre>
            <code>{glslCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
