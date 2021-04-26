import { Graph, Cell, Markup } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
import { stencils } from './stencils/index';
import { EdgeView, NodeView } from '@antv/x6';
import { EditableCellTool } from './stencils/NodeField';
import { cloneDeep } from 'lodash';
import ReactDOM from 'react-dom';

class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    });
  }
  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6',
      },
    });
  }
}

class SimpleEdgeView extends EdgeView {
  update() {
    this.cleanCache();
    this.updateConnection();
    const partialAttrs = {
      line: {
        stroke: '#31d0c6',
        strokeWidth: 4,
        targetMarker: 'classic',
      },
      lines: {
        connection: true,
        strokeLinejoin: 'round',
      },
      wrap: {
        strokeWidth: 4,
      },
    };
    const attrs = this.cell.getAttrs();
    if (attrs != null) {
      super.updateAttrs(this.container, attrs, {
        attrs: partialAttrs === attrs ? null : partialAttrs,
        selectors: this.selectors,
      });
    }
    return this;
  }
  renderTools() {
    return this;
  }
  renderExternalTools() {
    return this;
  }
  renderArrowheadMarkers() {
    return this;
  }
  renderVertexMarkers() {
    return this;
  }
  renderLabels() {
    return this;
  }
}

export const createGraph = ({ width, height, refContainer, minimapContainer, edgeConnectorRef, rootStore }) => {
  try {
    Graph.registerNode(
      'group',
      {
        inherit: ReactShape,
      },
      true,
    );
    Graph.registerNode(
      'compartment',
      {
        inherit: ReactShape,
      },
      true,
    );
    Graph.registerNode(
      'field',
      {
        inherit: ReactShape,
      },
      true,
    );

    const circleArrowhead = {
      tagName: 'circle',
      attrs: {
        r: 5,
        fill: 'white',
        stroke: 'black',
        'stroke-width': 0.5,
        cursor: 'move',
      },
    };
    Graph.registerEdgeTool(
      'circle-source-arrowhead',
      {
        inherit: 'source-arrowhead',
        ...circleArrowhead,
      },
      true,
    );
    Graph.registerEdgeTool(
      'circle-target-arrowhead',
      {
        inherit: 'target-arrowhead',
        ...circleArrowhead,
      },
      true,
    );
    //Graph.registerEdgeTool('editableCell', EditableCellTool, true);
    Graph.registerEdgeTool('editableCell', EditableCellTool, true);
  } catch (e) {
    // typically happens during recompilation
    console.log(e);
  }
  const g = new Graph({
    container: refContainer.current,
    width: width,
    height: height,
    grid: {
      visible: true,
    },
    resizing: {
      enabled: true,
    },
    history: true,
    clipboard: {
      enabled: true,
    },
    minimap: {
      enabled: true,
      container: minimapContainer.current,
      width: 200,
      height: 160,
      padding: 10,
      graphOptions: {
        async: false,
        sorting: 'none',
        getCellView(cell) {
          if (cell.isNode()) {
            return SimpleNodeView;
          }
          if (cell.isEdge()) {
            return SimpleEdgeView;
          }
        },
      },
    },
    onEdgeLabelRendered: (args) => {
      const { selectors, label } = args;
      const Renderer = stencils['defaultLabel'];
      const content = selectors.foContent as HTMLDivElement;
      if (content) {
        ReactDOM.render(<Renderer parent={selectors.fo} label={label?.attrs?.fo.label} onSave={() => {}} />, content);
      }
    },
    scroller: {
      enabled: true,
      pageVisible: true,
      pageBreak: false,
      pannable: true,
    },
    mousewheel: {
      enabled: true,
      factor: 1.1,
      modifiers: ['ctrl', 'meta'],
    },
    //minimap,
    embedding: {
      enabled: true,
      findParent: 'center',
    },
    selecting: true,
    connecting: {
      dangling: false,
      connector: {
        name: 'jumpover',
        args: {
          type: 'gap',
        },
      },
      createEdge() {
        return g.createEdge(edgeConnectorRef.current);
      },
    },
    keyboard: {
      enabled: true,
    },
    interacting: {
      edgeMovable: true,
      arrowheadMovable: true,
    },
  });

  g.on('selection:changed', ({ added, removed }: { added: Cell[]; removed: Cell[] }) => {
    added.forEach((cell) => {
      if (cell.isEdge()) {
        cell.addTools(['circle-source-arrowhead', 'circle-target-arrowhead']);
      }
    });
    removed.forEach((cell) => {
      if (cell.isEdge()) {
        cell.removeTools();
      }
    });
  });

  const connectKey = 'shift';
  const setMagnet = (node: any, active: boolean) => {
    node.attr('body/magnet', active);
    node.attr('fo/magnet', active);
  };
  g.bindKey(
    connectKey,
    () => {
      (g as Graph).getNodes().forEach((node: any) => {
        if (edgeConnectorRef.current) {
          setMagnet(node, true);
        }
      });
    },
    'keydown',
  );
  g.bindKey(
    connectKey,
    () => {
      (g as Graph).getNodes().forEach((node: any) => setMagnet(node, false));
    },
    'keyup',
  );
  g.on('edge:connected', () => {
    (g as Graph).getNodes().forEach((node: any) => {
      setMagnet(node, false);
    });
  });
  return g;
};

