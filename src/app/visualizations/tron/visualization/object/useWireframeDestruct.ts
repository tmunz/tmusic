import { useRef, useState } from 'react';
import { Box3, Color, DoubleSide, Group, Material, Mesh, ShaderMaterial } from 'three';

interface UseWireframeDestructParams {
  color?: string;
  fadeDuration?: number;
  holdDuration?: number;
  revealDuration?: number;
  onComplete?: () => void;
}

export const useWireframeDestruct = ({
  color = '#00ffff',
  fadeDuration = 1.0,
  holdDuration = 0.3,
  revealDuration = 0.8,
  onComplete,
}: UseWireframeDestructParams) => {
  const progress = useRef(0);
  const [wireframe, setWireframe] = useState<Group | null>(null);
  const [showChildren, setShowChildren] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const originalMaterials = useRef<Map<Mesh, { transparent: boolean; opacity: number }>>(new Map());
  const childrenGroupRef = useRef<Group | null>(null);

  const totalDuration = fadeDuration + holdDuration + revealDuration;

  const startDestruct = (childrenGroup: Group) => {
    if (!childrenGroup) return;

    childrenGroupRef.current = childrenGroup;
    setIsAnimating(true);
    progress.current = 0;
    setShowChildren(true);

    // Save original materials
    childrenGroupRef.current.traverse(child => {
      if (child instanceof Mesh && child.material) {
        const material = child.material as Material;
        if (!originalMaterials.current.has(child)) {
          originalMaterials.current.set(child, {
            transparent: material.transparent,
            opacity: material.opacity,
          });
        }
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
            revealProgress: { value: 1.0 },
            opacity: { value: 0.0 },
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

    // Phase 1: Fade out solid model
    if (currentProgress <= fadeDuration) {
      const fadeRatio = 1.0 - currentProgress / fadeDuration;

      childrenGroupRef.current.traverse(child => {
        if (child instanceof Mesh && child.material) {
          const material = child.material as Material;
          material.transparent = true;
          material.opacity = fadeRatio;
        }
      });

      // Wireframe fades in as solid fades out
      const wireframeOpacity = 1.0 - fadeRatio;
      wireframe.traverse(child => {
        if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
          child.material.uniforms.revealProgress.value = 1.0;
          child.material.uniforms.opacity.value = wireframeOpacity;
        }
      });

      if (fadeRatio <= 0) {
        setShowChildren(false);
      }
      return;
    }

    // Phase 2: Hold wireframe
    const holdStartTime = fadeDuration;
    if (currentProgress <= holdStartTime + holdDuration) {
      setShowChildren(false);
      wireframe.traverse(child => {
        if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
          child.material.uniforms.revealProgress.value = 1.0;
          child.material.uniforms.opacity.value = 1.0;
        }
      });
      return;
    }

    // Phase 3: Fade wireframe to transparency
    const fadeStartTime = holdStartTime + holdDuration;
    const fadeTime = currentProgress - fadeStartTime;
    const fadeRatio = Math.min(fadeTime / revealDuration, 1);

    wireframe.traverse(child => {
      if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
        child.material.uniforms.revealProgress.value = 1.0;
        child.material.uniforms.opacity.value = 1.0 - fadeRatio;
      }
    });

    if (fadeRatio >= 1.0) {
      wireframe.visible = false;
      setIsAnimating(false);
      setShowChildren(false);

      // Restore original material properties
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
    startDestruct,
    animate,
  };
};
