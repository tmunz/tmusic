import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, Mesh, Group } from 'three';
import { useTronState } from '../TronContext';

interface DirectionIndicatorProps {
  targetRef: React.RefObject<Mesh>;
  battlefieldSize?: number;
}

export const DirectionIndicator = ({ targetRef, battlefieldSize = 100 }: DirectionIndicatorProps) => {
  const { tronState } = useTronState();
  const arrowRef = useRef<Group>(null);

  useFrame(() => {
    if (!arrowRef.current || !targetRef.current) return;

    const vehiclePos = targetRef.current.position;
    const battlefieldPosition = new Vector3(
      tronState.game.position.x,
      tronState.game.position.y,
      tronState.game.position.z
    );
    
    const isOutside = !tronState.game.userInsideBattleground;

    if (isOutside) {
      arrowRef.current.visible = true;

      arrowRef.current.position.set(vehiclePos.x, vehiclePos.y + 1.5, vehiclePos.z);

      const direction = new Vector3(
        battlefieldPosition.x - vehiclePos.x,
        0,
        battlefieldPosition.z - vehiclePos.z
      ).normalize();

      const angle = Math.atan2(direction.x, direction.z);
      arrowRef.current.rotation.y = angle;
    } else {
      arrowRef.current.visible = false;
    }
  });

  return (
    <group ref={arrowRef} visible={false}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial 
          color="#66EEFF" 
          emissive="#66EEFF"
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
