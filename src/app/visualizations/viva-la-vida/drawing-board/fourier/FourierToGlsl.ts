export const convertFourierToGlsl = (fourierData: any[]): string => {
  if (!fourierData || fourierData.length === 0) {
    return '';
  }

  const numPaths = fourierData.length;

  const glslExpressions = fourierData.map(coeff => {
    const formatTerm = (c: any) => {
      if (c.phase >= 0) {
        return `cos(t * ${c.frequency}.0 + ${c.phase.toFixed(2)}) * ${c.amplitude.toFixed(3)}`;
      } else {
        return `cos(t * ${c.frequency}.0 - ${Math.abs(c.phase).toFixed(2)}) * ${c.amplitude.toFixed(3)}`;
      }
    };

    const xTerms = coeff.x.map(formatTerm);
    const xCode = xTerms.length > 0 ? `${coeff.dcX.toFixed(2)} + ${xTerms.join(' + ')}` : `${coeff.dcX.toFixed(2)}`;

    const yTerms = coeff.y.map(formatTerm);
    const yCode = yTerms.length > 0 ? `${coeff.dcY.toFixed(2)} + ${yTerms.join(' + ')}` : `${coeff.dcY.toFixed(2)}`;

    return `vec2(${xCode}, ${yCode})`;
  });

  const assignments = glslExpressions
    .map((vec2Expr, i) => `if (index == ${i}) return ${vec2Expr};`)
    .join('\n          ');

  const pathAssignments = `${assignments}
          return vec2(0.0, 0.0);`;

  const glslCode = `
#define NUM_PATHS ${numPaths}

vec2 getPathPoint(int index, float t) {
  ${pathAssignments}
}

vec2 drawPath(float t) {
  float fullCycle = 3.14159 * 2.;
  float tNormalized = t * fullCycle;
  float cycleTime = float(NUM_PATHS) * fullCycle;
  float pathIndex = mod(tNormalized, cycleTime) / fullCycle;
  int index = int(pathIndex);
  
  if (index >= NUM_PATHS) index = NUM_PATHS - 1;
  return getPathPoint(index, tNormalized);
}
`;

  return glslCode.trim();
};
