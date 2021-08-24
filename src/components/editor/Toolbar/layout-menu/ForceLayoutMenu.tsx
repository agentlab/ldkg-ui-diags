import React from 'react';
import { ForceLayout } from '@antv/layout';

export const ForceOptionsMenu = ({ execute, cells, onClick, onEndOperation, graph }) => {
  const forceLayout = () => {
    const layout = new ForceLayout({
      type: 'force',
      center: [369, 180],
      preventOverlap: true,
      nodeStrength: (d) => {
        if (d.isLeaf) {
          return -800;
        }
        return -400;
      },
      edgeStrength: (d) => {
        if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
          return 0.7;
        }
        return 0.1;
      },
      tick: () => {
        cells.forEach((node) => {
          (node as any).setPosition(node.x, node.y, {
            ignore: true,
          });
          graph.trigger('node:moved', { node });
        });
      },
    });
    const newData = layout.layout({ nodes: cells });
    return newData;
  };
  const onOk = () => {
    const newData = forceLayout();
  };

  return (
    <li
      onClick={() => {
        onOk();
        onClick();
        onEndOperation();
      }}>
      Гравитация
    </li>
  );
};
