import { useRef, useMemo, useEffect } from 'react';
import { SampleProvider } from '../../../audio/SampleProvider';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { getBufferAFragmentShader } from './shaders/BufferA.gsgl';
import { imageFragmentShader } from './shaders/Image.gsgl';
import { useNoise3D } from './noise/useNoise3D';
import { useBlueNoise } from './noise/useBlueNoise';
import {
  LinearFilter,
  Mesh,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector4,
} from 'three';

export interface DelacroixLibertyLeadingThePeoplePaintingProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  drawingPath?: string;
  speed?: number;
}

export const DelacroixLibertyLeadingThePeoplePainting = ({
  sampleProvider,
  width,
  height,
  drawingPath,
  speed = 1,
}: DelacroixLibertyLeadingThePeoplePaintingProps) => {
  return (
    <Canvas
      frameloop="always"
      orthographic
      camera={{ position: [0, 0, 5], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 100 }}
      gl={{ preserveDrawingBuffer: true }}
      style={{ width, height, display: 'block' }}
    >
      <BrushPainting width={width} height={height} drawingPath={drawingPath} speed={speed} />
    </Canvas>
  );
};

// this code is based on https://www.shadertoy.com/view/NlSBW3 Brush toy by Leon Denise 2022-05-17
const BrushPainting = ({
  width,
  height,
  drawingPath,
  speed = 1,
}: {
  width: number;
  height: number;
  drawingPath?: string;
  speed?: number;
}) => {
  const { gl, size, pointer, camera } = useThree();
  const noise3D = useNoise3D(42);
  const blueNoise = useBlueNoise();

  const backgroundTexture = useMemo(() => {
    const loader = new TextureLoader();
    const texture = loader.load(require('./delacroix-liberty-leading-the-people.jpg'));
    return texture;
  }, []);

  const bufferA1 = useFBO(size.width, size.height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
  });
  const bufferA2 = useFBO(size.width, size.height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
  });

  const pingPong = useRef({ read: bufferA1, write: bufferA2 });
  const mouseData = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, time: 0, pressed: 0 });
  const isMouseDown = useRef(false);
  const meshRef = useRef<Mesh>(null);

  const bufferAMaterial = useMemo(() => {
    const fragmentShader = getBufferAFragmentShader(drawingPath);

    return new ShaderMaterial({
      uniforms: {
        channel0: { value: noise3D },
        channel1: { value: null }, // Will be set to previous frame
        channel2: { value: blueNoise },
        resolution: { value: new Vector2(size.width, size.height) },
        time: { value: 0 },
        timeDelta: { value: 0 },
        mouse: { value: new Vector4(0, 0, 0, 0) },
        speed: { value: speed },
      },
      vertexShader: `
        out vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: fragmentShader,
      glslVersion: '300 es',
    });
  }, [width, height, noise3D, blueNoise, drawingPath, speed]);

  const imageMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        channel0: { value: null }, // Will be set to Buffer A
        channel1: { value: blueNoise },
        image: { value: backgroundTexture },
        resolution: { value: new Vector2(size.width, size.height) },
        textureResolution: { value: new Vector2(1, 1) }, // Will be updated when texture loads
        mouse: { value: new Vector4(0, 0, 0, 0) },
      },
      vertexShader: `
        out vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: imageFragmentShader,
      glslVersion: '300 es',
    });
  }, [size.width, size.height, noise3D, backgroundTexture]);

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
      imageMaterial.uniforms.textureResolution.value.set(backgroundTexture.image.width, backgroundTexture.image.height);
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

    bufferAMaterial.uniforms.channel1.value = pingPong.current.read.texture;
    bufferAMaterial.uniforms.time.value = state.clock.getElapsedTime();
    bufferAMaterial.uniforms.timeDelta.value = delta;
    bufferAMaterial.uniforms.mouse.value.set(mouseData.current.x, mouseData.current.y, mousePressed, 0);

    const tempMesh = new Mesh(new PlaneGeometry(2, 2), bufferAMaterial);
    const tempScene = new Scene();
    tempScene.add(tempMesh);

    gl.setRenderTarget(pingPong.current.write);
    gl.render(tempScene, camera);
    gl.setRenderTarget(null);

    const temp = pingPong.current.read;
    pingPong.current.read = pingPong.current.write;
    pingPong.current.write = temp;

    imageMaterial.uniforms.channel0.value = pingPong.current.read.texture;
    imageMaterial.uniforms.mouse.value.set(mouseData.current.x, mouseData.current.y, mousePressed, 0);
  });

  return (
    <mesh ref={meshRef} material={imageMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};
