import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import { Box3, Vector3 } from 'three';
import { CollisionProvider, useCollision } from './CollisionContext';

it('keeps collision API and registered walls stable across parent renders', () => {
  const wrapper = ({ children }: PropsWithChildren) => <CollisionProvider>{children}</CollisionProvider>;
  const { result, rerender, unmount } = renderHook(() => useCollision(), { wrapper });
  const api = result.current;
  const wall = {
    id: 'wall',
    position: new Vector3(),
    boundingBox: new Box3(new Vector3(-1, 0, -1), new Vector3(1, 1, 1)),
  };
  api.registerObject(wall);
  rerender();
  expect(result.current).toBe(api);
  expect(result.current.getObjectById('wall')).toBe(wall);
  expect(result.current.isCellOccupied(0, 0)).toBe(true);
  unmount();
  expect(api._getAllObjects()).toHaveLength(0);
  expect(api.isCellOccupied(0, 0)).toBe(false);
});
