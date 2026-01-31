export const imageFragmentShader = `
precision highp float;
varying vec2 vUv;

uniform sampler2D channel0; // Buffer A
uniform sampler2D channel1; // Noise
uniform sampler2D image;
uniform vec2 resolution;
uniform vec2 textureResolution;
uniform vec4 mouse;

#define TEX(uv) texture2D(channel0, uv).r

void main() {
  vec2 fragCoord = vUv * resolution;
  
  // Contain mode: fit image within canvas maintaining aspect ratio
  float textureAspect = textureResolution.x / textureResolution.y;
  float canvasAspect = resolution.x / resolution.y;
  
  vec2 imageUV = vUv;
  
  float scaleX = 1.0;
  float scaleY = 1.0;
  
  if (canvasAspect > textureAspect) {
    scaleX = textureAspect / canvasAspect;
  } else {
    scaleY = canvasAspect / textureAspect;
  }
  
  scaleX *= 0.9;
  scaleY *= 0.9;
  
  imageUV = (imageUV - 0.5) / vec2(scaleX, scaleY) + 0.5;
  
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  if (imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0) {
    color = texture2D(image, imageUV);
  }
  
  // Apply paint effect
  vec2 uv = fragCoord / resolution;
  vec3 noise = texture2D(channel0, uv).rgb;
  float gray = noise.x;
  
  // Calculate normals from heightmap
  vec3 unit = vec3(3. / resolution, 0);
  vec3 normal = normalize(vec3(
    TEX(uv + unit.xz) - TEX(uv - unit.xz),
    TEX(uv - unit.zy) - TEX(uv + unit.zy),
    1.0
  ));
  
  vec3 paintColor = vec3(0.0);
  
  // Specular lighting
  vec3 dir = normalize(vec3(0, 1, 2.));
  float specular = pow(dot(normal, dir) * 0.5 + 0.5, 20.);
  paintColor += vec3(0.5) * specular;
  
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 beige = vec3(0.96, 0.87, 0.70);
  dir = normalize(vec3(uv - 0.5, 0.));
  paintColor += pow(dot(normal, -dir) * 0.5 + 0.5, 0.5);
  
  // Background gradient
  vec3 background = vec3(0.8) * smoothstep(1.5, 0., length(uv - 0.5));
  paintColor = mix(background, clamp(paintColor, 0., 1.), smoothstep(0.2, 0.5, noise.x));
  
  // Mix paint with background image
  if (gray > 0.01) {
    color.rgb = mix(color.rgb, paintColor, clamp(gray, 0., 1.));
  }
  
  gl_FragColor = color;
}
`;
