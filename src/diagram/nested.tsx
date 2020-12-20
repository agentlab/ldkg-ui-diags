import React from "react";
import { Graph, Addon, Markup, Node, CellView, Cell } from "@antv/x6";
// import '../index.less'
import { test_data } from "./example-data";
import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";
import { nodeCenter } from "@antv/x6/lib/registry/node-anchor/main";
import {
  e_height,
  e_width,
  parent_height,
  e_children,
  e_moved,
} from "./callbacks";

const { Stencil } = Addon;

const graphWidth = 1200;
const graphHeight = 600;

const randPos = () => {
  return {
    x: Math.random() * (graphWidth - 100),
    y: Math.random() * (graphHeight - 100),
  };
};

export default class Example extends React.Component {
  private container: HTMLDivElement;
  private stencilContainer: HTMLDivElement;

  private editing: boolean;

  componentDidMount() {
    this.editing = false;
    const graph = new Graph({
      container: this.container,
      width: graphWidth,
      height: graphHeight,
      grid: 10,
      resizing: {
        enabled: true,
      },
      embedding: {
        enabled: true,
        findParent: "center",
      },
      selecting: true,
      connecting: {
        dangling: false,
        router: "metro",
        connector: {
          name: "jumpover",
          args: {
            type: "gap",
          },
        },
      },
      keyboard: {
        enabled: true,
      },
    });

    Graph.registerNode("group", {
      inherit: ReactShape,
    });
    Graph.registerNode("compartment", {
      inherit: ReactShape,
    });
    Graph.registerNode("field", {
      inherit: ReactShape,
    });

    graph.bindKey("ctrl", () => {
      console.log("editor toggle");
      this.editing = !this.editing;
      graph.getNodes().forEach((n) => {
        n.attr("fo/magnet", this.editing);
      });
    });

    const stencil = new Stencil({
      title: "Components",
      target: graph,
      collapsable: true,
      stencilGraphWidth: 300,
      stencilGraphHeight: 180,
      layoutOptions: {
        columns: 1,
      },
      groups: [
        {
          name: "group1",
          title: "Components",
        },
      ],
    });
    this.stencilContainer.appendChild(stencil.container);
    const nodeShape = new ReactShape({
      id: "Node Shape",
      size: { width: 140, height: 40 },
      zIndex: 0,
      shape: "group",
      component: <NodeShape text={"Node Shape"} />,
    });
    const nodeField = new ReactShape({
      id: "Node Field",
      size: { width: 140, height: 40 },
      zIndex: 2,
      shape: "field",
      component: <NodeField text={"Node Field"} />,
    });
    stencil.load([nodeShape, nodeField], "group1");

    for (const prop of test_data.properties) {
      graph.addNode({
        id: prop["@id"],
        size: { width: 140, height: 40 },
        zIndex: 0,
        position: randPos(),
        shape: "group",
        component: <NodeShape text={prop["@id"]} />,
      });
    }
    for (const shape of test_data.shapes) {
      const shape_node = graph.addNode({
        id: shape["@id"],
        size: { width: 140, height: 40 },
        zIndex: 0,
        position: randPos(),
        shape: "group",
        component: <NodeShape text={shape["@id"]} />,
      });

      const props = Object.entries(shape).filter(
        ([name]) => name !== "@id" && name !== "property"
      );
      if (props) {
        const prop_compartment = graph.createNode({
          size: { width: 200, height: 30 },
          zIndex: 1,
          shape: "compartment",
          component: <Compartment text="General" />,
        });
        prop_compartment.addTo(shape_node);
        parent_height(prop_compartment);

        for (const [name, val] of props) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 50 },
            zIndex: 2,
            shape: "field",
            component: <NodeField text={`${name}:    ${val}`} />,
          });
          prop_node.addTo(prop_compartment);
          parent_height(prop_node);
        }
      }

      if (shape.property && shape.property.length !== 0) {
        const prop_compartment = graph.createNode({
          size: { width: 200, height: 30 },
          zIndex: 1,
          shape: "compartment",
          component: <Compartment text="Properties" />,
        });
        prop_compartment.addTo(shape_node);
        parent_height(prop_compartment);

        for (const prop of shape.property) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 50 },
            zIndex: 2,
            shape: "field",
            component: <NodeField text={`sh:property:    ${prop["@id"]}`} />,
          });
          prop_node.addTo(prop_compartment);
          parent_height(prop_node);
        }

        for (const prop of shape.property) {
          graph.addEdge({
            source: shape["@id"],
            target: prop["@id"],
            label: "sh:property",
          });
        }
      }
    }

    for (const prop of test_data.properties) {
      if (prop.node) {
        graph.addEdge({
          target: prop["node"],
          source: prop["@id"],
          label: "sh:node",
        });
      }
    }
    graph.on("node:resized", (e) => {
      e_width(e);
      e_height(e);
    });
    graph.on("node:moved", (e) => {
      e_moved(e);
    });
    graph.on("node:change:children", (e) => {
      e_children(e);
    });
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };

  render() {
    return (
      <div className="app-wrap">
        <div ref={this.refStencil} className="app-stencil" />
        <div ref={this.refContainer} className="app-content" />
      </div>
    );
  }
}
