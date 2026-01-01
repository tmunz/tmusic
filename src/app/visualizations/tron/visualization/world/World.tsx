import { useRef, useState, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TronGrid } from './TronGrid';
import { TronCube } from './TronCube';

interface WorldProps {
  targetRef: RefObject<THREE.Mesh>;
  tileSize?: number;
  viewDistance?: number;
}

export interface WorldTile {
  x: number;
  z: number;
  key: string;
  worldX: number;
  worldZ: number;
}

export const World = ({ targetRef, tileSize = 50, viewDistance = 3 }: WorldProps) => {
  const getInitialTiles = () => {
    const initialTiles: WorldTile[] = [];
    for (let x = -viewDistance; x <= viewDistance; x++) {
      for (let z = -viewDistance; z <= viewDistance; z++) {
        initialTiles.push({
          x,
          z,
          key: `${x}-${z}`,
          worldX: x * tileSize,
          worldZ: z * tileSize,
        });
      }
    }
    return initialTiles;
  };

  const [tiles, setTiles] = useState<WorldTile[]>(getInitialTiles());
  const lastPlayerTile = useRef({ x: 0, z: 0 });

  useFrame(() => {
    if (targetRef?.current) {
      const playerPos = targetRef.current.position;

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
              worldX: x * tileSize,
              worldZ: z * tileSize,
            });
          }
        }

        setTiles(newTiles);
      }
    }
  });

  return (
    <group>
      {tiles.map(tile => (
        <TronGrid
          key={tile.key}
          position={[tile.worldX, 0, tile.worldZ]}
          size={50}
          sectionSize={5}
          fadeDistance={100}
        />
      ))}

      <TronCube id="cube-0" position={[5, 0.5, 5]} rotation={[0, Math.PI / 4, 0]} />
      <TronCube id="cube-1" position={[-5, 0.5, 5]} />
      <TronCube id="cube-2" position={[5, 0.5, -5]} />
      <TronCube id="cube-3" position={[-5, 0.5, -5]} />
    </group>
  );
};
