export const gaussianBlur = `
  vec4 gaussianBlur(sampler2D img, vec2 uv, float blurSize, int kernelSize, vec2 resolution) {
    vec4 color = vec4(0.0);
    int halfKernelSize = kernelSize / 2;
    float sigma = float(kernelSize) / 2.;
    float weightSum = 0.0;
    for (int x = -halfKernelSize; x <= halfKernelSize; x++) {
      for (int y = -halfKernelSize; y <= halfKernelSize; y++) {
        vec2 offset = vec2(x, y) * blurSize / resolution;
        float weight = exp(-(float(x * x + y * y) / (2. * sigma * sigma))); 
        color += texture2D(img, uv + offset) * weight;
        weightSum += weight;
      }
    }
    return color / weightSum;  
  }
`;

export const interpolation = `
  vec4 interpolation(sampler2D sampleData, vec2 uv, vec2 sampleDataSize, vec2 weight) {
    vec2 samplePos = uv * sampleDataSize;
    vec2 pos0 = floor(samplePos);
    vec2 pos1 = pos0 + vec2(1.0);
    vec2 t = fract(samplePos) * weight;
    
    vec4 sample00 = texture2D(sampleData, pos0 / sampleDataSize);
    vec4 sample10 = texture2D(sampleData, vec2(pos1.x, pos0.y) / sampleDataSize);
    vec4 sample01 = texture2D(sampleData, vec2(pos0.x, pos1.y) / sampleDataSize);
    vec4 sample11 = texture2D(sampleData, pos1 / sampleDataSize);
    
    vec4 h0 = mix(sample00, sample10, t.x);
    vec4 h1 = mix(sample01, sample11, t.x);
    
    return mix(h0, h1, t.y);
  }

  vec4 interpolation(sampler2D sampleData, vec2 uv, vec2 sampleDataSize) {
    return interpolation(sampleData, uv, sampleDataSize, vec2(1.0, 1.0));
  }
`;
