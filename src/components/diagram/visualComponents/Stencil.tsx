import React, { useEffect } from 'react';
import { Graph } from '@antv/x6';
import { v4 as uuidv4 } from 'uuid';
import { createNode, ExtNode } from '../graphCore';
import { Stencil as StencilX6 } from './stencilClass';
import { grid } from './grid';

import styles from '../../../Editor.module.css';

export interface StencilProps {
  graph: Graph;
  viewKindStencils: any;
}
export const Stencil = ({ graph, viewKindStencils }: StencilProps): JSX.Element => {
  const refContainer = React.useRef<any>();
  useEffect(() => {
    if (graph) {
      const s = new StencilX6({
        title: 'Stencil',
        target: graph,
        //collapsable: true,
        stencilGraphWidth: 300,
        stencilGraphHeight: 280,
        layoutOptions: {
          columns: 1,
        },
        layout(model, group, stencilGraph) {
          const options = {
            columnWidth: 70,
            columns: 2,
            rowHeight: 70,
            resizeToFit: true,
            dx: 10,
            dy: 10,
          };

          grid(
            model,
            {
              ...options,
              ...(group ? group.layoutOptions : {}),
            },
            stencilGraph as Graph,
          );
        },
        getDropNode: (draggingNode: any) => {
          const data: any = { ...draggingNode.getProp() };
          data.editing = true;
          const nodeData = data.metaData;
          const newNode = createNode({
            stencil: viewKindStencils[nodeData['@id']],
            data: { '@id': uuidv4(), height: 55, width: 150, subject: {}, ...data.position },
            shape: nodeData['@id'],
            sample: true,
          });
          return newNode;
        },
        getPopupNode: (node: any) => {
          const data: any = { ...node.getProp() };
          data.editing = true;
          const nodeData = data.metaData;
          const newNode = createNode({
            stencil: viewKindStencils[nodeData['@id']],
            data: { '@id': data.id, height: 55, width: 150, subject: {}, ...data.position, x: 0, y: 0 },
            shape: nodeData['@id'],
            sample: true,
          });
          return newNode;
        },
        groups: [
          {
            name: 'group1',
            title: 'Стенсилы',
          },
        ],
      });

      if (s) {
        const nodes = Object.keys(viewKindStencils).reduce((acc: any, e: string, idx: number) => {
          if (viewKindStencils[e].type === 'DiagramNode') {
            const node = createNode({
              stencil: viewKindStencils[e],
              data: {
                '@id': e,
                height: 55,
                width: 150,
                subject: {},
                x: 0,
                y: 0,
                layout: viewKindStencils[e].layout,
              },
              shape: e,
              sample: true,
            });
            (node as ExtNode).getStore().get().metaData = viewKindStencils[e];
            acc.push(node);
          }
          return acc;
        }, []);
        s.load(nodes, 'group1');
      }
      refContainer.current?.appendChild(s.container);
    }
  }, [graph, viewKindStencils]);

  return <div ref={refContainer} className={styles.stencil} />;
};
