import { useRef, useState, useEffect, forwardRef, useImperativeHandle, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box3, Color, DoubleSide, Group, Material, Mesh, ShaderMaterial } from 'three';

interface WireframeTransitionObjectProps {
  children: ReactNode;
  color?: string;
  revealDuration?: number;
  holdDuration?: number;
  fadeDuration?: number;
  onComplete?: () => void;
}

export interface WireframeTransitionHandle {
  getObject: () => Group | null;
}

export const WireframeTransitionObject = forwardRef<WireframeTransitionHandle, WireframeTransitionObjectProps>(
  ({ children, color = '#00ffff', revealDuration = 0.8, holdDuration = 0.3, fadeDuration = 1.0, onComplete }, ref) => {
    const elementRef = useRef<Group>(null);
    const childrenGroupRef = useRef<Group>(null);
    const progress = useRef(0);
    const started = useRef(false);
    const [wireframe, setWireframe] = useState<Group | null>(null);
    const [showChildren, setShowChildren] = useState(false);
    const originalMaterials = useRef<Map<Mesh, { transparent: boolean; opacity: number }>>(new Map());

    useEffect(() => {
      const timer = setTimeout(() => {
        if (!childrenGroupRef.current) return;

        const bbox = new Box3().setFromObject(childrenGroupRef.current);
        const minY = bbox.min.y;
        const maxY = bbox.max.y;

        const wireframeClone = childrenGroupRef.current.clone(true);
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

        started.current = true;
        progress.current = 0;
      }, 100);

      return () => clearTimeout(timer);
    }, [color]);

    useImperativeHandle(ref, () => ({
      getObject: () => elementRef.current,
    }));

    useFrame((state, delta) => {
      if (!started.current || !wireframe) return;

      progress.current += delta;

      if (progress.current <= revealDuration) {
        const revealRatio = progress.current / revealDuration;
        wireframe.traverse(child => {
          if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
            child.material.uniforms.revealProgress.value = revealRatio;
          }
        });
        return;
      }

      const holdStartTime = revealDuration;
      if (progress.current <= holdStartTime + holdDuration) {
        wireframe.traverse(child => {
          if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
            child.material.uniforms.revealProgress.value = 1.0;
          }
        });
        return;
      }

      const fadeStartTime = holdStartTime + holdDuration;
      const fadeTime = progress.current - fadeStartTime;
      const fadeRatio = Math.min(fadeTime / fadeDuration, 1);

      if (!showChildren) {
        setShowChildren(true);

        if (childrenGroupRef.current) {
          childrenGroupRef.current.traverse(child => {
            if (child instanceof Mesh && child.material) {
              const material = child.material as Material;
              originalMaterials.current.set(child, {
                transparent: material.transparent,
                opacity: material.opacity,
              });
              material.transparent = true;
              material.opacity = 0;
            }
          });
        }
      }

      if (childrenGroupRef.current) {
        childrenGroupRef.current.traverse(child => {
          if (child instanceof Mesh && child.material) {
            const material = child.material as Material;
            material.opacity = fadeRatio;
          }
        });
      }

      wireframe.traverse(child => {
        if (child instanceof Mesh && child.material instanceof ShaderMaterial) {
          child.material.uniforms.revealProgress.value = 1.0;
          child.material.uniforms.opacity.value = 1 - fadeRatio;
        }
      });

      if (fadeRatio >= 1.0) {
        wireframe.visible = false;

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
    });

    return (
      <group ref={elementRef}>
        <group ref={childrenGroupRef} visible={showChildren}>
          {children}
        </group>
        {wireframe && <primitive object={wireframe} />}
      </group>
    );
  }
);
