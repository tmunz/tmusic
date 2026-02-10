import { createContext, useContext, useRef, ReactNode } from 'react';
import { Group } from 'three';

interface ReferenceObjectContextType {
  referenceObjectRef: React.RefObject<Group>;
}

const ReferenceObjectContext = createContext<ReferenceObjectContextType | null>(null);

export const ReferenceObjectProvider = ({ children }: { children: ReactNode }) => {
  const referenceObjectRef = useRef<Group>(null);

  return <ReferenceObjectContext.Provider value={{ referenceObjectRef }}>{children}</ReferenceObjectContext.Provider>;
};

export const useReferenceObject = () => {
  const context = useContext(ReferenceObjectContext);
  if (!context) {
    throw new Error('useReferenceObject must be used within ReferenceObjectProvider');
  }
  return context;
};
