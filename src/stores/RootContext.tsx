import React, { useContext, createContext, PropsWithChildren } from 'react';

export const RootContext = createContext<any>({
  graphStore: {},
  layoutStore: {},
  minimap: {},
  setMinimap: () => {},
  isClassDiagram: true,
  switchShape: () => {},
});
export const useRootStore = () => useContext(RootContext);

export const RootContextProvider = ({ rootStore, children }: PropsWithChildren<any>) => {
  return <RootContext.Provider value={{ rootStore }}>{children}</RootContext.Provider>;
};
