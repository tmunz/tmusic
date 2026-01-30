interface Point {
  x: number;
  y: number;
}

interface FourierCoefficient {
  frequency: number;
  amplitude: number;
  phase: number;
}

interface FourierResult {
  x: FourierCoefficient[];
  y: FourierCoefficient[];
  dcX: number;
  dcY: number;
}

export function calculateDFT(points: Point[], numHarmonics: number, reverse: boolean = false): FourierResult {
  const N = points.length;

  const resampledPoints = resamplePath(points, Math.max(N, 10000));
  const M = resampledPoints.length;

  const dcX = resampledPoints.reduce((sum, p) => sum + p.x, 0) / M;
  const dcY = resampledPoints.reduce((sum, p) => sum + p.y, 0) / M;

  const xCoefficients: FourierCoefficient[] = [];
  const yCoefficients: FourierCoefficient[] = [];

  for (let k = 1; k <= numHarmonics; k++) {
    let xReal = 0;
    let xImag = 0;
    let yReal = 0;
    let yImag = 0;

    for (let n = 0; n < M; n++) {
      const angle = (reverse ? -2 : 2) * Math.PI * k * n / M;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      xReal += resampledPoints[n].x * cosAngle;
      xImag += resampledPoints[n].x * sinAngle;
      yReal += resampledPoints[n].y * cosAngle;
      yImag += resampledPoints[n].y * sinAngle;
    }

    xReal /= M;
    xImag /= M;
    yReal /= M;
    yImag /= M;

    const xAmplitude = 2 * Math.sqrt(xReal * xReal + xImag * xImag);
    const yAmplitude = 2 * Math.sqrt(yReal * yReal + yImag * yImag);

    const xPhase = Math.atan2(xImag, xReal);
    const yPhase = Math.atan2(yImag, yReal);

    xCoefficients.push({
      frequency: k,
      amplitude: xAmplitude,
      phase: xPhase,
    });

    yCoefficients.push({
      frequency: k,
      amplitude: yAmplitude,
      phase: yPhase,
    });
  }

  return {
    x: xCoefficients,
    y: yCoefficients,
    dcX,
    dcY,
  };
}

function resamplePath(points: Point[], targetCount: number): Point[] {
  if (points.length < 2) return points;

  let totalLength = 0;
  const segments: number[] = [0];

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const length = Math.sqrt(dx * dx + dy * dy);
    totalLength += length;
    segments.push(totalLength);
  }

  const resampled: Point[] = [];
  const interval = totalLength / targetCount;

  for (let i = 0; i < targetCount; i++) {
    const targetDist = i * interval;

    let segmentIndex = 0;
    for (let j = 0; j < segments.length - 1; j++) {
      if (targetDist >= segments[j] && targetDist <= segments[j + 1]) {
        segmentIndex = j;
        break;
      }
    }

    const t = (targetDist - segments[segmentIndex]) / (segments[segmentIndex + 1] - segments[segmentIndex]);
    const p1 = points[segmentIndex];
    const p2 = points[segmentIndex + 1];

    resampled.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    });
  }

  return resampled;
}

export function generateGLSLCode(coefficients: FourierResult): string {
  const { x, y, dcX, dcY } = coefficients;

  const formatDC = (value: number): string => {
    return value.toFixed(2);
  };

  const formatTerm = (coeff: FourierCoefficient): string => {
    const amp = coeff.amplitude.toFixed(3);
    const phase = coeff.phase.toFixed(2);
    const sign = coeff.phase >= 0 ? '+' : '';
    return `cos(t * ${coeff.frequency}. ${sign} ${phase}) * ${amp}`;
  };

  const xTerms = x
    .filter(c => c.amplitude > 0.005)
    .map(formatTerm);

  const xCode = `${formatDC(dcX)} + ${xTerms.join(' + \n    ')}`;

  const yTerms = y
    .filter(c => c.amplitude > 0.005)
    .map(formatTerm);

  const yCode = `${formatDC(dcY)} + ${yTerms.join(' + \n    ')}`;

  return `
  vec2(
    ${xCode},
    ${yCode}
  )`;
}
