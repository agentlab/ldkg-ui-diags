import React, { useEffect } from 'react';
import { Addon, Node, FunctionExt, Cell, Util, Point, Model, Graph } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
//import { grid } from '@antv/x6/lib/layout/grid';
import { v4 as uuidv4 } from 'uuid';
import { nodeFromData } from '../graphCore';
import { StencilEditor } from '../stencils/StencilEditor';
import { PanelStencilRenderer } from '../stencils/PanelStencilRenderer';
import { addYogaSolver } from './../layout/yoga';
import { Stencil as StencilX6 } from './stencilClass';

import styles from '../../../Editor.module.css';
//import { AnyCnameRecord } from 'node:dns';

interface AnyCnameRecord {
  type: 'CNAME';
  value: string;
}

namespace GridLayout {
  export interface Options extends Node.SetPositionOptions {
    columns?: number;
    columnWidth?: number | 'auto' | 'compact';
    rowHeight?: number | 'auto' | 'compact';
    dx?: number;
    dy?: number;
    marginX?: number;
    marginY?: number;
    /**
     * Positions the elements in the center of a grid cell.
     *
     * Default: true
     */
    center?: boolean;
    /**
     * Resizes the elements to fit a grid cell, preserving the aspect ratio.
     *
     * Default: false
     */
    resizeToFit?: boolean;
  }

  export function getMaxDim(nodes: Node[], name: 'width' | 'height') {
    return nodes.reduce((memo, node) => Math.max(node.getSize()[name], memo), 0);
  }

  export function getNodesInRow(nodes: Node[], rowIndex: number, columnCount: number) {
    const res: Node[] = [];
    for (let i = columnCount * rowIndex, ii = i + columnCount; i < ii; i += 1) {
      res.push(nodes[i]);
    }
    return res;
  }

  export function getNodesInColumn(nodes: Node[], columnIndex: number, columnCount: number) {
    const res: Node[] = [];
    for (let i = columnIndex, ii = nodes.length; i < ii; i += columnCount) {
      res.push(nodes[i]);
    }
    return res;
  }

  export function accumulate(items: number[], start: number) {
    return items.reduce(
      (memo, item, i) => {
        memo.push(memo[i] + item);
        return memo;
      },
      [start || 0],
    );
  }
}

function grid(cells: Node[] | Model, options: GridLayout.Options = {}) {
  const model =
    Model.isModel(cells) || Graph.isGraph(cells)
      ? cells
      : new Model().resetCells(cells, {
          sort: false,
          dryrun: true,
        });

  const graph = model.graph;
  const nodes = model.getNodes().reduce((acc: any, node) => {
    if (!node.hasParent()) {
      acc.push(node);
    }
    return acc;
  }, []);
  const columns = options.columns || 1;
  const rows = Math.ceil(nodes.length / columns);
  const dx = options.dx || 0;
  const dy = options.dy || 0;
  const centre = options.center !== false;
  const resizeToFit = options.resizeToFit === true;
  const marginX = options.marginX || 0;
  const marginY = options.marginY || 0;
  const columnWidths: number[] = [];

  let columnWidth = options.columnWidth;

  if (columnWidth === 'compact') {
    for (let j = 0; j < columns; j += 1) {
      const items = GridLayout.getNodesInColumn(nodes, j, columns);
      columnWidths.push(GridLayout.getMaxDim(items, 'width') + dx);
    }
  } else {
    if (columnWidth == null || columnWidth === 'auto') {
      columnWidth = GridLayout.getMaxDim(nodes, 'width') + dx;
    }

    for (let i = 0; i < columns; i += 1) {
      columnWidths.push(columnWidth);
    }
  }

  const columnLefts = GridLayout.accumulate(columnWidths, marginX);

  const rowHeights: number[] = [];
  let rowHeight = options.rowHeight;
  if (rowHeight === 'compact') {
    for (let i = 0; i < rows; i += 1) {
      const items = GridLayout.getNodesInRow(nodes, i, columns);
      rowHeights.push(GridLayout.getMaxDim(items, 'height') + dy);
    }
  } else {
    if (rowHeight == null || rowHeight === 'auto') {
      rowHeight = GridLayout.getMaxDim(nodes, 'height') + dy;
    }

    for (let i = 0; i < rows; i += 1) {
      rowHeights.push(rowHeight);
    }
  }
  const rowTops = GridLayout.accumulate(rowHeights, marginY);

  model.startBatch('layout');

  nodes.forEach((node, index) => {
    const rowIndex = index % columns;
    const columnIndex = Math.floor(index / columns);
    const columnWidth = columnWidths[rowIndex];
    const rowHeight = rowHeights[columnIndex];

    let cx = 0;
    let cy = 0;
    let size = node.getSize();

    if (resizeToFit) {
      let width = columnWidth - 2 * dx;
      let height = rowHeight - 2 * dy;
      const calcHeight = size.height * (size.width ? width / size.width : 1);
      const calcWidth = size.width * (size.height ? height / size.height : 1);
      if (rowHeight < calcHeight) {
        width = calcWidth;
      } else {
        height = calcHeight;
      }
      size = {
        width,
        height,
      };
      node.setSize(size, options);
      graph.trigger('node:resized', { node });
    }

    if (centre) {
      cx = (columnWidth - size.width) / 2;
      cy = (rowHeight - size.height) / 2;
    }
    node.position(columnLefts[rowIndex] + dx + cx, rowTops[columnIndex] + dy + cy, options);
    graph.trigger('node:moved', { node });
  });

  model.stopBatch('layout');
}

