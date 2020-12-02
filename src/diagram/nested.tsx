import React from "react";
import { Graph, Markup, Node, CellView, Cell } from "@antv/x6";
// import '../index.less'
import { test_data } from "./example-data";
import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";
import { nodeCenter } from "@antv/x6/lib/registry/node-anchor/main";
import { e_height, e_width, parent_height } from "./callbacks";

const graphWidth = 1200;
const graphHeight = 600;

const randPos = () => {
  return {
    x: Math.random() * (graphWidth - 100),
    y: Math.random() * (graphHeight - 100),
  };
};

const resize_from_children = (cell) => {
  const node: Node = cell;
  let x = node.getPosition().x;
  let y = node.getPosition().y;
  let cornerX = x + node.getSize().width;
  let cornerY = y + node.getSize().height;
  let hasChange = false;
  const children = node.getChildren();
  if (children) {
    children.forEach((child) => {
      const bbox = child.getBBox();
      const corner = bbox.getCorner();
      // console.log(child);

      if (bbox.x < x) {
        x = bbox.x;
        hasChange = true;
      }

      if (bbox.y < y) {
        y = bbox.y;
        hasChange = true;
      }

      if (corner.x > cornerX) {
        cornerX = corner.x;
        hasChange = true;
      }

      if (corner.y > cornerY) {
        cornerY = corner.y;
        hasChange = true;
      }
    });
  }
  console.log(hasChange);
  if (hasChange) {
    node.prop(
      {
        position: { x, y },
        size: { width: cornerX - x, height: cornerY - y },
      }
      // Note that we also pass a flag so that we know we shouldn't
      // adjust the `originPosition` and `originSize` in our handlers.
      // { skipParentHandler: true }
    );
  }
  const parent = node.getParent();
  if (parent && parent.isNode()) {
    resize_from_children(parent);
  }
};

const group_move_resize = (e) => {
  console.log("Move", e);
  const options = e.options;
  const node = e.cell;
  if (options && options.skipParentHandler) {
    return;
  }

  const children = node.getChildren();
  if (children && children.length) {
    node.prop("originPosition", node.getPosition());
  }

  const parent = node.getParent();
  if (parent && parent.isNode()) {
    let originSize = parent.prop("originSize");
    if (originSize == null) {
      parent.prop("originSize", parent.getSize());
    }
    originSize = parent.prop("originSize");

    let originPosition = parent.prop("originPosition");
    if (originPosition == null) {
      parent.prop("originPosition", parent.getPosition());
    }
    originPosition = parent.prop("originPosition");
    let x = originPosition.x;
    let y = originPosition.y;
    let cornerX = originPosition.x + originSize.width;
    let cornerY = originPosition.y + originSize.height;
    let hasChange = false;

    const children = parent.getChildren();
    if (children) {
      children.forEach((child) => {
        const bbox = child.getBBox();
        const corner = bbox.getCorner();
        // console.log(child);

        if (bbox.x < x) {
          x = bbox.x;
          hasChange = true;
        }

        if (bbox.y < y) {
          y = bbox.y;
          hasChange = true;
        }

        if (corner.x > cornerX) {
          cornerX = corner.x;
          hasChange = true;
        }

        if (corner.y > cornerY) {
          cornerY = corner.y;
          hasChange = true;
        }
      });
    }

    if (hasChange) {
      parent.prop(
        {
          position: { x, y },
          size: { width: cornerX - x, height: cornerY - y },
        },
        // Note that we also pass a flag so that we know we shouldn't
        // adjust the `originPosition` and `originSize` in our handlers.
        { skipParentHandler: true }
      );
    }
  }
};

const group_resize = (e) => {
  const node: Node = e.node;
  if (node.shape !== "group") {
    return;
  }
  if (e.options.skipParentHandler) {
    return;
  }
  if (
    0.001 > Math.abs(e.current.x - e.previous.x) &&
    0.001 > Math.abs(e.current.y - e.previous.y)
  ) {
    return;
  }

  console.log("resize", e);
  const children = node.getChildren();
  if (!children) {
    return;
  }
  for (const child of children) {
    child.prop({
      size: { width: node.size().width },
    });
  }
};

const update_size = (e) => {
  console.log("update size", e);
  resize_from_children(e.cell);
};

export default class Example extends React.Component {
  private container: HTMLDivElement;

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: graphWidth,
      height: graphHeight,
      grid: 10,
      resizing: {
        enabled: true,
      },
      //   interacting: function (cellView: CellView) {
      //     const cell: Cell = cellView.cell;
      //     if (cell.shape == "compartment" || cell.shape == "field") {
      //       return { nodeMovable: false };
      //     }
      //     return true;
      //   },
      selecting: true,
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
    // graph.on("node:change:position", group_move_resize);
    graph.on("node:resized", (e) => {
      e_width(e);
      e_height(e);
    });
    // graph.on("node:added", group_move_resize);
    // graph.on("node:change:size", group_resize);

    for (const prop of test_data.properties) {
      graph.addNode({
        id: prop["@id"],
        size: { width: 140, height: 40 },
        position: randPos(),
        shape: "group",
        component: <NodeShape text={prop["@id"]} />,
      });
    }
    for (const shape of test_data.shapes) {
      const shape_node = graph.addNode({
        id: shape["@id"],
        size: { width: 140, height: 40 },
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
          shape: "compartment",
          component: <Compartment text="General" />,
        });
        prop_compartment.addTo(shape_node);
        parent_height(prop_compartment);

        for (const [name, val] of props) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 30 },
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
          shape: "compartment",
          component: <Compartment text="Properties" />,
        });
        prop_compartment.addTo(shape_node);
        parent_height(prop_compartment);

        for (const prop of shape.property) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 30 },
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    );
  }
}
