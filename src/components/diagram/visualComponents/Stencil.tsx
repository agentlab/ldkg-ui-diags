import React, { useEffect } from 'react';
import { Addon, Node, FunctionExt, Cell, Util, Point } from '@antv/x6';
import { grid } from '@antv/x6/lib/layout/grid';
import { v4 as uuidv4 } from 'uuid';
import { nodeFromData } from '../graphCore';
import { StencilEditor } from '../stencils/StencilEditor';
import { PanelStencilRenderer } from '../stencils/PanelStencilRenderer';

import styles from '../../../Editor.module.css';
//import { AnyCnameRecord } from 'node:dns';

interface AnyCnameRecord {
  type: 'CNAME';
  value: string;
}

class myDND extends Addon.Dnd {
  protected drop(draggingNode: Node, pos: Point.PointLike) {
    if (this.isInsideValidArea(pos)) {
      const targetGraph = this.targetGraph;
      const targetModel = targetGraph.model;
      const local = targetGraph.clientToLocal(pos);
      const sourceNode = this.sourceNode!;
      const droppingNode = this.options.getDropNode(draggingNode, {
        sourceNode,
        draggingNode,
        targetGraph: this.targetGraph,
        draggingGraph: this.draggingGraph,
      });
      const bbox = droppingNode.getBBox();
      local.x += bbox.x - bbox.width / 2;
      local.y += bbox.y - bbox.height / 2;
      const gridSize = this.snapOffset ? 1 : targetGraph.getGridSize();

      droppingNode.position(Util.snapToGrid(local.x, gridSize), Util.snapToGrid(local.y, gridSize));
      droppingNode.eachChild((child: any) =>
        child.position(Util.snapToGrid(local.x, gridSize), Util.snapToGrid(local.y, gridSize)),
      );
      droppingNode.removeZIndex();

      const validateNode = this.options.validateNode;
      const ret = validateNode
        ? validateNode(droppingNode, {
            sourceNode,
            draggingNode,
            droppingNode,
            targetGraph,
            draggingGraph: this.draggingGraph,
          })
        : true;

      if (typeof ret === 'boolean') {
        if (ret) {
          targetModel.addCell(droppingNode, { stencil: this.cid });
          return droppingNode;
        }
        return null;
      }

      return FunctionExt.toDeferredBoolean(ret).then((valid) => {
        if (valid) {
          targetModel.addCell(droppingNode, { stencil: this.cid });
        }
        return null;
      });
    }

    return null;
  }
}
class ComplexStencil extends Addon.Stencil {
  public readonly dnd: myDND;
  constructor(options: Partial<any>) {
    super(options);
    this.dnd = new myDND({
      ...this.options,
    });
  }
  protected loadGroup(cells: (Node | Node.Metadata)[], groupName?: string) {
    const model = this.getModel(groupName);
    const group = this.getGroup(groupName);
    const layout = (group && group.layout) || this.options.layout;
    if (model) {
      const nodes = cells.map((cell) =>
        Node.isNode(cell)
          ? cell
          : Node.create({
              ...cell,
              resizeGraph: layout && model ? () => FunctionExt.call(layout, this, model, group) : () => {},
            }),
      );
      model.resetCells(nodes);
    }

    let height = this.options.stencilGraphHeight;
    if (group && group.graphHeight != null) {
      height = group.graphHeight;
    }

    if (layout && model) {
      FunctionExt.call(layout, this, model, group);
    }

    if (!height) {
      const graph = this.getGraph(groupName);
      graph.fitToContent({
        minWidth: graph.options.width,
        gridHeight: 1,
        padding: (group && group.graphPadding) || this.options.stencilGraphPadding || 10,
      });
    }

    return this;
  }
}

export const Stencil = ({ nodes = [], graph, viewKindStencils }: any) => {
  const refContainer = React.useRef<any>();
  useEffect(() => {
    if (graph) {
      const s = new ComplexStencil({
        title: 'Stencil',
        target: graph,
        collapsable: true,
        stencilGraphWidth: 300,
        stencilGraphHeight: 380,
        layoutOptions: {
          columns: 1,
        },
        layout(model, group) {
          const options = {
            columnWidth: 140,
            columns: 1,
            resizeToFit: false,
            dx: 10,
            dy: 10,
          };

          grid(model, {
            ...options,
            ...(group ? group.layoutOptions : {}),
          });
        },
        getDropNode: (draggingNode: any) => {
          const data: any = { ...draggingNode.getProp() };
          data.editing = true;
          const nodeData = data.metaData;
          const Renderer = StencilEditor({ options: viewKindStencils[nodeData['@id']] });
          const node = nodeFromData({
            data: { '@id': uuidv4(), height: 55, width: 150, subject: {}, ...data.position },
            Renderer,
            shape: nodeData['@id'],
          });
          const newNode = Node.create(node);
          if (nodeData.elements) {
            for (let e in nodeData.elements) {
              const childNode = nodeFromData({
                data: { '@id': uuidv4(), height: 55, width: 150, x: 0, y: 20, z: 2, subject: {} },
                Renderer,
                shape: 'rm:GeneralCompartmentNodeStencil',
              });
              const newChildNode = Node.create(childNode);
              newNode.addChild(newChildNode);
            }
          }
          return newNode;
        },
        groups: [
          {
            name: 'group1',
            title: 'Components',
          },
        ],
      });

      if (s) {
        s.load(nodes, 'group1');
      }
      refContainer.current?.appendChild(s.container);
    }
  }, [graph, nodes]);

  return <div ref={refContainer} className={styles.stencil} />;
};

export const createStencils = (graph: any, viewKindStencils: AnyCnameRecord) => {
  const nodes = Object.keys(viewKindStencils).reduce((acc: any, e: string, idx: number) => {
    if (viewKindStencils[e].type === 'DiagramNode') {
      const Renderer = PanelStencilRenderer({ options: viewKindStencils[e], parent: true });
      const node: any = nodeFromData({
        data: { '@id': e, height: 55, width: 150, subject: {}, x: 0, y: 0 },
        Renderer,
        shape: e,
      });
      node.metaData = viewKindStencils[e];
      acc.push(node);
    }
    return acc;
  }, []);
  return <Stencil nodes={nodes} graph={graph} viewKindStencils={viewKindStencils} />;
};
