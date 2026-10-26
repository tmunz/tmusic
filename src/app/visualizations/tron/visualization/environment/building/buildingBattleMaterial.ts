import { Color, IUniform, Material } from 'three';

interface BuildingShader {
  uniforms: Record<string, IUniform>;
  vertexShader: string;
  fragmentShader: string;
}

export const BUILDING_BATTLE_FADE_SECONDS = 1.5;

export function updateBuildingBattleFade(mix: IUniform<number>, inBattle: boolean, delta: number) {
  const step = delta / BUILDING_BATTLE_FADE_SECONDS;
  mix.value = inBattle ? Math.min(1, mix.value + step) : Math.max(0, mix.value - step);
}

export function createBuildingBattleShader(minY: number, maxY: number, mix: IUniform<number>) {
  return (shader: BuildingShader) => {
    shader.uniforms.buildingBattleMix = mix;
    shader.uniforms.buildingBattleColor = { value: new Color('#440000') };
    shader.uniforms.buildingMinY = { value: minY };
    shader.uniforms.buildingMaxY = { value: maxY };
    shader.vertexShader = `varying float vBuildingHeight;\n${shader.vertexShader}`.replace(
      'void main() {',
      'void main() {\n vBuildingHeight = position.y;'
    );
    shader.fragmentShader = `
      varying float vBuildingHeight;
      uniform float buildingBattleMix;
      uniform vec3 buildingBattleColor;
      uniform float buildingMinY;
      uniform float buildingMaxY;
      ${shader.fragmentShader}
    `;
    const gradient = `
      float buildingHeight = clamp((vBuildingHeight - buildingMinY) / max(0.001, buildingMaxY - buildingMinY), 0.0, 1.0);
      float buildingBaseBlend = (1.0 - smoothstep(0.0, 0.65, buildingHeight)) * smoothstep(0.0, 1.0, buildingBattleMix);
    `;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>\n${gradient}
          diffuseColor.rgb = mix(diffuseColor.rgb, buildingBattleColor, buildingBaseBlend);`
      )
      .replace(
        'gl_FragColor = vec4(color, alpha);',
        `${gradient}
          gl_FragColor = vec4(mix(color, buildingBattleColor, buildingBaseBlend), alpha);`
      );
  };
}

export function addBuildingBattleGradient(material: Material, minY: number, maxY: number, mix: IUniform<number>) {
  material.onBeforeCompile = createBuildingBattleShader(minY, maxY, mix);
  material.customProgramCacheKey = () => 'tron-building-base-gradient-neon';
}

export function cloneBuildingMaterial(material: Material) {
  const clone = material.clone();
  // Three.js does not copy shader hooks in Material.clone(). Keep the shared battle
  // uniform while ShaderMaterial.clone() still isolates reveal/opacity uniforms.
  clone.onBeforeCompile = material.onBeforeCompile;
  clone.customProgramCacheKey = material.customProgramCacheKey;
  return clone;
}
