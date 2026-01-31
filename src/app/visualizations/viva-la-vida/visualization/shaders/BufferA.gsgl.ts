export const getBufferAFragmentShader = (drawingPath?: string) => `
precision highp float;
varying vec2 vUv;

uniform sampler2D channel0; // Noise3D
uniform sampler2D channel1; // Buffer A (previous frame)
uniform sampler2D channel2; // Simple noise
uniform vec2 resolution;
uniform float time;
uniform float timeDelta;
uniform float speed;
uniform vec4 mouse;

#define TEX(uv) texture2D(channel0, uv).r

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

${drawingPath || 'vec2 drawPath(float t) { return vec2(0.0); }'}

// Drawing parameters
const float drawThickness = 0.05;        // Thickness of the drawn path stroke
const float mouseThickness = 0.05;       // Thickness of mouse input brush
const float mouseOpacity = 1.0;          // Opacity of mouse strokes (0.0 to 1.0)
const float mouseFadeMin = 1.0;          // Minimum fade visibility (0.0 to 1.0)
const float canvasScale = 0.3;           // Scale of the drawing on canvas

// Texture parameters
const float scale = 0.8;
const float falloff = 8.;

vec3 fbm(vec3 p) {
  vec3 result = vec3(0);
  float amplitude = 0.5;
  for (float index = 0.; index < 3.; ++index) {
    result += texture2D(channel0, p.xy / amplitude).xyz * amplitude;
    amplitude /= falloff;
  }
  return result;
}

void main() {
  vec2 fragCoord = vUv * resolution;
  vec2 uv = (fragCoord - resolution / 2.) / resolution.y;
  vec2 mouseCoord = (mouse.xy - resolution / 2.) / resolution.y;
  
  vec3 dither = texture2D(channel2, fragCoord / 1024.).rgb;
  
  float t = time * speed + dither.x * 0.01;
  
  vec2 current = drawPath(t) * canvasScale;
  vec2 next = drawPath(-t - 0.01) * canvasScale;

  vec2 velocity = normalize(next - current);
  
  vec2 pos = uv - current * 1.6;
  
  float paint = fbm(vec3(pos, 0.) * scale).x;
  
  float brush = smoothstep(drawThickness, 0.0, length(pos));
  paint *= brush;
  
  paint += smoothstep(drawThickness, 0.0, length(pos));
  
  float push = smoothstep(0.3, 0.5, paint);
  push *= smoothstep(0.4, 1., brush);
  
  vec2 offset = 10. * push * velocity / resolution;
  
  // Mouse interaction
  vec4 data = texture2D(channel1, vec2(0, 0));
  bool wasNotPressing = data.w < 0.5;
  if (wasNotPressing && mouse.z > 0.5) data.z = 0.;
  else data.z += timeDelta;
  data.z = clamp(data.z, 0., 1.);
  vec2 mousePrevious = data.xy;
  float erase = 0.;
  
  if (mouse.z > 0.5) {
    uv = (fragCoord - resolution / 2.) / resolution.y;
    float mask = fbm(vec3(uv - mouseCoord, 0.) * scale * 0.5).x;
    mask = smoothstep(0.3, 0.6, mask);
    push = smoothstep(mouseThickness, 0.0, length(uv - mouseCoord));
    push *= mask;
    
    // Add immediate paint at mouse position with higher opacity
    paint = max(paint, push * mouseOpacity);
    
    vec2 dir = normalize(mousePrevious - mouseCoord + 0.001);
    float fadeIn = smoothstep(0.0, 0.5, data.z);
    float fadeInAndOut = max(mouseFadeMin, sin(fadeIn * 3.1415));
    offset += 10. * push * normalize(mouseCoord - uv) / resolution * fadeInAndOut;
    erase = (0.001 + 0.01 * (1. - fadeIn)) * push;
    push *= 500. * length(mousePrevious - mouseCoord) * fadeIn;
    offset += push * dir / resolution;
  }
  
  uv = fragCoord / resolution;
  vec4 frame = texture2D(channel1, uv + offset);
  
  paint = max(paint, frame.x - (0.0005 * speed) - erase);  // Fade rate based on speed
  
  gl_FragColor = vec4(clamp(paint, 0., 1.));
  
  if (fragCoord.x < 1. && fragCoord.y < 1.) {
    gl_FragColor = vec4(mouseCoord, data.z, mouse.z);
  }
}
`;
