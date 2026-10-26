import { memo, useEffect, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Group, Light, Mesh, OrthographicCamera, Scene, Vector3, WebGLRenderTarget } from 'three';
import { useCollision } from '../../collision/CollisionContext';
import { getCollisionObjectData } from '../../collision/CollisionObjectDataProvider';
import { useWireframeCreate } from '../../object/useWireframeCreate';
import { BuildingArea } from './generateBuildings';
import { updateBuildingBattleFade } from './buildingBattleMaterial';
import { useTronStore } from '../../state/TronStore';
import { Mode } from '../../state/TronState';
import {
  BuildingTemplate,
  cloneBuildingModel,
  createBuildingLibrary,
  disposeBuildingLibrary,
  placeBuildings,
} from './buildingLibrary';

interface TronBuildingsProps {
  tiles: { x: number; z: number }[];
  tileSize: number;
  arena?: BuildingArea;
}

const BuildingInstance = memo(function BuildingInstance({
  id,
  x,
  z,
  template,
}: {
  id: string;
  x: number;
  z: number;
  template: BuildingTemplate;
}) {
  const { registerObject, unregisterObject } = useCollision();
  const model = useMemo(() => cloneBuildingModel(template.model), [template]);
  const preparedWireframe = useMemo(() => cloneBuildingModel(template.wireframe), [template]);
  const animation = useWireframeCreate({ color: '#00ddee', revealDuration: 0.7, holdDuration: 0.1, fadeDuration: 0.6 });

  useEffect(() => {
    animation.startCreate(model, preparedWireframe);
    // Start once per placement. Animation state updates must not restart the reveal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, preparedWireframe]);

  useFrame((_state, delta) => {
    if (animation.isAnimating) animation.animate(delta);
  });

  useEffect(() => {
    const ids = template.sections.map((section, index) => {
      const sectionId = `${id}-${index}`;
      registerObject(
        getCollisionObjectData({
          id: sectionId,
          boundingBox: new Box3().setFromCenterAndSize(new Vector3(), new Vector3(...section.size)),
          position: new Vector3(section.position[0] + x, section.position[1], section.position[2] + z),
          rotation: [0, 0, 0],
          type: 'worldObject',
        })
      );
      return sectionId;
    });
    return () => ids.forEach(unregisterObject);
  }, [id, x, z, template, registerObject, unregisterObject]);

  useEffect(
    () => () => {
      // Clones share library geometry and outline materials; only mesh materials are private.
      [model, preparedWireframe].forEach(group =>
        group.traverse(child => {
          if (child instanceof Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => material.dispose());
          }
        })
      );
    },
    [model, preparedWireframe]
  );

  return (
    <group position={[x, 0, z]} dispose={null}>
      <primitive object={model} visible={animation.showChildren} />
      {animation.wireframe && <primitive object={animation.wireframe} />}
    </group>
  );
});

export function TronBuildings({ tiles, tileSize, arena }: TronBuildingsProps) {
  const library = useMemo(createBuildingLibrary, []);
  const placements = useMemo(() => placeBuildings(tiles, tileSize, library, arena), [tiles, tileSize, library, arena]);
  const { gl, scene } = useThree();
  useFrame((_state, delta) => {
    updateBuildingBattleFade(library[0].battleMix, useTronStore.getState().mode === Mode.LIGHTCYCLE_BATTLE, delta);
  });

  useLayoutEffect(() => {
    // Upload every reusable model and compile its solid, fade, and reveal shaders at startup.
    // Subsequent tile changes only add placements referencing these GPU resources.
    const warmup = new Scene();
    warmup.fog = scene.fog;
    scene.traverse(child => {
      if (child instanceof Light) warmup.add(child.clone());
    });
    library.forEach(template => {
      const models = new Group();
      models.add(template.model.clone(true), template.wireframe.clone(true));
      models.add(new Mesh(template.geometry.bodies, template.fadeMaterial));
      models.traverse(child => {
        child.frustumCulled = false;
      });
      warmup.add(models);
    });
    const camera = new OrthographicCamera(-100, 100, 100, -100, 0.1, 500);
    camera.position.set(0, 100, 150);
    camera.lookAt(0, 25, 0);
    const target = new WebGLRenderTarget(1, 1);
    const previousTarget = gl.getRenderTarget();
    try {
      gl.setRenderTarget(target);
      gl.render(warmup, camera);
    } finally {
      gl.setRenderTarget(previousTarget);
      target.dispose();
    }
    // Canvas output/tone mapping uses different programs from an offscreen target.
    gl.compile(warmup, camera);
  }, [gl, scene, library]);

  useEffect(() => () => disposeBuildingLibrary(library), [library]);

  return (
    <>
      {placements.map(placement => (
        <BuildingInstance key={placement.id} {...placement} />
      ))}
    </>
  );
}
