import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { LinearFilter } from 'three';

export interface PsychedelicSwirlProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  intensity?: number;
}

export const PsychedelicSwirl = ({ sampleProvider, width, height, intensity = 1 }: PsychedelicSwirlProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const getUniforms = () => {
    updateSampleTexture();
    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      intensity: { value: intensity },
    };
  };

  return (
    <ShaderImage
      objectFit="cover"
      width={width}
      height={height}
      getUniforms={getUniforms}
      imageFilter={LinearFilter}
      fragmentShader={`
        precision mediump float;
        varying vec2 vUv;

        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float intensity;

        float getSample(vec2 uv) {
          return texture2D(sampleData, uv).r;
        }

        vec4 ballColor(vec2 uv) {
          float f = smoothstep(0.6, 1.4, distance(uv, vec2(-.1, .1))) * .4 // base
            + smoothstep(.0, .9, 1.3- distance(uv, vec2(-.3, .3))) * .6 // highlight ambient
            - smoothstep(.1, .8, .8- distance(uv, vec2(-.5, .0))) * .3 // darken top left
            + smoothstep(.1, .6, .5- distance(uv, vec2(-.3, .35))) // highlight left
            + smoothstep(.1, .5, .4- distance(uv, vec2(.2, .6))); // highlight right 
          f *= 1. - smoothstep(.95, 1., distance(uv, vec2(.0, .0)));
          return vec4(f, f, f, 1.);
        }

        float interpolateSample(sampler2D tex, vec2 uv, vec2 size) {
          vec2 pixel = uv * size;
          vec2 f = fract(pixel);
          vec2 p0 = floor(pixel);
          vec2 p1 = p0 + vec2(1.0);
          
          float s00 = texture2D(tex, (p0 + vec2(0.5)) / size).r;
          float s10 = texture2D(tex, (vec2(p1.x, p0.y) + vec2(0.5)) / size).r;
          float s01 = texture2D(tex, (vec2(p0.x, p1.y) + vec2(0.5)) / size).r;
          float s11 = texture2D(tex, (p1 + vec2(0.5)) / size).r;
          
          float s0 = mix(s00, s10, f.x);
          float s1 = mix(s01, s11, f.x);
          return mix(s0, s1, f.y);
        }

        void main() {
          vec2 uv = vUv * 2. - 1.;
          
          float h = 4.0;
          float m = 0.95;
          float depth = h - uv.y;
          float perspectiveY = 1. / depth;
          vec2 perspectiveUv = vec2(h * ((1.-m) + uv.x + m *uv.y) * perspectiveY, uv.y - uv.x * 0.2);

          
          // ball distortion
          float ballRadius = .22;
          vec2 ballPosition = vec2(0.2, -0.25);
          vec2 perspectiveBallPosition = -vec2(0., 0.3);
          vec2 diff = perspectiveUv - perspectiveBallPosition;
          diff.y /= 0.7;
          float distToBall = length(diff) / 1.4;
          float ballInfluence = 1.0 - smoothstep(0.1, ballRadius * 1.5, distToBall);
          vec2 directionToBall = perspectiveBallPosition - perspectiveUv;
          vec2 distUv = perspectiveUv + directionToBall * ballInfluence * vec2(1., 0.);
          

          // sample data distortion
          float xUsage = 3.2;
          float yUsage = 0.95;
          float sampleV = -0.3 + ((1. / yUsage - 1.) - distUv.y * 1. / yUsage);
          sampleV -= 1. / sampleDataSize.y; // offset to avoid edge artifacts
          vec2 sampleUv = vec2((distUv.x + xUsage / 2.) / xUsage, sampleV);
          float sampleValue = interpolateSample(sampleData, sampleUv, sampleDataSize);
          float xFade = smoothstep(-xUsage, 0., perspectiveUv.x) * (1. - smoothstep(0., xUsage, perspectiveUv.x));
          float yFade = smoothstep(-0.4, 1., sampleUv.y);
          float sampleLocationEffect = pow(xFade, 2.0 + (1.0 - yFade) * 10.0) * yFade;         
          float angleBase = sampleValue * 3.14159 * 2.;
          float angle = sin(angleBase) * intensity * sampleLocationEffect * 1.5;
          float centerShift = cos(angleBase * 0.7) * sampleLocationEffect * 0.5;
          
          vec2 rotationCenter = vec2(centerShift, distUv.y);
          vec2 toCenter = distUv - rotationCenter;
          
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          vec2 rotated = vec2(toCenter.x * cosAngle - toCenter.y * sinAngle,toCenter.x * sinAngle + toCenter.y * cosAngle);
          
          distUv = rotationCenter + rotated;

    
          // apply lines
          distUv *= sampleDataSize.x * h;
          float lineFrequency = sin(distUv.x);
          float centerLineThickness = (distUv.x) / 6.;

          vec4 color = vec4(0);
          
          float grad = min(1., .75 * 5.);
          color = vec4(mix(vec3(.92,.16,.20), vec3(.94, .63, .17), -uv.y) * grad, 1.);
          float spot = clamp(3. - distance(uv * vec2(1, 2), vec2(-1, -1)), 0., 1.);
          vec4 lineColor = vec4(vec3(.8, .68, .82) * lineFrequency * spot, 1.);
            
          if (1. < centerLineThickness) {
            color = lineColor;
          }
            
          float mask = 1. - smoothstep(ballRadius - 0.015, ballRadius, distance(uv, ballPosition));
          color = mix(color, ballColor((uv - ballPosition) / ballRadius), mask);
          if (centerLineThickness < -1.) {
            color = lineColor;
          }
          
          // debug sample overlay
          // vec4 sampleColor = vec4(1.);
          // color = mix(color, sampleColor, sampleLocationEffect);     
          
          gl_FragColor = color;
      }`}
    />
  );
};
