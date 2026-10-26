import { IUniform, LineBasicMaterial, ShaderLib } from 'three';
import { createWireframeCreateMaterial } from '../../object/useWireframeCreate';
import {
  addBuildingBattleGradient,
  BUILDING_BATTLE_FADE_SECONDS,
  cloneBuildingMaterial,
  createBuildingBattleShader,
  updateBuildingBattleFade,
} from './buildingBattleMaterial';

it('fades into and out of battle red over time, including reversing an unfinished fade', () => {
  const mix = { value: 0 };
  updateBuildingBattleFade(mix, true, BUILDING_BATTLE_FADE_SECONDS / 2);
  expect(mix.value).toBeCloseTo(0.5);
  updateBuildingBattleFade(mix, false, BUILDING_BATTLE_FADE_SECONDS / 4);
  expect(mix.value).toBeCloseTo(0.25);
  updateBuildingBattleFade(mix, true, BUILDING_BATTLE_FADE_SECONDS);
  expect(mix.value).toBe(1);
  updateBuildingBattleFade(mix, false, BUILDING_BATTLE_FADE_SECONDS * 2);
  expect(mix.value).toBe(0);
});

it.each(['basic', 'reveal'] as const)(
  'applies the height gradient to %s shaders while retaining fog and opacity',
  kind => {
    const reveal = createWireframeCreateMaterial('#00ddee', 0, 200, true);
    try {
      const source = kind === 'reveal' ? reveal : ShaderLib[kind];
      const shader = {
        uniforms: {} as Record<string, IUniform>,
        vertexShader: source.vertexShader,
        fragmentShader: source.fragmentShader,
      };
      const mix = { value: 0 };
      createBuildingBattleShader(0, 200, mix)(shader);
      expect(shader.vertexShader).toContain('vBuildingHeight = position.y;');
      expect(shader.fragmentShader).toContain('1.0 - smoothstep(0.0, 0.65, buildingHeight)');
      expect(shader.fragmentShader).toContain('#include <fog_fragment>');
      expect(shader.fragmentShader).toContain(
        kind === 'reveal' ? 'buildingBaseBlend), alpha)' : 'diffuseColor.rgb = mix'
      );
      expect(shader.uniforms.buildingMaxY.value).toBe(200);
      expect(shader.uniforms.buildingBattleMix).toBe(mix);
      updateBuildingBattleFade(mix, true, BUILDING_BATTLE_FADE_SECONDS);
      expect(shader.uniforms.buildingBattleMix.value).toBe(1);
    } finally {
      reveal.dispose();
    }
  }
);

it('preserves the gradient and shared time fade when cloning materials for creation animations', () => {
  const material = new LineBasicMaterial();
  addBuildingBattleGradient(material, 0, 200, { value: 0 });
  const clone = cloneBuildingMaterial(material);
  expect(clone).not.toBe(material);
  expect(clone.onBeforeCompile).toBe(material.onBeforeCompile);
  expect(clone.customProgramCacheKey()).toBe(material.customProgramCacheKey());
  material.dispose();
  clone.dispose();
});
