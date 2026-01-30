import { useRef, useMemo, useEffect } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFBO } from '@react-three/drei';

export interface DelacroixLibertyLeadingThePeopleSplashesProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
}

export const DelacroixLibertyLeadingThePeopleSplashes = ({
  sampleProvider,
  width,
  height,
}: DelacroixLibertyLeadingThePeopleSplashesProps) => {
  return (
    <Canvas
      frameloop="always"
      orthographic
      camera={{ position: [0, 0, 5], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 100 }}
      gl={{ preserveDrawingBuffer: true }}
      style={{ width, height, display: 'block' }}
    >
      <BrushPainting width={width} height={height} />
    </Canvas>
  );
};

// this code is based on https://www.shadertoy.com/view/NlSBW3 Brush toy by Leon Denise 2022-05-17
const BrushPainting = ({ width, height }: { width: number; height: number }) => {
  const { gl, size, pointer, camera } = useThree();

  const backgroundTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      require('./delacroix-liberty-leading-the-people.jpg'),
      tex => {
        console.log('Background texture loaded', tex.image.width, 'x', tex.image.height);
      },
      undefined,
      error => console.error('Error loading background texture:', error)
    );
    return texture;
  }, []);

  const noiseTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const stride = i * 4;
      data[stride] = Math.random() * 255;
      data[stride + 1] = Math.random() * 255;
      data[stride + 2] = Math.random() * 255;
      data[stride + 3] = 255;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const bufferA1 = useFBO(size.width, size.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });
  const bufferA2 = useFBO(size.width, size.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  const pingPong = useRef({ read: bufferA1, write: bufferA2 });
  const mouseData = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, time: 0, pressed: 0 });
  const isMouseDown = useRef(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const bufferAMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        iChannel0: { value: noiseTexture },
        iChannel1: { value: null }, // Will be set to previous frame
        iChannel2: { value: noiseTexture },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iTime: { value: 0 },
        iTimeDelta: { value: 0 },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        
        uniform sampler2D iChannel0; // Noise3D
        uniform sampler2D iChannel1; // Buffer A (previous frame)
        uniform sampler2D iChannel2; // Simple noise
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float iTimeDelta;
        uniform vec4 iMouse;

        #define TEX(uv) texture2D(iChannel0, uv).r

        mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
        
        // VIVA
        // LA VIDA
        vec2 drawPath(float t) {
          return  vec2(
            -0.06 + cos(t * 1.  -2.10) * 0.177 + 
            cos(t * 2. + 1.87) * 0.270 + 
            cos(t * 3. + 2.35) * 0.063 + 
            cos(t * 4.  -2.58) * 0.052 + 
            cos(t * 5.  -2.09) * 0.023 + 
            cos(t * 6.  -0.13) * 0.015 + 
            cos(t * 7.  -0.06) * 0.015 + 
            cos(t * 8. + 1.37) * 0.029 + 
            cos(t * 10.  -0.41) * 0.008 + 
            cos(t * 11.  -2.18) * 0.015 + 
            cos(t * 12.  -1.84) * 0.012 + 
            cos(t * 13.  -1.56) * 0.014 + 
            cos(t * 14. + 1.65) * 0.014 + 
            cos(t * 15. + 2.49) * 0.012 + 
            cos(t * 16.  -0.80) * 0.022 + 
            cos(t * 17. + 2.52) * 0.021 + 
            cos(t * 18.  -2.53) * 0.015 + 
            cos(t * 19.  -1.85) * 0.018 + 
            cos(t * 20.  -2.34) * 0.021 + 
            cos(t * 21. + 0.77) * 0.009 + 
            cos(t * 22. + 2.93) * 0.014 + 
            cos(t * 23. + 0.96) * 0.009 + 
            cos(t * 24. + 0.83) * 0.014 + 
            cos(t * 25.  -1.80) * 0.011 + 
            cos(t * 26. + 2.06) * 0.012 + 
            cos(t * 27.  -1.05) * 0.019 + 
            cos(t * 28.  -3.05) * 0.023 + 
            cos(t * 29. + 0.86) * 0.010 + 
            cos(t * 30. + 0.14) * 0.016 + 
            cos(t * 31. + 2.83) * 0.010 + 
            cos(t * 32. + 0.11) * 0.014 + 
            cos(t * 33. + 3.13) * 0.013 + 
            cos(t * 34. + 2.36) * 0.011 + 
            cos(t * 35.  -2.34) * 0.006 + 
            cos(t * 36. + 2.79) * 0.009 + 
            cos(t * 37. + 1.11) * 0.013 + 
            cos(t * 38.  -0.30) * 0.019 + 
            cos(t * 39. + 1.72) * 0.006 + 
            cos(t * 42.  -2.00) * 0.005 + 
            cos(t * 45.  -0.61) * 0.008 + 
            cos(t * 48. + 2.74) * 0.009 + 
            cos(t * 49. + 0.88) * 0.005 + 
            cos(t * 55. + 0.91) * 0.005,
            -0.06 + cos(t * 1. + 0.88) * 0.314 + 
            cos(t * 2. + 1.61) * 0.062 + 
            cos(t * 3.  -0.02) * 0.012 + 
            cos(t * 4. + 0.49) * 0.096 + 
            cos(t * 5. + 0.91) * 0.048 + 
            cos(t * 6. + 2.55) * 0.041 + 
            cos(t * 7.  -0.42) * 0.037 + 
            cos(t * 8. + 0.11) * 0.028 + 
            cos(t * 9. + 0.49) * 0.019 + 
            cos(t * 10.  -1.21) * 0.022 + 
            cos(t * 11. + 0.87) * 0.023 + 
            cos(t * 12. + 0.74) * 0.035 + 
            cos(t * 13.  -2.16) * 0.028 + 
            cos(t * 14.  -1.77) * 0.010 + 
            cos(t * 15. + 1.34) * 0.037 + 
            cos(t * 16.  -0.81) * 0.007 + 
            cos(t * 17.  -1.04) * 0.028 + 
            cos(t * 18. + 0.10) * 0.010 + 
            cos(t * 19. + 0.18) * 0.050 + 
            cos(t * 20.  -1.59) * 0.041 + 
            cos(t * 21.  -1.77) * 0.032 + 
            cos(t * 22. + 2.33) * 0.037 + 
            cos(t * 23.  -1.97) * 0.042 + 
            cos(t * 24. + 0.12) * 0.026 + 
            cos(t * 25.  -1.28) * 0.021 + 
            cos(t * 26.  -2.44) * 0.017 + 
            cos(t * 27.  -1.40) * 0.023 + 
            cos(t * 28.  -2.06) * 0.015 + 
            cos(t * 29.  -0.27) * 0.083 + 
            cos(t * 30. + 2.24) * 0.008 + 
            cos(t * 32. + 2.60) * 0.007 + 
            cos(t * 33. + 1.84) * 0.020 + 
            cos(t * 34. + 1.90) * 0.031 + 
            cos(t * 35. + 2.16) * 0.006 + 
            cos(t * 36.  -0.54) * 0.010 + 
            cos(t * 37. + 1.16) * 0.005 + 
            cos(t * 38. + 0.69) * 0.021 + 
            cos(t * 39.  -0.10) * 0.006 + 
            cos(t * 40.  -2.30) * 0.010 + 
            cos(t * 41.  -0.64) * 0.010 + 
            cos(t * 46.  -2.67) * 0.009 + 
            cos(t * 47.  -1.46) * 0.009 + 
            cos(t * 49. + 2.75) * 0.005 + 
            cos(t * 50. + 1.27) * 0.006 + 
            cos(t * 51. + 2.22) * 0.008 + 
            cos(t * 62.  -2.88) * 0.006 + 
            cos(t * 79.  -2.45) * 0.005
          )/3.;
        }

        const float speed = 0.4;
        const float scale = 0.8;
        const float falloff = 8.;
        
        vec3 fbm(vec3 p) {
          vec3 result = vec3(0);
          float amplitude = 0.5;
          for (float index = 0.; index < 3.; ++index) {
            result += texture2D(iChannel0, p.xy / amplitude).xyz * amplitude;
            amplitude /= falloff;
          }
          return result;
        }

        void main() {
          vec2 fragCoord = vUv * iResolution;
          vec2 uv = (fragCoord - iResolution / 2.) / iResolution.y;
          vec2 mouse = (iMouse.xy - iResolution / 2.) / iResolution.y;
          
          vec3 dither = texture2D(iChannel2, fragCoord / 1024.).rgb;
          
          float t = -iTime * speed + dither.x * 0.01;
          
          vec2 current = drawPath(t);
          
          vec2 next = drawPath(t + 0.01);
          vec2 velocity = normalize(next - current);
          
          vec2 pos = uv - current * 1.6;
          
          float paint = fbm(vec3(pos, 0.) * scale).x;
          
          float brush = smoothstep(0.05, 0.0, length(pos));
          paint *= brush;
          
          paint += smoothstep(0.05, 0.0, length(pos));
          
          float push = smoothstep(0.3, 0.5, paint);
          push *= smoothstep(0.4, 1., brush);
          
          vec2 offset = 10. * push * velocity / iResolution;
          
          // Mouse interaction
          vec4 data = texture2D(iChannel1, vec2(0, 0));
          bool wasNotPressing = data.w < 0.5;
          if (wasNotPressing && iMouse.z > 0.5) data.z = 0.;
          else data.z += iTimeDelta;
          data.z = clamp(data.z, 0., 1.);
          vec2 mousePrevious = data.xy;
          float erase = 0.;
          
          if (iMouse.z > 0.5) {
            uv = (fragCoord - iResolution / 2.) / iResolution.y;
            float mask = fbm(vec3(uv - mouse, 0.) * scale * 0.5).x;
            mask = smoothstep(0.3, 0.6, mask);
            push = smoothstep(0.1, 0.0, length(uv - mouse));  // Smaller brush radius (was 0.2)
            push *= mask;
            
            // Add immediate paint at mouse position with higher opacity
            paint = max(paint, push * 0.8);  // Increased from 0.5 to 0.8
            
            vec2 dir = normalize(mousePrevious - mouse + 0.001);
            float fadeIn = smoothstep(0.0, 0.5, data.z);
            float fadeInAndOut = max(0.3, sin(fadeIn * 3.1415)); // Always at least 30% visible
            offset += 10. * push * normalize(mouse - uv) / iResolution * fadeInAndOut;
            erase = (0.001 + 0.01 * (1. - fadeIn)) * push;
            push *= 500. * length(mousePrevious - mouse) * fadeIn;
            offset += push * dir / iResolution;
          }
          
          uv = fragCoord / iResolution;
          vec4 frame = texture2D(iChannel1, uv + offset);
          
          paint = max(paint, frame.x - (0.0005 * speed) - erase);  // Fade rate based on speed
          
          gl_FragColor = vec4(clamp(paint, 0., 1.));
          
          if (fragCoord.x < 1. && fragCoord.y < 1.) {
            gl_FragColor = vec4(mouse, data.z, iMouse.z);
          }
        }
      `,
    });
  }, [width, height, noiseTexture]);

  const imageMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        iChannel0: { value: null }, // Will be set to Buffer A
        iChannel1: { value: noiseTexture },
        image: { value: backgroundTexture },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iTextureResolution: { value: new THREE.Vector2(1, 1) }, // Will be updated when texture loads
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        
        uniform sampler2D iChannel0; // Buffer A
        uniform sampler2D iChannel1; // Noise
        uniform sampler2D image;
        uniform vec2 iResolution;
        uniform vec2 iTextureResolution;
        uniform vec4 iMouse;

        #define TEX(uv) texture2D(iChannel0, uv).r

        void main() {
          vec2 fragCoord = vUv * iResolution;
          
          // Contain mode: fit image within canvas maintaining aspect ratio
          float textureAspect = iTextureResolution.x / iTextureResolution.y;
          float canvasAspect = iResolution.x / iResolution.y;
          
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
          vec2 uv = fragCoord / iResolution;
          vec3 noise = texture2D(iChannel0, uv).rgb;
          float gray = noise.x;
          
          // Calculate normals from heightmap
          vec3 unit = vec3(3. / iResolution, 0);
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
      `,
    });
  }, [size.width, size.height, noiseTexture, backgroundTexture]);

  useEffect(() => {
  
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (backgroundTexture.image && backgroundTexture.image.width) {
      imageMaterial.uniforms.iTextureResolution.value.set(
        backgroundTexture.image.width,
        backgroundTexture.image.height
      );
    }

    const mousePressed = isMouseDown.current ? 1 : 0;
    const newMouseX = ((pointer.x + 1) / 2) * size.width;
    const newMouseY = ((pointer.y + 1) / 2) * size.height;

    mouseData.current = {
      x: newMouseX,
      y: newMouseY,
      prevX: mouseData.current.x,
      prevY: mouseData.current.y,
      time: mouseData.current.time + delta,
      pressed: mousePressed,
    };

    bufferAMaterial.uniforms.iChannel1.value = pingPong.current.read.texture;
    bufferAMaterial.uniforms.iTime.value = state.clock.getElapsedTime();
    bufferAMaterial.uniforms.iTimeDelta.value = delta;
    bufferAMaterial.uniforms.iMouse.value.set(mouseData.current.x, mouseData.current.y, mousePressed, 0);

    const tempMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bufferAMaterial);
    const tempScene = new THREE.Scene();
    tempScene.add(tempMesh);

    gl.setRenderTarget(pingPong.current.write);
    gl.render(tempScene, camera);
    gl.setRenderTarget(null);

    const temp = pingPong.current.read;
    pingPong.current.read = pingPong.current.write;
    pingPong.current.write = temp;

    imageMaterial.uniforms.iChannel0.value = pingPong.current.read.texture;
    imageMaterial.uniforms.iMouse.value.set(mouseData.current.x, mouseData.current.y, mousePressed, 0);
  });

  return (
    <mesh ref={meshRef} material={imageMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};