export const Stencil = ({ nodes = [], graph, viewKindStencils }: any) => {
  const refContainer = React.useRef<any>();
  useEffect(() => {
    if (graph) {
      const s = new StencilX6({
        title: 'Stencil',
        target: graph,
        collapsable: true,
        stencilGraphWidth: 300,
        stencilGraphHeight: 380,
        layoutOptions: {
          columns: 1,
        },
        layout(graph, group) {
          const options = {
            columnWidth: 60,
            columns: 5,
            rowHeight: 60,
            resizeToFit: true,
            dx: 10,
            dy: 10,
          };

          grid(graph, {
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
            for (const e in nodeData.elements) {
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
        getPopupNode: (node: any) => {
          const data: any = { ...node.getProp() };
          data.editing = true;
          const nodeData = data.metaData;
          const Renderer = StencilEditor({ options: viewKindStencils[nodeData['@id']] });
          const popupNode = nodeFromData({
            data: { '@id': 'popup', height: 55, width: 150, subject: {}, ...data.position, x: 0, y: 0 },
            Renderer,
            shape: nodeData['@id'],
          });
          const newNode = Node.create(popupNode);
          if (nodeData.elements) {
            for (const e in nodeData.elements) {
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
      const Renderer = StencilEditor({ options: viewKindStencils[e], parent: true });
      const node: any = nodeFromData({
        data: { '@id': e, height: 55, width: 150, subject: {}, x: 0, y: 0, layout: viewKindStencils[e].layout },
        Renderer,
        shape: e,
      });
      Graph.registerNode(
        e,
        {
          inherit: ReactShape,
        },
        true,
      );
      Graph.registerNode(
        'rm:GeneralCompartmentNodeStencil',
        {
          inherit: ReactShape,
        },
        true,
      );
      node.resizeGraph = () => {};
      node.metaData = viewKindStencils[e];
      const newNode = Node.create(node);
      if (viewKindStencils[e].elements) {
        for (const el in viewKindStencils[e].elements) {
          const childNode = nodeFromData({
            data: { '@id': uuidv4(), height: 55, width: 150, x: 0, y: 20, z: 2, subject: {} },
            Renderer,
            shape: 'rm:GeneralCompartmentNodeStencil',
          });
          const newChildNode = Node.create(childNode);
          newNode.addChild(newChildNode);
        }
      }
      acc.push(newNode);
    }
    return acc;
  }, []);
  return <Stencil nodes={nodes} graph={graph} viewKindStencils={viewKindStencils} />;
};
