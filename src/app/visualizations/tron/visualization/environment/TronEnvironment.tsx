import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TronGrid } from './TronGrid';
import { TronSkyBox } from './TronSkyBox';
import { useTronStore } from '../state/TronStore';
import { Mode } from '../state/TronState';
import { TronLightningEnvironment } from './TronLightningEnvironment';

interface TronEnvironmentProps {
  tileSize: number;
  viewDistance?: number;
}

export interface WorldTile {
  x: number;
  z: number;
  key: string;
  worldX: number;
  worldZ: number;
}

export const TronEnvironment = ({ tileSize, viewDistance = 0 }: TronEnvironmentProps) => {
  const mode = useTronStore(state => state.mode);
  const gamePosition = useTronStore(state => state.game.position);
  const battlegroundSize = useTronStore(state => state.game.battlegroundSize);
  const { camera } = useThree();
  const getInitialTiles = () => {
    const initialTiles: WorldTile[] = [];
    for (let x = -viewDistance; x <= viewDistance; x++) {
      for (let z = -viewDistance; z <= viewDistance; z++) {
        initialTiles.push({
          x,
          z,
          key: `${x}-${z}`,
          worldX: x * tileSize + tileSize / 2,
          worldZ: z * tileSize + tileSize / 2,
        });
      }
    }
    return initialTiles;
  };

  const [tiles, setTiles] = useState<WorldTile[]>(getInitialTiles());
  const lastCameraTile = useRef({ x: 0, z: 0 });

  useFrame(() => {
    const cameraPos = camera.position;
    const currentTileX = Math.floor(cameraPos.x / tileSize);
    const currentTileZ = Math.floor(cameraPos.z / tileSize);

    if (currentTileX !== lastCameraTile.current.x || currentTileZ !== lastCameraTile.current.z) {
      lastCameraTile.current = { x: currentTileX, z: currentTileZ };

      const newTiles: WorldTile[] = [];
      for (let x = currentTileX - viewDistance; x <= currentTileX + viewDistance; x++) {
        for (let z = currentTileZ - viewDistance; z <= currentTileZ + viewDistance; z++) {
          newTiles.push({
            x,
            z,
            key: `${x}-${z}`,
            worldX: x * tileSize + tileSize / 2,
            worldZ: z * tileSize + tileSize / 2,
          });
        }
      }

      setTiles(newTiles);
    }
  });

  return (
    <>
      <TronLightningEnvironment />
      <TronSkyBox />
      {tiles.map(tile => {
        const isLightcycleBattle = mode === Mode.LIGHTCYCLE_BATTLE;
        const gamePos = gamePosition;
        const bgSize = battlegroundSize;

        const tileLeft = tile.worldX - tileSize / 2;
        const tileRight = tile.worldX + tileSize / 2;
        const tileTop = tile.worldZ - tileSize / 2;
        const tileBottom = tile.worldZ + tileSize / 2;

        const bgLeft = gamePos.x - bgSize / 2;
        const bgRight = gamePos.x + bgSize / 2;
        const bgTop = gamePos.z - bgSize / 2;
        const bgBottom = gamePos.z + bgSize / 2;

        const withinBattleGround =
          !isLightcycleBattle || (tileRight > bgLeft && tileLeft < bgRight && tileBottom > bgTop && tileTop < bgBottom);

        return (
          <TronGrid
            key={tile.key}
            position={[tile.worldX, 0, tile.worldZ]}
            size={tileSize}
            sectionSize={5}
            fadeDistance={200}
            sectionColor={withinBattleGround ? '#004444' : '#440000'}
            cellColor={withinBattleGround ? '#000000' : '#330000'}
            sparksCount={0}
          />
        );
      })}

      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>
    </>
  );
};
