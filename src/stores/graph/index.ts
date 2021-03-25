import { useContext, createContext } from "react";
interface GraphContextProps {
  graphStore: any,
  layoutStore: any,
}

export const GraphContext = createContext<GraphContextProps>({graphStore: {}, layoutStore: {}});
export const useGraph = () => useContext(GraphContext);
