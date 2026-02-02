export const imageFragmentShader = `
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D channel0; // Buffer A
uniform sampler2D channel1; // Noise
uniform sampler2D image;
uniform vec2 resolution;
uniform vec2 textureResolution;
uniform vec4 mouse;

#define TEX(uv) texture(channel0, uv).r

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
    color = texture(image, imageUV);
  }
  
  // Apply paint effect
  vec2 uv = fragCoord / resolution;
  float value = texture(channel0, uv).a;
  
  // Calculate normals from heightmap
  vec3 unit = vec3(1. / resolution, 0);
  
  vec3 paintColor = vec3(0.9);
  
  // debug
  // paintColor = vec3(value);

  vec3 normal = normalize(vec3(
    TEX(uv + unit.xz) - TEX(uv - unit.xz),
    TEX(uv - unit.zy) - TEX(uv + unit.zy),
    value * value
  ));
  
  // Specular lighting
  vec3 dir = normalize(vec3(0, 1, 2.));
  float specular = pow(dot(normal, dir) * 0.5 + 0.5, 20.);
  paintColor += vec3(0.5) * specular;
  
  // Mix paint with background image
  if (value > 0.01) {
    color.rgb = mix(color.rgb, paintColor, clamp(value, 0., 1.));
  }
  
  fragColor = color;
}
`;
