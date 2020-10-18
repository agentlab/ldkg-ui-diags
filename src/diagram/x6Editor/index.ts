import { Graph, FunctionExt, Shape } from "@antv/x6";
import "./shape";

import { Bus, Fader, Aux, Component, Connector } from "../bus/shapes";
import "../bus/index.less";

const data = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "hello", // String，节点标签
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "world", // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
    },
  ],
};

export default class X6Editor {
  private static instance: X6Editor;
  private _graph: Graph;
  private container: HTMLElement;

  public get graph() {
    return this._graph;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new X6Editor();
    }
    return this.instance;
  }

  constructor() {
    this.container = document.getElementById("container")!;
    this._graph = new Graph({
      container: this.container,
      width: document.body.offsetWidth - 800,
      height: document.body.offsetHeight - 132,
      grid: {
        size: 10,
        visible: true,
        type: "doubleMesh",
        args: [
          {
            color: "#e6e6e6",
            thickness: 1,
          },
          {
            color: "#d0d0d0",
            thickness: 1,
            factor: 4,
          },
        ],
      },
      connecting: {
        //anchor: 'center',
        //connectionPoint: 'anchor',
        //dangling: false,

        connectionPoint: {
          name: "boundary",
          args: { selector: "body" },
        },
        anchor: {
          name: "orth",
        },
        edgeAnchor: {
          name: "orth",
        },

        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "#ea6b66",
                strokeWidth: 1,
                targetMarker: {
                  name: "circle",
                  r: 1,
                },
              },
            },
            router: {
              name: "manhattan",
            },
          });
        },

        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false;
          }
          if (!sourceMagnet) {
            return false;
          }
          if (!targetMagnet) {
            return false;
          }
          return true;
        },
      },
      interacting: {
        edgeMovable: false,
        edgeLabelMovable: false,
      },
      highlighting: {
        default: {
          name: "className",
          args: {
            className: "active",
          },
        },
      },
      snapline: true,
      resizing: true,
      rotating: true,
      history: true,
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      scroller: {
        enabled: true,
        // width: 600,
        // height: 400,
        pageVisible: true,
        //pageBreak: true,
        //pannable: true,
      },
      minimap: {
        enabled: true,
        container: document.getElementById("minmapContainer")!,
        width: 350,
        height: 200,
        padding: 10,
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ["ctrl", "meta"],
      },
    });
    this.initEvent();
    //this._graph.fromJSON(data);

    var bus1 = Bus.create1(600, "Sub-group 1", "#333333");
    var bus2 = Bus.create1(625, "Sub-group 2", "#333333");
    var bus3 = Bus.create1(650, "Sub-group 3", "#333333");
    var bus4 = Bus.create1(675, "Sub-group 4", "#333333");
    var bus5 = Bus.create1(700, "Mix Left", "#ff5964");
    var bus6 = Bus.create1(725, "Mix Right", "#b5d99c");
    var bus7 = Bus.create1(750, "Post-fade Aux", "#35a7ff");
    var bus8 = Bus.create1(775, "Pre-fade Aux", "#6b2d5c");

    var component1 = Component.create1(850, 80, 80, 80, "Stereo Mix").addPort({
      group: "out",
    });
    var component2 = Component.create1(840, 230, 100, 30, "Pre Aux").addPort({
      group: "out",
    });
    var component3 = Component.create1(840, 180, 100, 30, "Post Aux").addPort({
      group: "out",
    });
    var component4 = Component.create1(450, 100, 90, 100, "Output Routing");
    var component5 = Component.create1(450, 350, 90, 100, "Output Routing");
    var component6 = Component.create1(
      100,
      130,
      150,
      40,
      "Input Channel"
    ).addPort({ group: "in" });
    var component7 = Component.create1(100, 380, 150, 40, "Sub-group 1");

    var fader1 = Fader.create1(350, 110);
    var fader2 = Fader.create1(350, 360);
    var aux1 = Aux.create1(420, 220, "Post-fade Aux");
    var aux2 = Aux.create1(350, 260, "Pre-fade Aux");
    var aux3 = Aux.create1(420, 470, "Post-fade Aux");
    var aux4 = Aux.create1(350, 510, "Pre-fade Aux");

    var connector1 = Connector.create1(bus1, component7);
    var connector2 = Connector.create1(fader2, component5);
    var connector3 = Connector.create1(connector2, aux3);
    var connector4 = Connector.create1(fader1, component4);
    var connector5 = Connector.create1(connector4, aux1);
    var connector6 = Connector.create1(component7, fader2);
    var connector7 = Connector.create1(connector6, aux4);
    var connector8 = Connector.create1(component6, fader1);
    var connector9 = Connector.create1(connector8, aux2);
    var connector10 = Connector.create1(bus5, [component1, -10]);
    var connector11 = Connector.create1(bus6, [component1, 10]);
    var connector12 = Connector.create1(bus7, component3);
    var connector13 = Connector.create1(bus8, component2);
    var connector14 = Connector.create1([component4, -40], bus1);
    var connector15 = Connector.create1([component4, -24], bus2);
    var connector16 = Connector.create1([component4, -8], bus3);
    var connector17 = Connector.create1([component4, 8], bus4);
    var connector18 = Connector.create1([component4, 24], bus5);
    var connector19 = Connector.create1([component4, 40], bus6);
    var connector20 = Connector.create1([component5, -20], bus5);
    var connector21 = Connector.create1([component5, 20], bus6);
    var connector22 = Connector.create1(aux1, bus7);
    var connector23 = Connector.create1(aux2, bus8);
    var connector24 = Connector.create1(aux3, bus7);
    var connector25 = Connector.create1(aux4, bus8);

    // Special Marker
    connector1.attr("line", {
      sourceMarker: {
        type: "path",
        d: "M -2 -8 15 0 -2 8 z",
      },
    });

    // Vertices
    connector1.setVertices([{ x: 175, y: 320 }]);
    connector3.setVertices([{ x: 400, y: 485 }]);
    connector5.setVertices([{ x: 400, y: 235 }]);
    connector7.setVertices([{ x: 310, y: 525 }]);
    connector9.setVertices([{ x: 310, y: 275 }]);

    // Embed vertices
    component7.embed(connector1);
    aux3.embed(connector3 as any);
    aux1.embed(connector5 as any);
    aux4.embed(connector7 as any);
    aux2.embed(connector9 as any);

    this._graph.model.resetCells([
      bus1,
      bus2,
      bus3,
      bus4,
      bus5,
      bus6,
      bus7,
      bus8,
      component1,
      component2,
      component3,
      component4,
      component5,
      component6,
      component7,
      fader1,
      fader2,
      aux1,
      aux2,
      aux3,
      aux4,
      connector1,
      connector2,
      connector3,
      connector4,
      connector5,
      connector6,
      connector7,
      connector8,
      connector9,
      connector10,
      connector11,
      connector12,
      connector13,
      connector14,
      connector15,
      connector16,
      connector17,
      connector18,
      connector19,
      connector20,
      connector21,
      connector22,
      connector23,
      connector24,
      connector25,
    ] as any);
  }

  showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  }

  initEvent() {
    const { graph } = this;

    // show or hide ports
    this.graph.on(
      "node:mouseenter",
      FunctionExt.debounce(() => {
        const ports = this.container.querySelectorAll(
          ".x6-port-body"
        ) as NodeListOf<SVGAElement>;
        this.showPorts(ports, true);
      }),
      500
    );
    graph.on("node:mouseleave", () => {
      const ports = this.container.querySelectorAll(
        ".x6-port-body"
      ) as NodeListOf<SVGAElement>;
      this.showPorts(ports, false);
    });

    // keyboard
    graph.bindKey("meta+c", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    });
    graph.bindKey("meta+v", () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    });
    graph.bindKey("meta+x", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells);
      }
      return false;
    });
    graph.bindKey("backspace", () => {
      const cells = graph.getSelectedCells();
      const focusElem = document.activeElement;
      if (focusElem?.className === "x6-edit-text") {
        return true;
      }
      if (cells.length) {
        graph.removeCells(cells);
      }
      return false;
    });
  }
}
