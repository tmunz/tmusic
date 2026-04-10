export const getBufferAFragmentShader = (drawingPath?: string) => `
precision highp float;
precision highp sampler2D;
precision highp sampler3D;
in vec2 vUv;
out vec4 fragColor;

uniform sampler3D channel0; // 3D Noise
uniform sampler2D channel1; // Buffer A (previous frame)
uniform sampler2D channel2; // Blue noise
uniform sampler2D sampleData; // Audio waveform data
uniform vec2 sampleDataSize;
uniform sampler2D significancyData;
uniform vec2 resolution;
uniform vec4 mouse;
uniform float progress;
uniform float timeDelta;
uniform float creaminess;
uniform float dryness;
uniform float scale;
uniform float strokeWidth;
uniform float pouringSize;
uniform float pouringAmount;
uniform float falloff;
uniform float splashesThreshold;

#define TEX(uv) texture(channel0, vec3(uv, 0.0)).r

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

${drawingPath || 'vec2 drawPath(float t) { return vec2(0.0); }'}

float drawSplashes(vec2 fragCoord, float maxPointRadius) {
  vec2 uv = fragCoord.xy / resolution.xy;
  float a = 0.;
  float samples = sampleDataSize.y;
  
  float maxPointRadiusAspectRatioCorrected = maxPointRadius / resolution.y;
  
  float xIndex = uv.x * sampleDataSize.x;
  float xSearchRadius = maxPointRadiusAspectRatioCorrected * sampleDataSize.x;
  float xStart = max(0., floor(xIndex - xSearchRadius));
  float xEnd = min(sampleDataSize.x - 1., ceil(xIndex + xSearchRadius));
  
  float dx = 1.0 / sampleDataSize.x;
  float invSamplesY = 1.0 / sampleDataSize.y;
  
  for (float frame = 0.; frame < samples; frame++) {
    float yPos = frame * invSamplesY;
    float significancy = texture(significancyData, vec2(0.5, yPos)).r;
    if (significancy > splashesThreshold) {
      for (float ix = xStart; ix <= xEnd; ix += 1.) {
        float xPos = (ix + 0.5) / sampleDataSize.x;
        float rawValue = texture(sampleData, vec2(xPos, yPos)).r;;
        
        // Check if this is an extreme (local max/min)
        float rawValuePrev = texture(sampleData, vec2(xPos - dx, yPos)).r;
        float rawValueNext = texture(sampleData, vec2(xPos + dx, yPos)).r;
        
        bool isExtreme = (rawValue > rawValuePrev && rawValue > rawValueNext) || 
                        (rawValue < rawValuePrev && rawValue < rawValueNext);
        
        if (isExtreme) {
          float value = rawValue * 0.5 + 0.5;
          vec2 pixelPos = vec2(xPos, value) * resolution;
          float dist = length(fragCoord - pixelPos) / resolution.y;  
          float pointRadius = maxPointRadiusAspectRatioCorrected * pow(significancy, 2.0);
          float pointAlpha = 1.0 - smoothstep(pointRadius * 0.6, pointRadius, dist);
          pointAlpha *= (0.5 + 0.5 * abs(rawValue));
          a += pointAlpha;
        }
      }
    }
  }
  return a;
}

// fractal brownian motion (layers of multi scale noise)
float fbm(vec3 p) {
  vec3 result = vec3(0);
  float amplitude = 0.5;
  for (float index = 0.; index < 3.; ++index) {
    result += (texture(channel0, p/amplitude).xyz) * amplitude;
    amplitude /= falloff;
  }
  return result.x;
}


vec4 drawPath(vec2 fragCoord) {
  vec2 uv = (fragCoord.xy - resolution.xy / 2.)/resolution.y;
  vec3 dither = texture(channel2, fragCoord.xy / 1024.).rgb;
  
  // sample curve position
  float t = progress + dither.x * dryness / 100.;
  vec2 current = drawPath(t) * scale / 2.;
  vec2 prev = drawPath(t - .01) * scale / 2.;
  vec2 velocity = normalize(prev-current);
  vec2 pos = uv - current * scale * 0.8;
  
  float paint = fbm(vec3(pos, 0.) / creaminess) * 1.8;
  
  // brush range
  float brush = smoothstep(.2,.0,length(pos)/strokeWidth);
  paint *= brush;
  
  // add circle shape to buffer
  paint += smoothstep(.02 * strokeWidth, .0, length(pos));
  
  // motion mask
  float push = smoothstep(.3, .5, paint);
  push *= smoothstep(.4, 1., brush);
  
  // direction and strength
  vec2 offset = 10.*push*velocity/resolution.xy;
  

  // mouse interaction

  // data from previous frame
  // xy = previous mouse position
  // z = time since mouse press (0 to 1)
  // w = mouse pressed (0 or 1)
  vec4 data = texture(channel1, vec2(0,0));

  bool wasNotPressing = data.w == 0.;
  if (wasNotPressing && mouse.z == 1.) {
    data.z = 0.;
  } else {
    data.z += timeDelta;
  }
  float mouseValue = 0.;

  // mousePos is as uv in -0.5 to 0.5 range with aspect ratio correction
  // mouseUv is it moved to the mouse position
  vec2 mousePos = (mouse.xy - resolution.xy / 2.) / resolution.y;
  vec2 mouseUv = uv - mousePos;

  // add wiggling
  mouseUv += vec2(-0.5 + fract(.3 + data.z * 4.2), -0.5 + fract(data.z * 1.7)) * .005;
  if (mouse.z == 1.0) {
    mouseValue = smoothstep(fbm(vec3(.01, 0., 0.)), 0.0, length(mouseUv) / 0.01 / pouringAmount);

    // use fbm mask for better shape control
    float mask = fbm(vec3(mouseUv, 0.) * .5);
    mask = smoothstep(.3, .6, mask);
    
    float mousePush = smoothstep(.2, .0, length(mouseUv) / pouringSize);
    mousePush *= mask;
    
    // directional motion based on mouse movement
    vec2 dir = normalize(data.xy - mousePos + .001);
    float fadeIn = smoothstep(0.0, 1.0, clamp(data.z, 0.0, 1.0));
    // float offsetFade = sin(fadeIn * 3.1415);
    offset += 10. * mousePush * normalize(mousePos - uv) / resolution.xy; // * offsetFade;
    
    // add directional push based on movement
    mousePush *= 500. * length(data.xy - mousePos) * fadeIn;
    offset += mousePush * dir / resolution.xy;
  }
  
  // sample frame buffer with motion
  uv = fragCoord.xy / resolution.xy;
  vec4 frame = texture(channel1, uv + offset);
  
  // temporal fading buffer
  paint = max(paint, frame.x - .0005 + mouseValue);
  
  float paintValue = clamp(paint, 0., 1.);
  
  // save mouse position for next frame
  if (fragCoord.x < 1. && fragCoord.y < 1.) {
    return vec4(mousePos, data.z, mouse.z);
  }
  
  return vec4(paintValue);
}


void main() {
  vec4 path = drawPath(gl_FragCoord.xy);
  float splashes = drawSplashes(gl_FragCoord.xy, 4.);
  
  float combined = path.r + splashes * 0.3;
  fragColor = vec4(clamp(combined, 0., 1.));
  
  if (gl_FragCoord.x < 1. && gl_FragCoord.y < 1.) {
    fragColor = path;
  }
}`;
