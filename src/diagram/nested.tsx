import React from "react";
import { Graph, Addon, Markup, Node, CellView, Cell } from "@antv/x6";
import * as kiwi from "kiwi.js";
// import '../index.less'
import { test_data } from "./example-data";
import { get_data } from "./get_data";
import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";
import { nodeCenter } from "@antv/x6/lib/registry/node-anchor/main";

import { cpuUsage } from "process";
import { Constraint } from "kiwi.js";

const { Stencil } = Addon;

const graphWidth = 800;
const graphHeight = 600;

const randPos = () => {
  return {
    x: Math.random() * (graphWidth - 100),
    y: Math.random() * (graphHeight - 100),
  };
};

type MyState = { data: any };
export class Example extends React.Component<{}, MyState> {
  constructor(props) {
    super(props);
    this.state = { data: { properties: [], shapes: [] } };
  }
  componentDidMount() {
    get_data().then((data) => {
      this.setState({ data: data });
    });
  }
  render() {
    return <G data={this.state.data} />;
  }
}

type MyProps = { data: any };
export class G extends React.Component<MyProps, {}> {
  private container: HTMLDivElement;
  private stencilContainer: HTMLDivElement;

  private editing: boolean;
  private graph: any;
  private size_tree: { data: any; solver: kiwi.Solver };

  constructor(props) {
    super(props);
    this.editing = false;
    this.size_tree = { data: {}, solver: new kiwi.Solver() };
  }

