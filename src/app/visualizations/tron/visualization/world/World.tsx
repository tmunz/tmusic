import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TronGrid } from './TronGrid';
import { TronCube } from '../object/TronCube';
import { useTronState } from '../TronContext';
import { TronSkyBox } from './TronSkyBox';

interface WorldProps {
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

export const World = ({ tileSize, viewDistance = 0 }: WorldProps) => {
  const { tronState } = useTronState();
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
  const lastPlayerTile = useRef({ x: 0, z: 0 });

  useFrame(() => {
    const playerPos = tronState.user.position;

    const currentTileX = Math.floor(playerPos.x / tileSize);
    const currentTileZ = Math.floor(playerPos.z / tileSize);

    if (currentTileX !== lastPlayerTile.current.x || currentTileZ !== lastPlayerTile.current.z) {
      lastPlayerTile.current = { x: currentTileX, z: currentTileZ };

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
      <TronSkyBox />
      {tiles.map(tile => {
        const isGameActive = tronState.game.active;
        const gamePos = tronState.game.position;
        const battlegroundSize = tronState.game.battlegroundSize;

        const tileLeft = tile.worldX - tileSize / 2;
        const tileRight = tile.worldX + tileSize / 2;
        const tileTop = tile.worldZ - tileSize / 2;
        const tileBottom = tile.worldZ + tileSize / 2;

        const bgLeft = gamePos.x - battlegroundSize / 2;
        const bgRight = gamePos.x + battlegroundSize / 2;
        const bgTop = gamePos.z - battlegroundSize / 2;
        const bgBottom = gamePos.z + battlegroundSize / 2;

        const withinBattleGround =
          !isGameActive || (tileRight > bgLeft && tileLeft < bgRight && tileBottom > bgTop && tileTop < bgBottom);

        return (
          <TronGrid
            key={tile.key}
            position={[tile.worldX, 0, tile.worldZ]}
            size={tileSize}
            sectionSize={5}
            fadeDistance={200}
            sectionColor={withinBattleGround ? '#004444' : '#440000'}
            cellColor={withinBattleGround ? '#000000' : '#330000'}
          />
        );
      })}

      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10000, 10000]} />
        <meshBasicMaterial color="#000000" toneMapped={false} />
      </mesh>

      {tronState.game.active && (
        <>
          <TronCube
            id="cube-0"
            position={[
              tronState.game.position.x + tronState.game.battlegroundSize / 2,
              0.5,
              tronState.game.position.z + tronState.game.battlegroundSize / 2,
            ]}
            rotation={[0, Math.PI / 4, 0]}
          />
          <TronCube
            id="cube-1"
            position={[
              tronState.game.position.x - tronState.game.battlegroundSize / 2,
              0.5,
              tronState.game.position.z + tronState.game.battlegroundSize / 2,
            ]}
          />
          <TronCube
            id="cube-2"
            position={[
              tronState.game.position.x + tronState.game.battlegroundSize / 2,
              0.5,
              tronState.game.position.z - tronState.game.battlegroundSize / 2,
            ]}
          />
          <TronCube
            id="cube-3"
            position={[
              tronState.game.position.x - tronState.game.battlegroundSize / 2,
              0.5,
              tronState.game.position.z - tronState.game.battlegroundSize / 2,
            ]}
          />
        </>
      )}
    </>
  );
};
