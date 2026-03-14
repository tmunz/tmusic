export const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vSize;

  uniform sampler2D image;
  uniform sampler2D sampleData;
  uniform vec2 sampleDataSize;
  uniform float borderWidth;

  vec2 getMaxValue(float x) {
    float maxValue = 0.0;
    float age = 0.0;
    
    for (float y = 0.0; y < sampleDataSize.y; y += 1.0) {
      vec2 coord = vec2(x, y / sampleDataSize.y);
      float value = texture2D(sampleData, coord).r;
      
      if (value > maxValue) {
        maxValue = value;
        age = y / sampleDataSize.y;
      }
    }
    
    return vec2(maxValue, age);
  }

  float getNewestValue(float x) {
    vec2 coord = vec2(x, 0.0);
    return texture2D(sampleData, coord).r;
  }

  float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
  }

  float calculateTotalSum() {
    float totalSum = 0.0;
    for (float i = 0.0; i < sampleDataSize.x; i += 1.0) {
      float sx = (i + 0.5) / sampleDataSize.x;
      totalSum += getNewestValue(sx);
    }
    return totalSum;
  }

  vec3 findBar(float targetX, float totalSum) {
    float cumulativePos = 0.0;
    float freqIndex = 0.0;
    float barStart = 0.0;
    float barEnd = 0.0;
    
    for (float i = 0.0; i < sampleDataSize.x; i += 1.0) {
      float sx = (i + 0.5) / sampleDataSize.x;
      float value = getNewestValue(sx);
      float proportionalWidth = totalSum > 0.0 ? value / totalSum : 1.0 / sampleDataSize.x;
      
      float nextPos = cumulativePos + proportionalWidth;
      
      if (targetX >= cumulativePos && targetX < nextPos) {
        freqIndex = i;
        barStart = cumulativePos;
        barEnd = nextPos;
        break;
      }
      
      cumulativePos = nextPos;
    }
    
    return vec3(freqIndex, barStart, barEnd);
  }

  vec2 directionUv(vec2 uv, float dir) {
    if (dir < 0.5) {
      return uv;
    } else {
      return vec2(uv.x, 1.0 - uv.y);
    }
  }

  void main() {
    vec2 uv = vUv;

    vec4 colors[3];
    colors[0] = vec4(0.1, 0.1, 0.5, 1.);
    colors[1] = vec4(0.8, 0.1, 0.1, 1.);
    colors[2] = vec4(1.0, 0.9, 0.1, 1.);
    vec4 colorNeutral = vec4(1., 1., 1., 1.);
    vec4 colorBorder = vec4(vec3(0.1), 1.);

    vec4 color = vec4(1.);
    
    float totalSum = calculateTotalSum();
    vec3 barInfo = findBar(uv.x, totalSum);
    float freqIndex = barInfo.x;
    float barStart = barInfo.y;
    float barEnd = barInfo.z;
    
    float sx = (freqIndex + 0.5) / sampleDataSize.x;
    vec2 result = getMaxValue(sx);
    float maxValue = result.x;
    float age = result.y;
    
    float aspectRatio = vSize.y / vSize.x;
    float barWidth = barEnd - barStart;
    float barCenter = (barStart + barEnd) * 0.5;
    float distFromCenter = abs(uv.x - barCenter);
    bool inBar = uv.x >= barStart && uv.x < barEnd;
  
    vec2 colUv = directionUv(uv, random(freqIndex));
    
    float horizontalBorderWidth = borderWidth * aspectRatio;
    float verticalBorderWidth = borderWidth;
    bool inBorder = inBar && (distFromCenter > barWidth * 0.5 - horizontalBorderWidth || colUv.y > maxValue - verticalBorderWidth);
    bool inNeutralBorder = inBar && colUv.y >= maxValue && (distFromCenter > barWidth * 0.5 - horizontalBorderWidth || colUv.y < maxValue + verticalBorderWidth);
    bool inBarVertical = colUv.y < maxValue;
    
    if (inBar && inBarVertical) {
      if (inBorder) {
        color.rgb = mix(color.rgb, colorBorder.rgb, 1.0);
      } else {
        int colorIndex = int(mod(freqIndex, 3.0));
        color.rgb = mix(color.rgb, colors[colorIndex].rgb, 1.0);
      }
    }
    
    if (inBar && !inBarVertical) {
      if (inNeutralBorder) {
        color.rgb = mix(color.rgb, colorBorder.rgb, 1.0);
      } else {
        color.rgb = mix(color.rgb, colorNeutral.rgb, 1.0);
      }
    }
    
    gl_FragColor = color;
  }
`;