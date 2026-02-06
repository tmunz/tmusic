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
  creaminess?: number;
  dryness?: number;
  scale?: number;
  strokeWidth?: number;
  pouringSize?: number;
  pouringAmount?: number;
  falloff?: number;
}

export const DelacroixLibertyLeadingThePeoplePainting = ({
  sampleProvider,
  width,
  height,
  drawingPath,
  speed = 1,
  creaminess = 0.2,
  dryness = 0.1,
  scale = 0.5,
  strokeWidth = 0.2,
  pouringSize = 0.2,
  pouringAmount = 3.0,
  falloff = 1.4,
}: DelacroixLibertyLeadingThePeoplePaintingProps) => {
  return (
    <Canvas
      frameloop="always"
      orthographic
      camera={{ position: [0, 0, 5], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 100 }}
      gl={{ preserveDrawingBuffer: true }}
      style={{ width, height, display: 'block' }}
    >
      <BrushPainting
        sampleProvider={sampleProvider}
        width={width}
        height={height}
        drawingPath={drawingPath}
        speed={speed}
        creaminess={creaminess}
        dryness={dryness}
        scale={scale}
        strokeWidth={strokeWidth}
        pouringSize={pouringSize}
        pouringAmount={pouringAmount}
        falloff={falloff}
      />
    </Canvas>
  );
};

// this code is based on https://www.shadertoy.com/view/NlSBW3 Brush toy by Leon Denise 2022-05-17
const BrushPainting = ({
  sampleProvider,
  width,
  height,
  drawingPath,
  speed = 1,
  creaminess = 0.2,
  dryness = 0.1,
  scale = 0.5,
  strokeWidth = 0.2,
  pouringSize = 0.2,
  pouringAmount = 1.0,
  falloff = 1.4,
}: {
  sampleProvider: SampleProvider;
  width: number;
  height: number;
  drawingPath?: string;
  speed?: number;
  creaminess?: number;
  dryness?: number;
  scale?: number;
  strokeWidth?: number;
  pouringSize?: number;
  pouringAmount?: number;
  falloff?: number;
}) => {
  const { gl, size, pointer, camera } = useThree();
  const noise3D = useNoise3D(42);
  const blueNoise = useBlueNoise();

  const backgroundTexture = useMemo(() => {
    const loader = new TextureLoader();
    const texture = loader.load(require('./delacroix-liberty-leading-the-people.jpg'));
    return texture;
  }, []);

  const bufferA1 = useFBO(width, height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
  });

  const bufferA2 = useFBO(width, height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
  });

  const buffers = useRef({ read: bufferA1, write: bufferA2 });

  useEffect(() => {
    buffers.current = { read: bufferA1, write: bufferA2 };
  }, [bufferA1, bufferA2]);

  const isMouseDown = useRef(false);
  const meshRef = useRef<Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const bufferScene = useMemo(() => {
    const scene = new Scene();
    const mesh = new Mesh(new PlaneGeometry(2, 2));
    scene.add(mesh);
    return { scene, mesh };
  }, []);

  const bufferAMaterial = useMemo(() => {
    const fragmentShader = getBufferAFragmentShader(drawingPath);

    console.log('Creating Buffer A material with settings:', {
      creaminess,
    });

    return new ShaderMaterial({
      uniforms: {
        channel0: { value: noise3D },
        channel1: { value: null }, // Will be set to previous frame
        channel2: { value: blueNoise },
        resolution: { value: new Vector2(width, height) },
        time: { value: 0 },
        timeDelta: { value: 0 },
        progressDelta: { value: 0 },
        mouse: { value: new Vector4(0, 0, 0, 0) },
        speed: { value: speed },
        creaminess: { value: creaminess },
        dryness: { value: dryness },
        scale: { value: scale },
        strokeWidth: { value: strokeWidth },
        pouringSize: { value: pouringSize },
        pouringAmount: { value: pouringAmount },
        falloff: { value: falloff },
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
        resolution: { value: new Vector2(width, height) },
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
    // Store reference to the canvas element
    canvasRef.current = gl.domElement;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      // Check if the event target is the canvas
      if (e.target === canvasRef.current) {
        isMouseDown.current = true;
      }
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
  }, [gl]);

  useFrame((state, delta) => {
    bufferAMaterial.uniforms.resolution.value.set(width, height);
    imageMaterial.uniforms.resolution.value.set(width, height);

    if (backgroundTexture.image && backgroundTexture.image.width) {
      imageMaterial.uniforms.textureResolution.value.set(backgroundTexture.image.width, backgroundTexture.image.height);
    }

    const volume = sampleProvider.getAvg()[0] / 255;

    const pointerActive = isMouseDown.current ? 1 : 0;
    const pointerX = ((pointer.x + 1) / 2) * width;
    const pointerY = ((pointer.y + 1) / 2) * height;

    bufferAMaterial.uniforms.channel1.value = buffers.current.read.texture;
    bufferAMaterial.uniforms.time.value = state.clock.getElapsedTime();
    bufferAMaterial.uniforms.timeDelta.value = delta;
    bufferAMaterial.uniforms.progressDelta.value = delta * volume;
    bufferAMaterial.uniforms.speed.value = speed;
    bufferAMaterial.uniforms.creaminess.value = creaminess;
    bufferAMaterial.uniforms.dryness.value = dryness;
    bufferAMaterial.uniforms.scale.value = scale;
    bufferAMaterial.uniforms.strokeWidth.value = strokeWidth;
    bufferAMaterial.uniforms.pouringSize.value = pouringSize;
    bufferAMaterial.uniforms.pouringAmount.value = pouringAmount;
    bufferAMaterial.uniforms.falloff.value = falloff;
    bufferAMaterial.uniforms.mouse.value.set(pointerX, pointerY, pointerActive, 0);

    bufferScene.mesh.material = bufferAMaterial;

    gl.setRenderTarget(buffers.current.write);
    gl.render(bufferScene.scene, camera);
    gl.setRenderTarget(null);

    const temp = buffers.current.read;
    buffers.current.read = buffers.current.write;
    buffers.current.write = temp;

    imageMaterial.uniforms.channel0.value = buffers.current.read.texture;
    imageMaterial.uniforms.mouse.value.set(pointerX, pointerY, pointerActive, 0);
  });

  return (
    <mesh ref={meshRef} material={imageMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};
