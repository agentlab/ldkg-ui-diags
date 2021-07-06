import React from 'react';
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash-es/cloneDeep';
import { Graph, Cell, Markup, Node, Interp, Model, Registry } from '@antv/x6';
import { ShareRegistry } from '@antv/x6/lib/model/registry';
import { Options as GraphOptions } from '@antv/x6/lib/graph/options';
import { ReactShape } from '@antv/x6-react-shape';
import { EdgeView, NodeView } from '@antv/x6';

import { stencils } from './stencils/index';
import { StencilEditor } from './stencils/StencilEditor';
import { EditableCellTool } from './stencils/NodeField';
import { validateEmbedding, validateConnection } from './interactionValidation';

export class ExtNode extends ReactShape {
  translate(tx = 0, ty = 0, options: Node.TranslateOptions = {}) {
    const selectedNodes = this.model?.graph?.getSelectedCells();

    if (this.checkTranslationOwner(options.translateBy) && options.parentCall !== (this.getParent() as Node).id) {
      return this;
    }
    if (tx === 0 && ty === 0) {
      return this;
    }
    if (this.store.get().movable === false && !options.parentCall) {
      if (this._parent) {
        this._parent.translate(tx, ty, options);
      }
      return this;
    }

    options.translateBy = options.translateBy || this.id;

    const position = this.getPosition();

    if (options.restrict != null && options.translateBy === this.id) {
      const bbox = this.getBBox({ deep: true });
      const ra = options.restrict;
      const dx = position.x - bbox.x;
      const dy = position.y - bbox.y;
      const x = Math.max(ra.x + dx, Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx));
      const y = Math.max(ra.y + dy, Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty));

      tx = x - position.x;
      ty = y - position.y;
    }

    const translatedPosition = {
      x: position.x + tx,
      y: position.y + ty,
    };

    options.tx = tx;
    options.ty = ty;

    if (options.transition) {
      if (typeof options.transition !== 'object') {
        options.transition = {};
      }

      this.transition('position', translatedPosition, {
        ...options.transition,
        interp: Interp.object,
      });
      const newOptions = { ...options, parentCall: true };
      this.eachChild((child) => {
        if (selectedNodes?.indexOf(child) === -1) {
          child.translate(tx, ty, newOptions);
        }
      });
    } else {
      this.startBatch('translate', options);
      this.store.set('position', translatedPosition, options);
      options.handledTranslation = options.handledTranslation || [];
      if (!options.handledTranslation.includes(this)) {
        options.handledTranslation.push(this);
        const children = this.children;
        if (children?.length) {
          options.handledTranslation.push(...children);
        }
      }
      const newOptions = { ...options, parentCall: this.id };
      this.eachChild((child) => {
        child.translate(tx, ty, newOptions);
      });
      this.stopBatch('translate', options);
    }

    return this;
  }
  getStore() {
    return this.store;
  }
  checkTranslationOwner(ownerId) {
    let child = this as Node;
    while (child.getParent()) {
      if ((child.getParent() as Node).id === ownerId) {
        return true;
      }
      child = child.getParent() as Node;
    }
    return false;
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
      const Renderer = stencils['defaultLabel'];
      const content = selectors.foContent as HTMLDivElement;
      if (content) {
        ReactDOM.render(
          <Renderer
            parent={selectors.fo}
            label={label?.attrs?.fo.label}
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
        if (node.getParent() && !(node as ExtNode).getStore().get().movable) {
          graph && graph.select((node.getParent() as Node).id);
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
    case 'rm:UsedInDiagramAsRootNode': {
      const node = createNode({ stencil: viewKindStencils[stencilId], data, shape: data.stencil, sample: false });
      (graph as Graph).addNode(node);
      break;
    }
    case 'rm:UsedInDiagramAsChildNode':
      if (graph.hasCell(data.parent)) {
        const node = createNode({ stencil: viewKindStencils[stencilId], data, shape: data.stencil, sample: false });
        const child = (graph as Graph).addNode(node);
        const parent: Cell = (graph as Graph).getCell(data.parent);
        parent.addChild(child);
      } else {
        return false;
      }
      break;
    case 'rm:UsedInDiagramAsArrow':
      if (graph.hasCell(data.arrowFrom) && graph.hasCell(data.arrowTo)) {
        const edge = {
          ...edgeFromData({ data }),
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
    const Renderer = stencils[data.stencil || 'rm:RectWithText'];
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
    const edge = { ...edgeFromData({ data }), ...stencils[data.stencil || 'rm:DefaultEdgeStencil'] };
    (graph as Graph).addEdge(edge);
  });
};

export const nodeFromData = ({ data, shape, Renderer }) => ({
  id: data['@id'],
  size: { width: data.width, height: data.height },
  position: { x: data.x, y: data.y },
  layoutProp: data.layout || {},
  style: data.style,
  shape: shape,
  attrs: data.attrs,
  zIndex: data.zIndex,
  movable: data.movable !== undefined ? data.movable : true,
  editing: false,
  component(n) {
    const setEditing = (state: boolean) => {
      n.setProp('editing', state);
    };
    const onSave = (t: string) => {
      n.setProp('editing', false);
      n.setProp('label', t);
    };
    return <Renderer node={n} data={cloneDeep(n.store.data)} setEditing={setEditing} nodeData={data} onSave={onSave} />;
  },
});

const edgeFromData = ({ data }) => ({
  id: data['@id'],
  target: data.arrowTo,
  source: data.arrowFrom,
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
      const childNode = createNode({ stencil: el, data: newData, shape, sample });
      newNode.addChild(childNode);
    }
  });
  return newNode;
};
