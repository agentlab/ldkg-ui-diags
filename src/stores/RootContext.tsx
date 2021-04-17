import React, { useContext, createContext, PropsWithChildren } from 'react';
import { rootStore } from './RootStore';

export const RootContext = createContext<any>({
  graphStore: {},
  layoutStore: {},
  minimap: {},
  setMinimap: () => {},
  isClassDiagram: true,
  switchShape: () => {},
});
export const useRootStore = () => useContext(RootContext);

export const RootContextProvider = ({ children }: PropsWithChildren<any>) => {
  return <RootContext.Provider value={{ rootStore }}>{children}</RootContext.Provider>;
};
