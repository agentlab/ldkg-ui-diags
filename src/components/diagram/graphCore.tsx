import cloneDeep from 'lodash-es/cloneDeep';
import React from 'react';
import ReactDOM from 'react-dom';

import { Graph, Cell, EdgeView, NodeView, Markup, Node } from '@antv/x6';
import { Options as GraphOptions } from '@antv/x6/lib/graph/options';

import { FixedClipboard } from './Clipboard';
import { ExtNode } from './Node';
import { stencils } from './stencils/index';
import { StencilEditor } from './stencils/StencilEditor';
import { EditableCellTool } from './stencils/RectWithTextNode';
import { validateEmbedding, validateConnection } from './interactionValidation';
import { FixedHistory } from './History';

export class ExtGraph extends Graph {
  public readonly history: FixedHistory;
  constructor(options: Partial<GraphOptions.Manual>) {
    super(options);
    this.history = new FixedHistory({ graph: this, ...this.options.history });
  }
}

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

export const createGraph = ({
  width,
  height,
  refContainer,
  viewKindStencils,
  minimapContainer,
  edgeConnectorRef,
  store,
}) => {
  try {
    Object.keys(viewKindStencils).forEach((e) => {
      Graph.registerNode(
        e,
        {
          inherit: ExtNode,
        },
        true,
      );
    });

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
  const g = new ExtGraph({
    container: refContainer.current,
    width: width,
    height: height,
    grid: {
      visible: true,
    },
    resizing: {
      enabled: true,
    },
    history: {
      executeCommand: () => {
        console.log('command');
      },
    },
    clipboard: {
      enabled: true,
    },
    panning: {
      enabled: true,
      modifiers: 'ctrl',
      eventTypes: ['leftMouseDown'],
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
          return undefined;
        },
      },
    },
    onEdgeLabelRendered: (args) => {
      const { selectors, label } = args;
      const edge: any = args.edge;
      const Renderer = stencils['aldkg:DefaultLabel'];
      const content = selectors.foContent as HTMLDivElement;
      if (content) {
        ReactDOM.render(
          <Renderer
            parent={selectors.fo}
            label={label?.attrs?.fo.label}
            editable={edge.store.data.editable}
            style={edge.store.data.style}
            onSave={() => {
              /*do nothing*/
            }}
          />,
          content,
        );
      }
    },
    scroller: {
      enabled: true,
      pageVisible: true,
      pageBreak: false,
      //pannable: true,
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
      validate: validateEmbedding,
    },
    selecting: {
      enabled: true,
      filter: (node) => {
        const graph = node.model?.graph;
        if (graph && node.getParent() && !(node as ExtNode).getStore().get().movable) {
          const parent = node.getParent();
          if (graph.isSelected(parent?.id || '')) {
            graph.unselect((node.getParent() as Node).id);
          } else {
            graph.select((node.getParent() as Node).id);
          }
          return false;
        }
        return true;
      },
    },
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
      validateConnection: validateConnection,
    },
    keyboard: {
      enabled: true,
    },
    interacting: {
      edgeMovable: true,
      arrowheadMovable: true,
    },
  });
  const clipboard = g.clipboard;
  clipboard.widget = new FixedClipboard();
  clipboard.widget.deserialize(clipboard.instanceOptions);
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

export const addNewData = ({ graph, data, viewKindStencils, store }) => {
  const stash = {};
  for (const key in data) {
    data[key].forEach((e: any) => {
      if (!addGraphData(graph, e, key, viewKindStencils, store)) {
        if (stash[key]) {
          stash[key].push(e);
        } else {
          stash[key] = [e];
        }
      }
    });
  }
  for (const key in stash) {
    stash[key].forEach((e: any) => {
      addGraphData(graph, e, key, viewKindStencils, store);
    });
  }
};

