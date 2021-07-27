import cloneDeep from 'lodash-es/cloneDeep';
import { Graph, Model } from '@antv/x6';
import { Clipboard } from '@antv/x6/lib/addon/clipboard';

export class FixedClipboard extends Clipboard {
  paste(graph: Graph | Model, options: Clipboard.PasteOptions = {}) {
    const localOptions = { ...options, ...this.options };
    const { offset, edgeProps, nodeProps } = localOptions;

    let dx = 20;
    let dy = 20;
    if (offset) {
      dx = typeof offset === 'number' ? offset : offset.dx;
      dy = typeof offset === 'number' ? offset : offset.dy;
    }

    this.deserialize(localOptions);
    const cells = this.cells;

    cells.forEach((cell) => {
      cell.model = null;
      cell.removeProp('zIndex');
      if (dx || dy) {
        cell.translate(dx, dy);
      }

      if (nodeProps && cell.isNode()) {
        cell.prop(nodeProps);
      }

      if (edgeProps && cell.isEdge()) {
        cell.prop(edgeProps);
      }
    });
    const model = Graph.isGraph(graph) ? graph.model : graph;
    const newCells = cloneDeep(cells);
    const deleteChildren = (parent) => {
      parent.eachChild((child) => {
        deleteChildren(child);
        const idx = newCells.indexOf(child);
        if (idx !== -1) {
          newCells.splice(idx, 1);
        }
      });
    };
    cells.forEach((cell) => {
      deleteChildren(cell);
    });
    console.log('newCELLs', newCells);
    model.batchUpdate('paste', () => {
      model.addCells(newCells);
    });

    this.copy(cells, graph, options);

    return cells;
  }
}
