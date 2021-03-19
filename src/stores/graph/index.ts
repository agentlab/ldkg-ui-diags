import { useContext, createContext } from "react";
import GraphStore from "./GraphStore";
import LayoutStore from "./LayoutStore";

const graphStore = new GraphStore();
const layoutStore = new LayoutStore();

const GraphContext = createContext({graphStore, layoutStore});
const useGraph = () => useContext(GraphContext);
export default useGraph;
