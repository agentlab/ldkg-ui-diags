import { reaction } from "mobx";
import { useContext, createContext } from "react";
import GraphStore from "./GraphStore";
import LayoutStore from "./LayoutStore";

const graphStore = new GraphStore();
const layoutStore = new LayoutStore();

const onGridAttrsChanged = (attrs) => {
  let options
  if (attrs.type === 'doubleMesh') {
    options = {
      type: attrs.type,
      args: [
        {
          color: attrs.color,
          thickness: attrs.thickness,
        },
        {
          color: attrs.colorSecond,
          thickness: attrs.thicknessSecond,
          factor: attrs.factor,
        },
      ],
    }
  } else {
    options = {
      type: attrs.type,
      args: [
        {
          color: attrs.color,
          thickness: attrs.thickness,
        },
      ],
    }
  }
  graphStore.graph?.drawGrid(options)
}

const gridAttrs = ['type', 'color', 'thickness', 'thicknessSecond', 'colorSecond', 'factor'];
gridAttrs.forEach(attr => reaction( () => layoutStore.gridOptions[attr], () => onGridAttrsChanged(layoutStore.gridOptions) ))

reaction(() => layoutStore.gridOptions.size, size => {
  graphStore.graph?.setGridSize(size)
});

reaction(() => layoutStore.gridOptions.bgColor, bgColor => {
  const options = {
    color: bgColor,
  }
  graphStore.graph?.drawBackground(options)
})

const GraphContext = createContext({graphStore, layoutStore});
const useGraph = () => useContext(GraphContext);
export default useGraph;
