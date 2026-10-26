import { act, renderHook } from '@testing-library/react';
import { useFrame } from '@react-three/fiber';
import { DataTexture, NearestFilter } from 'three';
import { createMaxSampleProvider, SampleProvider } from '../../../../sampleProvider/SampleProvider';
import { useLightWallSoundMaterial } from './LightWallSoundMaterial';

jest.mock('@react-three/fiber', () => ({ useFrame: jest.fn() }));

beforeEach(() => (useFrame as jest.Mock).mockClear());

function updateFrames() {
  const calls = (useFrame as jest.Mock).mock.calls;
  const frame = calls[calls.length - 1][0];
  act(() => {
    frame();
    frame();
  });
}

it('uploads fresh music history without React rerenders, reusing the texture and buffer', () => {
  const provider = new SampleProvider(3, 60, new Float32Array(2));
  provider.push(new Float32Array([0.2, 0.8]));
  const { result, unmount } = renderHook(() => useLightWallSoundMaterial({ sampleProvider: provider }));
  const material = result.current;
  const texture = material.uniforms.sampleData.value as DataTexture;
  const buffer = texture.image.data as Float32Array;
  const version = texture.version;
  provider.push(new Float32Array([0.7, -0.1]));
  updateFrames();
  expect(result.current).toBe(material);
  expect(material.uniforms.sampleData.value).toBe(texture);
  expect(texture.image.data).toBe(buffer);
  expect(buffer[0]).toBeCloseTo(0.7);
  expect(buffer[1]).toBeCloseTo(-0.1);
  expect(buffer[2]).toBeCloseTo(0.2);
  expect(buffer[3]).toBeCloseTo(0.8);
  expect(texture.version).toBeGreaterThan(version);
  expect(texture.minFilter).toBe(NearestFilter);
  expect(texture.magFilter).toBe(NearestFilter);
  unmount();
});

it('replaces and immediately binds texture storage when switching fallback audio to live music', () => {
  const fallback = createMaxSampleProvider(64);
  const live = new SampleProvider(4, 60, new Float32Array(3));
  live.push(new Float32Array([0.1, 0.5, 0.9]));
  const { result, rerender, unmount } = renderHook(
    ({ provider }) => useLightWallSoundMaterial({ sampleProvider: provider }),
    { initialProps: { provider: fallback } }
  );
  const material = result.current;
  const oldTexture = material.uniforms.sampleData.value as DataTexture;
  const dispose = jest.spyOn(oldTexture, 'dispose');
  rerender({ provider: live });
  const texture = material.uniforms.sampleData.value as DataTexture;
  expect(result.current).toBe(material);
  expect(texture).not.toBe(oldTexture);
  expect(texture.image.width).toBe(3);
  expect(texture.image.height).toBe(4);
  expect(oldTexture.image.width).toBe(1);
  expect(oldTexture.image.height).toBe(64);
  expect(dispose).toHaveBeenCalledTimes(1);
  expect((texture.image.data as Float32Array)[1]).toBeCloseTo(0.5);
  live.push(new Float32Array([0.9, 0.2, 0.4]));
  updateFrames();
  expect((texture.image.data as Float32Array)[1]).toBeCloseTo(0.2);
  unmount();
});

it('disposes the audio texture and shader when the wall unmounts', () => {
  const { result, unmount } = renderHook(() => useLightWallSoundMaterial({}));
  const material = result.current;
  const texture = material.uniforms.sampleData.value as DataTexture;
  const disposeTexture = jest.spyOn(texture, 'dispose');
  const disposeMaterial = jest.spyOn(material, 'dispose');
  unmount();
  expect(disposeTexture).toHaveBeenCalledTimes(1);
  expect(disposeMaterial).toHaveBeenCalledTimes(1);
});