  componentDidMount() {
    this.graph = new Graph({
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

    this.graph.bindKey("ctrl", () => {
      console.log("editor toggle");
      this.editing = !this.editing;
      this.graph.getNodes().forEach((n) => {
        n.attr("fo/magnet", this.editing);
      });
    });

    const stencil = new Stencil({
      title: "Components",
      target: this.graph,
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

    this.parse_data(this.graph);

    this.graph.on("node:resized", (e) => {
      this.size_calc(e, "resize");
    });
    this.graph.on("node:moved", (e) => {
      this.size_calc(e, "move");
    });
    this.graph.on("node:change:children", (e) => {
      this.size_calc(e, "embed");
    });
    this.graph.on("node:added", (e) => {
      this.size_calc(e, "add");
    });
  }
  componentDidUpdate() {
    this.parse_data(this.graph);
  }

  parse_data = (graph) => {
    const test_data = this.props.data;
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

        for (const [name, val] of props) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 50 },
            zIndex: 2,
            shape: "field",
            component: <NodeField text={`${name}:    ${val}`} />,
          });
          prop_node.addTo(prop_compartment);
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

        for (const prop of shape.property) {
          const prop_node = graph.createNode({
            size: { width: 200, height: 50 },
            zIndex: 2,
            shape: "field",
            component: <NodeField text={`sh:property:    ${prop["@id"]}`} />,
          });
          prop_node.addTo(prop_compartment);
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
  };

  get_path(id: string) {
    console.log(id, this.graph.getCell(id));
    const node: Node = this.graph.getCell(id);
    const ancestors = node.getAncestors();
    console.log("ancestors :", ancestors);
  }

  size_calc = (e, type) => {
    console.log(type, e);
    const node: Node = e.node;
    const { solver, data } = this.size_tree;
    if (type == "add") {
      if (!data[node.id]) {
        data[node.id] = {
          children: { data: {}, constraint: null },
          parent: null,
          top: new kiwi.Variable(),
          left: new kiwi.Variable(),
          width: new kiwi.Variable(),
          height: new kiwi.Variable(),
          constraints: [],
        };
        const n = data[node.id];
        n.constraints = [
          new kiwi.Constraint(
            n.width,
            kiwi.Operator.Ge,
            100,
            kiwi.Strength.required
          ),
          new kiwi.Constraint(
            n.height,
            kiwi.Operator.Ge,
            50,
            kiwi.Strength.required
          ),
        ];
        solver.addEditVariable(n.top, kiwi.Strength.medium);
        solver.addEditVariable(n.left, kiwi.Strength.strong);
        solver.addEditVariable(n.width, kiwi.Strength.medium);
        solver.addEditVariable(n.height, kiwi.Strength.weak);
        solver.suggestValue(n.top, 200);
        solver.suggestValue(n.left, 200);
        for (const constraint of n.constraints) {
          solver.addConstraint(constraint);
        }
      }
      if (node.shape === "field") {
        solver.removeEditVariable(data[node.id].height);
        solver.addEditVariable(data[node.id].height, kiwi.Strength.medium);
      }
    } else if (type == "embed") {
      const curr = e.current;
      let prev = e.previous;
      if (prev === undefined) {
        prev = [];
      }

      if (curr.length > prev.length) {
        // added
        const intersection = curr.filter((x) => !prev.includes(x));
        const updated = intersection[0]; // only 0 for now

        if (!this.graph.getCell(updated)) {
          // embed occured before add
          data[updated] = {
            children: { data: {}, constraint: null },
            parent: {
              id: node.id,
              constraints: [],
            },
            top: new kiwi.Variable(),
            left: new kiwi.Variable(),
            width: new kiwi.Variable(),
            height: new kiwi.Variable(),
            constraints: [],
          };
          const u = data[updated];
          const parent = data[node.id];
          parent.children.data[updated] = null;
          u.constraints = [
            new kiwi.Constraint(
              u.width,
              kiwi.Operator.Ge,
              100,
              kiwi.Strength.required
            ),
            new kiwi.Constraint(
              u.height,
              kiwi.Operator.Ge,
              50,
              kiwi.Strength.required
            ),
          ];
          solver.addEditVariable(u.top, kiwi.Strength.weak);
          solver.addEditVariable(u.left, kiwi.Strength.weak);
          solver.addEditVariable(u.width, kiwi.Strength.weak);
          solver.addEditVariable(u.height, kiwi.Strength.weak);
          solver.suggestValue(u.top, 200);

          for (const constraint of u.constraints) {
            solver.addConstraint(constraint);
          }
          u.parent.constraints = [
            new kiwi.Constraint(
              u.width,
              kiwi.Operator.Eq,
              parent.width,
              kiwi.Strength.medium
            ),
            new kiwi.Constraint(
              u.left,
              kiwi.Operator.Eq,
              parent.left,
              kiwi.Strength.medium
            ),
          ];
          for (const constraint of u.parent.constraints) {
            solver.addConstraint(constraint);
          }

          if (parent.children.constraint) {
            solver.removeConstraint(parent.children.constraint);
          }
          let parent_size = new kiwi.Expression();
          let offset = new kiwi.Expression(parent.top, 20);
          for (const child_id in parent.children.data) {
            const child = data[child_id];
            if (parent.children.data[child_id]) {
              solver.removeConstraint(parent.children.data[child_id]);
            }
            const child_offset = new kiwi.Constraint(
              child.top,
              kiwi.Operator.Eq,
              offset,
              kiwi.Strength.required
            );
            parent.children.data[child_id] = child_offset;
            solver.addConstraint(child_offset);
            offset = new kiwi.Expression(child.top, child.height);
            parent_size = parent_size.plus(child.height);
          }
          parent.children.constraint = new kiwi.Constraint(
            parent_size,
            kiwi.Operator.Eq,
            parent.height,
            kiwi.Strength.required
          );
          solver.addConstraint(parent.children.constraint);
        }
      } else {
        // removed
        console.log("removed");
      }
    } else if (type == "move") {
      solver.suggestValue(data[node.id].left, node.position().x);
      solver.suggestValue(data[node.id].top, node.position().y);
    } else if (type == "resize") {
      solver.suggestValue(data[node.id].width, node.size().width);
      solver.suggestValue(data[node.id].height, node.size().height);
    }

    solver.updateVariables();
    for (const id in data) {
      const node: Node = this.graph.getCell(id);
      if (node) {
        node.resize(data[id].width.value(), data[id].height.value());
        node.setPosition(data[id].left.value(), data[id].top.value());
      }
    }
  };

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
