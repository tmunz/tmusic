import { useFrame } from '@react-three/fiber';
import { useRef, RefObject, useEffect } from 'react';
import {
  Mesh,
  Object3D,
  WebGLRenderer,
  OrthographicCamera as ThreeOrthographicCamera,
  Material,
  MeshStandardMaterial,
} from 'three';
import './Minimap.css';

interface MinimapRendererProps {
  targetRef: RefObject<Object3D>;
  canvasElement: HTMLCanvasElement | null;
}

export function MinimapRenderer({ targetRef, canvasElement }: MinimapRendererProps): JSX.Element | null {
  const mapCamera = useRef<ThreeOrthographicCamera | null>(null);
  const minimapRenderer = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasElement) return;

    const size = canvasElement.width;
    const mapSize = 100;

    const renderer = new WebGLRenderer({
      canvas: canvasElement,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000);
    minimapRenderer.current = renderer;

    const camera = new ThreeOrthographicCamera(-mapSize / 2, mapSize / 2, mapSize / 2, -mapSize / 2, 0.1, 200);
    camera.layers.enable(0); // Default layer
    camera.layers.disable(1); // Disable effects layer for minimap
    mapCamera.current = camera;

    return () => {
      renderer.dispose();
      minimapRenderer.current = null;
      mapCamera.current = null;
    };
  }, [canvasElement]);

  useFrame(({ scene }) => {
    if (!mapCamera.current || !targetRef.current || !minimapRenderer.current) return;

    const playerPos = targetRef.current.position;

    mapCamera.current.position.set(playerPos.x, playerPos.y + 80, playerPos.z);
    mapCamera.current.lookAt(playerPos.x, playerPos.y, playerPos.z);
    mapCamera.current.updateMatrixWorld();

    const materialCache = new Map<Material, { envMapIntensity?: number; metalness?: number; roughness?: number }>();

    scene.traverse(obj => {
      if ('material' in obj && obj.material) {
        const material = obj.material as Material;
        if ('envMapIntensity' in material || 'metalness' in material) {
          const standardMaterial = material as MeshStandardMaterial;
          materialCache.set(material, {
            envMapIntensity: standardMaterial.envMapIntensity,
            metalness: standardMaterial.metalness,
            roughness: standardMaterial.roughness,
          });
          standardMaterial.envMapIntensity = 0;
          standardMaterial.metalness = 0;
          standardMaterial.roughness = 1;
        }
      }
    });

    minimapRenderer.current.render(scene, mapCamera.current);

    // Restore original material properties
    materialCache.forEach((cached, material) => {
      const standardMaterial = material as MeshStandardMaterial;
      if (cached.envMapIntensity !== undefined) standardMaterial.envMapIntensity = cached.envMapIntensity;
      if (cached.metalness !== undefined) standardMaterial.metalness = cached.metalness;
      if (cached.roughness !== undefined) standardMaterial.roughness = cached.roughness;
    });
  });

  return null;
}

interface MinimapProps {
  targetRef: RefObject<Object3D>;
  size?: number;
  color: string;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export function Minimap({ targetRef, size = 256, color, onCanvasReady }: MinimapProps): JSX.Element {
  const playerMarker = useRef<HTMLDivElement>(null);

  const handleCanvasRef = useRef<(canvas: HTMLCanvasElement | null) => void>(canvas => {
    if (canvas) {
      onCanvasReady(canvas);
    }
  });

  useEffect(() => {
    const updateRotation = () => {
      if (targetRef.current && playerMarker.current) {
        const rotation = -targetRef.current.rotation.y * (180 / Math.PI);
        playerMarker.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }
      requestAnimationFrame(updateRotation);
    };

    const animationId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationId);
  }, [targetRef]);

  return (
    <div
      className="minimap"
      style={{ width: `${size}px`, height: `${size}px`, '--player-color': color } as React.CSSProperties}
    >
      <canvas ref={handleCanvasRef.current} width={size} height={size} />
      <div ref={playerMarker} className="minimap-marker" />
    </div>
  );
}
