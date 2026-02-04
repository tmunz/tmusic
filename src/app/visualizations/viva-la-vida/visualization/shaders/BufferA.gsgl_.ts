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
  






  // mouse interaction
  vec2 mousePos = (mouse.xy / resolution.xy - 0.5) * vec2(aspectRatio, 1.);
  vec4 prevBufferData = texture(channel1, vec2(0, 0) / resolution.xy);
  vec2 mousePrevious = prevBufferData.xy;
  float mousePaint = .0;
  
  if (mouse.z > 0.5) {
    vec2 pos = uv - mousePos;
    
    // Add random shape variation
    float angle = atan(pos.y, pos.x);
    float radius = length(pos);
    float shapeNoise = fbm(vec3(angle * 3.0, radius * 5.0, time * 0.5)).r;
    pos += normalize(pos) * shapeNoise * 0.15;
    
    float mouseDist = length(pos);
    float mouseMask = fbm(vec3(pos, 0.) * scale * 0.7).r;
    mouseMask = smoothstep(0.2, 1.0, mouseMask);
    
    float mouseStrokeWidth = strokeWidth * 3.0;
    float mouseBrush = smoothstep(mouseStrokeWidth * pow(10., creaminess) * 0.4, 0.0, mouseDist);
    mousePaint = (mouseBrush * mouseMask) + smoothstep(mouseStrokeWidth, 0.0, mouseDist);
    
    // Add mouse-based distortion
    float fadeIn = smoothstep(0.0, 0.5, prevBufferData.z);
    vec2 mouseVelocity = normalize(mousePos - mousePrevious + 0.001);
    float motionStrength = smoothstep(strokeThicknessMin, strokeThicknessMax, mousePaint);
    
    // Distortion with directional push
    vec2 distortionOffset = fbm(vec3(uv * 2.0, time * 0.3)).xy - 0.5;
    offset += 8. * motionStrength * mouseVelocity / resolution.xy;
    offset += 5. * mouseBrush * distortionOffset / resolution.xy;
  }
  











  // sample frame buffer with motion
  vec2 bufferUv = fragCoord.xy / resolution.xy + offset;
  vec4 bufferFrame = texture(channel1, bufferUv);
  
  paint = max(paint, bufferFrame.r - fade);
  
  // Add mouse paint
  paint = max(paint, mousePaint);
  
  fragColor = vec4(clamp(paint, 0., 1.));
  
  // save mouse position for next frame
  if (fragCoord.x < 1. && fragCoord.y < 1.) {
    fragColor = vec4(mousePos, prevBufferData.z, mouse.z);
  }
}
`;
