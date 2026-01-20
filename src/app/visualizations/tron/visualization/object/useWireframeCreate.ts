import { useRef, useState } from 'react';
import { Box3, Color, DoubleSide, Group, Material, Mesh, ShaderMaterial } from 'three';

interface UseWireframeCreateParams {
  color?: string;
  revealDuration?: number;
  holdDuration?: number;
  fadeDuration?: number;
  onComplete?: () => void;
}

export const useWireframeCreate = ({
  color = '#00ffff',
  revealDuration = 0.8,
  holdDuration = 0.3,
  fadeDuration = 1.0,
  onComplete,
}: UseWireframeCreateParams) => {
  const progress = useRef(0);
  const [wireframe, setWireframe] = useState<Group | null>(null);
  const [showChildren, setShowChildren] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const originalMaterials = useRef<Map<Mesh, { transparent: boolean; opacity: number }>>(new Map());
  const childrenGroupRef = useRef<Group | null>(null);

  const totalDuration = revealDuration + holdDuration + fadeDuration;

  const startCreate = (childrenGroup: Group) => {
    if (!childrenGroup) return;

    childrenGroupRef.current = childrenGroup;
    setIsAnimating(true);
    progress.current = 0;
    setShowChildren(false);

    // Ensure materials are in default state before starting animation
    // This handles cases where previous animations may have left materials modified
    childrenGroup.traverse(child => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as Material;
        // Reset to fully opaque and non-transparent (default state)
        material.transparent = false;
        material.opacity = 1.0;
        material.visible = true;
      }
    });

    const bbox = new Box3().setFromObject(childrenGroup);
    const minY = bbox.min.y;
    const maxY = bbox.max.y;

    const wireframeClone = childrenGroup.clone(true);
    wireframeClone.updateMatrixWorld(true);

    wireframeClone.traverse(child => {
      if (child instanceof Mesh && child.geometry) {
        const wireframeMaterial = new ShaderMaterial({
          uniforms: {
            color: { value: new Color(color) },
            revealProgress: { value: 0.0 },
            opacity: { value: 1.0 },
            minY: { value: minY },
            maxY: { value: maxY },
          },
          vertexShader: `
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float revealProgress;
            uniform float opacity;
            uniform float minY;
            uniform float maxY;
            varying vec3 vPosition;
            
            void main() {
              float normalizedY = (vPosition.y - minY) / (maxY - minY);
              
              if (normalizedY > revealProgress) {
                discard;
              }
              
              float edgeFade = smoothstep(revealProgress - 0.05, revealProgress, normalizedY);
              float alpha = (1.0 - edgeFade * 0.3) * opacity;
              
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          wireframe: true,
          side: DoubleSide,
          depthTest: true,
          depthWrite: false,
        });

        child.material = wireframeMaterial;
        child.visible = true;
      }
    });

    wireframeClone.visible = true;
    setWireframe(wireframeClone);
  };

  const animate = (delta: number) => {
    if (!isAnimating || !wireframe || !childrenGroupRef.current) return;

    progress.current = Math.min(totalDuration, progress.current + delta);
    const currentProgress = progress.current;

    // Phase 1: Reveal
    if (currentProgress <= revealDuration) {
      const revealRatio = currentProgress / revealDuration;
      wireframe.traverse(child => {
        if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
          child.material.uniforms.revealProgress.value = revealRatio;
        }
      });
      return;
    }

    // Phase 2: Hold
    const holdStartTime = revealDuration;
    if (currentProgress <= holdStartTime + holdDuration) {
      wireframe.traverse(child => {
        if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
          child.material.uniforms.revealProgress.value = 1.0;
        }
      });
      return;
    }

    // Phase 3: Fade
    const fadeStartTime = holdStartTime + holdDuration;
    const fadeTime = currentProgress - fadeStartTime;
    const fadeRatio = Math.min(fadeTime / fadeDuration, 1);

    if (!showChildren) {
      setShowChildren(true);

      childrenGroupRef.current.traverse(child => {
        if (child instanceof Mesh && child.material) {
          const material = child.material as Material;
          if (!originalMaterials.current.has(child)) {
            originalMaterials.current.set(child, {
              transparent: material.transparent,
              opacity: material.opacity,
            });
          }
          material.transparent = true;
          material.opacity = 0;
        }
      });
    }

    childrenGroupRef.current.traverse(child => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as Material;
        material.opacity = fadeRatio;
      }
    });

    wireframe.traverse(child => {
      if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
        child.material.uniforms.revealProgress.value = 1.0;
        child.material.uniforms.opacity.value = 1 - fadeRatio;
      }
    });

    if (fadeRatio >= 1.0) {
      wireframe.visible = false;
      setIsAnimating(false);

      if (childrenGroupRef.current) {
        childrenGroupRef.current.traverse(child => {
          if (child instanceof Mesh && child.material) {
            const original = originalMaterials.current.get(child);
            if (original) {
              const material = child.material as Material;
              material.transparent = original.transparent;
              material.opacity = original.opacity;
            }
          }
        });
        originalMaterials.current.clear();
      }

      if (onComplete) {
        onComplete();
      }
    }
  };

  return {
    wireframe,
    showChildren,
    isAnimating,
    startCreate,
    animate,
  };
};