export const createGrid = ({ graph, view }) => {
  const drawNewGrid = (attrs) => {
    let options;
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
      };
    } else {
      options = {
        type: attrs.type,
        args: [
          {
            color: attrs.color,
            thickness: attrs.thickness,
          },
        ],
      };
    }
    graph.drawGrid(options);
  };

  if (view.options?.gridOptions) {
    drawNewGrid(view.options.gridOptions);
    if (view.options.gridOptions.size) graph.setGridSize(view.options.gridOptions.size);
    if (view.options.gridOptions.bgColor) graph.drawBackground({ color: view.options.gridOptions.bgColor });
  }
};

export const addNewParentNodes = ({ graph, nodesData, rootStore }) => {
  const Renderer = stencils['rm:ClassNodeStencil'];
  nodesData.forEach((data: any) => {
    const node = createNode(graph, data, Renderer, 'group');
    (graph as Graph).addNode(node);
  });
};

export const addNewChildNodes = ({ graph, nodesData, rootStore }) => {
  const Renderer = stencils['rm:PropertyNodeStencil'];
  nodesData.forEach((data: any) => {
    const node = createNode(graph, data, Renderer, 'field');
    const child = (graph as Graph).addNode(node);
    const parent: Cell = (graph as Graph).getCell(data.parent);
    parent.addChild(child);
  });
};

export const addNewEdges = ({ graph, edgesData }) => {
  edgesData.forEach((data: any) => {
    const edge = {
      id: data['@id'],
      target: data.arrowTo,
      source: data.arrowFrom,
      label: {
        markup: [{ ...Markup.getForeignObjectMarkup() }],
        attrs: {
          fo: {
            label: data.subject.name,
            width: 1,
            height: 1,
            x: 60,
            y: -10,
          },
        },
        position: {
          distance: 0.3,
          args: {
            keepGradient: true,
            ensureLegibility: true,
          },
        },
      },
      router: {
        name: data.router || 'normal',
      },
    };
    (graph as Graph).addEdge(edge);
  });
};

const nodeFromData = ({ data, shape, Renderer, setEditing, onSave }) => ({
  id: data['@id'],
  size: { width: data.width, height: data.height },
  position: { x: data.x, y: data.y },
  shape: shape,
  editing: false,
  component(_) {
    return <Renderer data={cloneDeep(_.store.data)} setEditing={setEditing} nodeData={data} onSave={onSave} />;
  },
});

const createNode = (graph: any, data: any, Renderer: any, shape) => {
  const setEditing = (state: boolean) => {
    const cell = graph.getCell(data['@id']);
    cell.setProp('editing', state);
  };
  const onSave = (t: string) => {
    const cell = graph.getCell(data['@id']);
    cell.setProp('editing', false);
    cell.setProp('label', t);
  };
  return nodeFromData({
    data,
    shape,
    Renderer,
    setEditing,
    onSave,
  });
};