const addGraphData = (graph, data, key, viewKindStencils, store) => {
  const stencilId = data.stencil || key;
  const Renderer = StencilEditor({ options: viewKindStencils[stencilId] });
  switch (data['@type']) {
    case 'aldkg:UsedInDiagramAsRootNode': {
      const node = createNode({ stencil: viewKindStencils[stencilId], data, shape: data.stencil, sample: false });
      (graph as Graph).addNode(node);
      break;
    }
    case 'aldkg:UsedInDiagramAsChildNode':
      if (graph.hasCell(data.parent)) {
        const node = createNode({ stencil: viewKindStencils[stencilId], data, shape: data.stencil, sample: false });
        const child = (graph as Graph).addNode(node);
        const parent: Cell = (graph as Graph).getCell(data.parent);
        parent.addChild(child);
      } else {
        return false;
      }
      break;
    case 'aldkg:UsedInDiagramAsArrow':
      if (graph.hasCell(data.arrowFrom) && graph.hasCell(data.arrowTo)) {
        const edge = {
          ...viewKindStencils[stencilId],
          ...{
            attrs: {
              line: {
                ...viewKindStencils[stencilId].line,
              },
              outline: {
                ...viewKindStencils[stencilId].outline,
              },
            },
          },
          ...edgeFromData({ data }),
        };
        if (viewKindStencils[stencilId].shape) edge.shape = viewKindStencils[stencilId].shape;
        (graph as Graph).addEdge(edge);
      } else {
        return false;
      }
      break;
  }
  return true;
};

/**
 * function @deprecated
 */
export const addNewParentNodes = ({ graph, nodesData, store }) => {
  nodesData.forEach((data: any) => {
    const Renderer = stencils[data.stencil || 'aldkg:RectWithTextNode'];
    const node = nodeFromData({ data, Renderer, shape: data.stencil });
    (graph as Graph).addNode(node);
  });
};

/**
 * function @deprecated
 */
export const addNewChildNodes = ({ graph, nodesData, store }) => {
  nodesData.forEach((data: any) => {
    const Renderer = stencils[data.stencil];
    const node = nodeFromData({ data, Renderer, shape: data.stencil });
    const child = (graph as Graph).addNode(node);
    const parent: Cell = (graph as Graph).getCell(data.parent);
    parent.addChild(child);
  });
};

/**
 * function @deprecated
 */
export const addNewEdges = ({ graph, edgesData }) => {
  edgesData.forEach((data: any) => {
    const edge = { ...edgeFromData({ data }), ...stencils[data.stencil || 'aldkg:DefaultEdgeStencil'] };
    (graph as Graph).addEdge(edge);
  });
};

export const nodeFromData = ({ data, shape, Renderer, onSave = () => null, setEditing = () => null }) => ({
  id: data['@id'],
  size: { width: data.width, height: data.height },
  position: { x: data.x, y: data.y },
  layoutProp: data.layout || {},
  style: data.style,
  shape: shape,
  subject: data.subject,
  attrs: data.attrs,
  label: data.label || data?.subject?.title || `${data?.subject?.name}: ${data?.subject?.datatype}`,
  zIndex: data.zIndex,
  movable: data.movable !== undefined ? data.movable : true,
  editing: false,
  component(n) {
    const setEditing = (state: boolean) => {
      n._model.graph.history.disable();
      n.setProp('editing', state);
      n._model.graph.history.enable();
    };
    const onSave = (t: string) => {
      setEditing(false);
      n.setProp('label', t);
    };
    return <Renderer node={n} data={cloneDeep(n.store.data)} setEditing={setEditing} nodeData={data} onSave={onSave} />;
  },
});

const edgeFromData = ({ data }) => ({
  id: data['@id'],
  target: data.arrowTo,
  source: data.arrowFrom,
  editable: data.editable,
  label: data.subject.name
    ? {
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
      }
    : {},
  router: {
    name: data.router || 'normal',
  },
});

export const createNode = ({ stencil, data, shape, sample }): Node => {
  const Renderer = StencilEditor({ options: stencil });
  const nodeData = nodeFromData({ data, shape, Renderer });
  nodeData.layoutProp = { ...stencil.layout, ...nodeData.layoutProp };
  const newNode = Node.create(nodeData);
  (stencil.elements || []).forEach((el, idx) => {
    if (el.constant || sample) {
      const newData = { ...data };
      delete newData['@id'];
      newData.height = el.height || data.height;
      newData.movable = false;
      const childNode = createNode({ stencil: el, data: newData, shape: el['@id'], sample });
      newNode.addChild(childNode);
    }
  });
  return newNode;
};
