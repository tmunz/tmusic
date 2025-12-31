import './Menubar.css';
import React, { HTMLAttributes, useState, useCallback, useMemo } from 'react';
import { useActivityToggle } from '../../utils/useActivityToggle';

interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  hideTimeout: number;
}

export const Menubar = ({ hideTimeout, children }: MenubarProps) => {
  const [activeItems, setActiveItems] = useState<Set<number>>(new Set());
  const childrenCount = React.Children.count(children);

  const updateActiveState = useCallback((index: number, isActive: boolean) => {
    setActiveItems(prev => {
      const newSet = new Set(prev);
      if (isActive) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  }, []);

  const onActiveChanges = useMemo(() => {
    return Array.from(
      { length: childrenCount },
      (_, index) => (isActive: boolean) => updateActiveState(index, isActive)
    );
  }, [childrenCount, updateActiveState]);

  const visible = useActivityToggle(true, activeItems.size === 0, hideTimeout);

  return (
    <div className={`menubar ${visible ? 'visible' : 'hidden'}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          ...child.props,
          onActiveChange: onActiveChanges[index],
        });
      })}
    </div>
  );
};
