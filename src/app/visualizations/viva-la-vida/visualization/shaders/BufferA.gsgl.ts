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

const float creaminess = 0.1;
const float dryness = 0.1;
const float scaleA = 0.4;
const float scaleB = 0.25;
const float scaleC = 0.3;
const float falloff = 1.1;

// fractal brownian motion (layers of multi scale noise)
vec3 fbm(vec3 p)
{
    vec3 result = vec3(0);
    float amplitude = 0.5;
    for (float index = 0.; index < 3.; ++index)
    {
        result += (texture(channel0, p/amplitude).xyz) * amplitude;
        amplitude /= falloff;
    }
    return result;
}




void drawPath( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord.xy - resolution.xy / 2.)/resolution.y;
  vec3 dither = texture(channel2, fragCoord.xy / 1024.).rgb;
  
  // sample curve position
  float t = time * speed + dither.x * dryness / 100.;
  vec2 current = drawPath(t) * scaleA;
  vec2 prev = drawPath(t-.01) * scaleA;
  vec2 velocity = normalize(prev-current);
  vec2 pos = uv-current*1.6*scaleA;
  
  float paint = fbm(vec3(pos, 0.) / creaminess * scaleB).x;
  
  // brush range
  float brush = smoothstep(.3,.0,length(pos)/scaleB);
  paint *= brush;
  
  // add circle shape to buffer
  paint += smoothstep(.05*scaleB, .0, length(pos));
  
  // motion mask
  float push = smoothstep(.3, .5, paint);
  push *= smoothstep(.4, 1., brush);
  
  // direction and strength
  vec2 offset = 10.*push*velocity/resolution.xy;
  







  // mouse interaction
  vec2 mousePos = (mouse.xy - resolution.xy / 2.)/resolution.y;
  vec4 data = texture(channel1, vec2(0,0));
  bool wasNotPressing = data.w < 0.5;
  if (wasNotPressing && mouse.z > .5) data.z = 0.;
  else data.z += timeDelta;
  data.z = clamp(data.z, 0., 1.);
  vec2 mousePrevious = data.xy;
  float erase = 0.;
  if (mouse.z > 0.5)
  {
      uv = (fragCoord.xy - resolution.xy / 2.)/resolution.y;
      float mask = fbm(vec3(uv-mousePos, 0.) * .5).x;
      mask = smoothstep(.3,.6,mask);
      push = smoothstep(.2,.0,length(uv-mousePos) / scaleC);
      push *= mask;
     
      vec2 dir = normalize(mousePrevious-mousePos+.001);
      float fadeIn = smoothstep(.0, .5, data.z);
      float fadeInAndOut = sin(fadeIn*3.1415);
      offset += 10.*push*normalize(mousePos-uv)/resolution.xy*fadeInAndOut;
      
      erase = (.001 + .01*(1.-fadeIn)) * push;
      // erase = -(.001 + .03*(1.-fadeIn)) * push;
      push *= 500.*length(mousePrevious-mousePos)*fadeIn;
      offset += push*dir/resolution.xy;
  }
  
  // sample frame buffer with motion
  uv = fragCoord.xy / resolution.xy;
  vec4 frame = texture(channel1, uv + offset);
  
  // temporal fading buffer
  paint = max(paint, frame.x - .0005 - erase);
  
  // print result
  fragColor = vec4(clamp(paint, 0., 1.));
  
  // save mouse position for next frame
  if (fragCoord.x < 1. && fragCoord.y < 1.) fragColor = vec4(mousePos, data.z, mouse.z);
}




void main() {
  drawPath(fragColor, gl_FragCoord.xy);
}
`;
