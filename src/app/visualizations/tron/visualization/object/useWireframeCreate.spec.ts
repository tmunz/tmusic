import { act, renderHook } from '@testing-library/react';
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, ShaderMaterial } from 'three';
import { createWireframeCreateMaterial, useWireframeCreate } from './useWireframeCreate';

it('reveals a prepared wireframe without cloning geometry or recalculating bounds', () => {
  const geometry = new BoxGeometry();
  const bodyMaterial = new MeshBasicMaterial();
  const material = createWireframeCreateMaterial('#00ddee', -0.5, 0.5);
  const model = new Group().add(new Mesh(geometry, bodyMaterial));
  const prepared = new Group().add(new Mesh(geometry, material));
  const clone = jest.spyOn(model, 'clone');
  const bounds = jest.spyOn(Box3.prototype, 'setFromObject');
  const { result, unmount } = renderHook(() => useWireframeCreate({}));
  try {
    act(() => result.current.startCreate(model, prepared));
    expect(result.current.wireframe).toBe(prepared);
    expect(result.current.isAnimating).toBe(true);
    expect(clone).not.toHaveBeenCalled();
    expect(bounds).not.toHaveBeenCalled();
    act(() => result.current.animate(0.4));
    expect(material.uniforms.revealProgress.value).toBeCloseTo(0.5);
    act(() => result.current.animate(0.8));
    expect(result.current.showChildren).toBe(true);
    act(() => result.current.animate(1));
    expect(result.current.isAnimating).toBe(false);
    expect(prepared.visible).toBe(false);
    expect(bodyMaterial.opacity).toBe(1);
    expect(bodyMaterial.transparent).toBe(false);
    act(() => result.current.startCreate(model, prepared));
    expect(prepared.visible).toBe(true);
    expect(((prepared.children[0] as Mesh).material as ShaderMaterial).uniforms.revealProgress.value).toBe(0);
  } finally {
    unmount();
    clone.mockRestore();
    bounds.mockRestore();
    geometry.dispose();
    bodyMaterial.dispose();
    material.dispose();
  }
});
