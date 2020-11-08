import React from "react";
import { Graph, Markup } from "@antv/x6";
// import '../index.less'
import { test_data } from "./example-data";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
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

const group_resize = ({ node, options }) => {
  if (options.skipParentHandler) {
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

export default class Example extends React.Component {
  private container: HTMLDivElement;

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: graphWidth,
      height: graphHeight,
      grid: 10,
    });
    graph.on("node:change:position", group_resize);
    graph.on("node:added", group_resize);

    for (const prop of test_data.properties) {
      graph.addNode({
        id: prop["@id"],
        size: { width: 140, height: 40 },
        position: randPos(),
        shape: "react-shape",
        component: <NodeShape text={prop["@id"]} />,
      });
    }
    for (const shape of test_data.shapes) {
      const shape_node = graph.addNode({
        id: shape["@id"],
        size: { width: 140, height: 40 },
        position: randPos(),
        shape: "react-shape",
        component: <NodeShape text={shape["@id"]} />,
      });

      const props = Object.entries(shape).filter(
        ([name]) => name != "@id" && name != "property"
      );
      let offset_pos = shape_node.position();
      offset_pos.y += shape_node.size().height;
      for (const [name, val] of props) {
        const prop_node = graph.createNode({
          position: offset_pos,
          size: { width: 200, height: 30 },
          shape: "react-shape",
          component: <NodeField text={`${name}:    ${val}`} />,
        });
        prop_node.addTo(shape_node);

        offset_pos.y += prop_node.size().height;
      }

      for (const prop of shape.property) {
        graph.addEdge({
          source: shape["@id"],
          target: prop["@id"],
          label: "sh:property",
        });
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
