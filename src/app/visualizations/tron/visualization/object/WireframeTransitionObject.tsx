import { useRef, useEffect, forwardRef, useImperativeHandle, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useWireframeCreate } from './useWireframeCreate';
import { useWireframeDestruct } from './useWireframeDestruct';

interface WireframeTransitionObjectProps {
  children: ReactNode;
  color?: string;
  revealDuration?: number;
  holdDuration?: number;
  fadeDuration?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export interface WireframeTransitionHandle {
  getObject: () => Group | null;
  disintegrate: () => void;
  integrate: () => void;
}

export const WireframeTransitionObject = forwardRef<WireframeTransitionHandle, WireframeTransitionObjectProps>(
  (
    {
      children,
      color = '#00ffff',
      revealDuration = 0.8,
      holdDuration = 0.3,
      fadeDuration = 1.0,
      onComplete,
      autoStart = false,
    },
    ref
  ) => {
    const elementRef = useRef<Group>(null);
    const childrenGroupRef = useRef<Group>(null);
    const activeAnimationRef = useRef<'create' | 'destruct' | null>(null);

    const createAnimation = useWireframeCreate({
      color,
      revealDuration,
      holdDuration,
      fadeDuration,
      onComplete: () => {
        activeAnimationRef.current = null;
        onComplete?.();
      },
    });

    const destructAnimation = useWireframeDestruct({
      color,
      fadeDuration,
      holdDuration,
      revealDuration,
      onComplete: () => {
        activeAnimationRef.current = null;
        onComplete?.();
      },
    });

    useEffect(() => {
      if (autoStart && childrenGroupRef.current) {
        const timer = setTimeout(() => {
          if (childrenGroupRef.current) {
            activeAnimationRef.current = 'create';
            createAnimation.startCreate(childrenGroupRef.current);
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [autoStart]);

    useImperativeHandle(ref, () => ({
      getObject: () => elementRef.current,
      integrate: () => {
        if (childrenGroupRef.current) {
          activeAnimationRef.current = 'create';
          createAnimation.startCreate(childrenGroupRef.current);
        }
      },
      disintegrate: () => {
        if (childrenGroupRef.current) {
          activeAnimationRef.current = 'destruct';
          destructAnimation.startDestruct(childrenGroupRef.current);
        }
      },
    }));

    useFrame((state, delta) => {
      if (activeAnimationRef.current === null) {
        return;
      }

      switch (activeAnimationRef.current) {
        case 'create':
          createAnimation.animate(delta);
          break;
        case 'destruct':
          destructAnimation.animate(delta);
          break;
      }
    });

    const showChildren =
      activeAnimationRef.current === 'create'
        ? createAnimation.showChildren
        : activeAnimationRef.current === 'destruct'
        ? destructAnimation.showChildren
        : true;

    const wireframe =
      activeAnimationRef.current === 'create'
        ? createAnimation.wireframe
        : activeAnimationRef.current === 'destruct'
        ? destructAnimation.wireframe
        : null;

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
