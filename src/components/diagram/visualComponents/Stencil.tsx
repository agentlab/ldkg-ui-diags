import React, { useEffect } from 'react';
import { Node, Graph } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
//import { grid } from '@antv/x6/lib/layout/grid';
import { v4 as uuidv4 } from 'uuid';
import { nodeFromData } from '../graphCore';
import { StencilEditor } from '../stencils/StencilEditor';
import { Stencil as StencilX6 } from './stencilClass';
import { grid } from './grid';

import styles from '../../../Editor.module.css';
//import { AnyCnameRecord } from 'node:dns';

interface AnyCnameRecord {
  type: 'CNAME';
  value: string;
}

export const Stencil: React.FC<any> = ({ nodes = [], graph, viewKindStencils }: any) => {
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
        layout(model, group, stencilGraph) {
          const options = {
            columnWidth: 60,
            columns: 5,
            rowHeight: 60,
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

export const createStencils: React.FC<any> = (graph: any, viewKindStencils: AnyCnameRecord) => {
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
      node.resizeGraph = () => null;
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
