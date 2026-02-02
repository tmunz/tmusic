export const getBufferAFragmentShader = (drawingPath?: string) => `
precision highp float;
precision highp sampler2D;
precision highp sampler3D;
in vec2 vUv;
out vec4 fragColor;

uniform sampler3D channel0; // 3D Noise
uniform sampler2D channel1; // Buffer A (previous frame)
uniform sampler2D channel2; // Blue noise
uniform vec2 resolution;
uniform float time;
uniform float timeDelta;
uniform float speed;
uniform vec4 mouse;

#define TEX(uv) texture(channel0, vec3(uv, 0.0)).r

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

${drawingPath || 'vec2 drawPath(float t) { return vec2(0.0); }'}

const float scale = 0.5;
const float strokeEffect = 0.04;
const float strokeWidth = 0.04;
const float strokeThicknessMin = 0.5;
const float strokeThicknessMax = 0.9;
const float dryness = 0.1;
const float creaminess = 0.5;
const float fade = 0.0005;

vec3 fbm(vec3 p) {
  vec3 result = vec3(0);
  float amplitude = 0.5;
  for (float index = 0.; index < 3.; ++index) {
    result += texture(channel0, p / amplitude).xyz * amplitude;
    amplitude *= strokeEffect;
  }
  return result;
}

void main() {
  float aspectRatio = resolution.x / resolution.y;
  vec2 fragCoord = vUv * resolution;
  vec2 uv = (vUv - 0.5) * vec2(aspectRatio, 1.);

  vec3 dither = texture(channel2, fragCoord.xy / 1024.).rgb;
  float t = time * speed + dither.x * pow(10., dryness) / 100.;
  vec2 current = drawPath(t) * scale;
  vec2 next = drawPath(t - .01) * scale;
  vec2 velocity = normalize(next - current);
  vec2 pos = uv - current;
  float paint = fbm(vec3(pos, 0.) * scale).r;
  float brush = smoothstep(strokeWidth * pow(10., creaminess) * 0.4, 0.0, length(pos));
  paint *= brush;
  
  // bristles
  paint += smoothstep(strokeWidth, .0, length(pos));
  
  // motion mask
  float push = smoothstep(strokeThicknessMin, strokeThicknessMax, paint);
  
  // direction and strength
  vec2 offset = 10. * push * velocity / resolution.xy;
  
  // sample frame buffer with motion
  vec2 bufferUv = fragCoord.xy / resolution.xy + offset;
  vec4 bufferFrame = texture(channel1, bufferUv);
  

  paint = max(paint, bufferFrame.r - fade);
  fragColor = vec4(clamp(paint, 0., 1.));
}
`;
