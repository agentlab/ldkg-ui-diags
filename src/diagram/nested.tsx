import React from "react";
import { Graph, Markup, Node } from "@antv/x6";
// import '../index.less'
import { test_data } from "./example-data";
import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";
import { nodeCenter } from "@antv/x6/lib/registry/node-anchor/main";

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

const children_width = (node: Node, direction) => {
  const children = node.getChildren();
  if (!children) {
    return;
  }
  for (const child of children) {
    if (child.isNode()) {
      (child as Node).resize(node.size().width, child.size().height, {
        direction: direction,
      });
      children_width(child, direction);
    }
  }
};

const e_children_width = (e) => {
  console.log("children_width", e);
  children_width(e.cell, e.options.direction);
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
    });
    Graph.registerNode("group", {
      inherit: ReactShape,
    });
    // graph.on("node:change:position", group_move_resize);
    // graph.on("node:resized", update_size);
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
      shape_node.on("change:size", e_children_width);
      shape_node.on("resized", e_children_width);

      let offset_pos = shape_node.position();
      const props = Object.entries(shape).filter(
        ([name]) => name !== "@id" && name !== "property"
      );
      if (props) {
        const prop_compartment = graph.createNode({
          position: offset_pos,
          size: { width: 200, height: 30 },
          shape: "group",
          component: <Compartment text="General" />,
        });
        prop_compartment.addTo(shape_node);
        // prop_compartment.on("change:size", e => console.log(e));
        offset_pos.y += prop_compartment.size().height;

        for (const [name, val] of props) {
          const prop_node = graph.createNode({
            position: offset_pos,
            size: { width: 200, height: 30 },
            shape: "react-shape",
            component: <NodeField text={`${name}:    ${val}`} />,
          });
          prop_node.addTo(prop_compartment);
          offset_pos.y += prop_node.size().height;
        }
        prop_compartment.fit({
          padding: { top: prop_compartment.size().height },
        });
      }

      if (shape.property && shape.property.length !== 0) {
        const prop_compartment = graph.createNode({
          position: offset_pos,
          size: { width: 200, height: 30 },
          shape: "group",
          component: <Compartment text="Properties" />,
        });
        prop_compartment.addTo(shape_node);
        offset_pos.y += prop_compartment.size().height;

        for (const prop of shape.property) {
          const prop_node = graph.createNode({
            position: offset_pos,
            size: { width: 200, height: 30 },
            shape: "react-shape",
            component: <NodeField text={`sh:property:    ${prop["@id"]}`} />,
          });
          prop_node.addTo(prop_compartment);
          offset_pos.y += prop_node.size().height;
        }
        prop_compartment.fit({
          padding: { top: prop_compartment.size().height },
        });

        for (const prop of shape.property) {
          graph.addEdge({
            source: shape["@id"],
            target: prop["@id"],
            label: "sh:property",
          });
        }
      }
      shape_node.fit({ padding: { top: shape_node.size().height } });
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
