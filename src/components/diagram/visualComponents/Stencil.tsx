import React, { useEffect } from 'react';
import { Addon } from '@antv/x6';
import { NodeShape } from '../stencils/NodeShape';
import { NodeField } from '../stencils/NodeField';

import styles from '../../../Editor.module.css';

export const Stencil = ({ nodes = [], graph }: any) => {
  const refContainer = React.useRef<any>();
  useEffect(() => {
    if (graph) {
      const s = new Addon.Stencil({
        title: 'Stencil',
        target: graph,
        collapsable: true,
        stencilGraphWidth: 290,
        stencilGraphHeight: 180,
        layoutOptions: {
          columns: 1,
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

export const createStencils = (isClassDiagram: boolean, graph: any) => {
  const nodeShape = {
    id: 'Node Shape',
    size: { width: 140, height: 40 },
    zIndex: 0,
    shape: 'group',
    component(_) {
      return <NodeShape text={'Node Shape'} />;
    },
  };
  const nodeField = {
    id: 'Node Field',
    size: { width: 140, height: 40 },
    zIndex: 2,
    shape: 'field',
    component(_) {
      return <NodeField text={'Node Field'} />;
    },
  };
  const nodeCircle = {
    id: 'Node Circle',
    size: { width: 80, height: 80 },
    zIndex: 0,
    shape: 'circle',
    label: 'Node Circle',
    attrs: {
      body: {
        fill: '#efdbff',
        stroke: '#9254de',
      },
    },
  };
  return isClassDiagram ? (
    <Stencil nodes={[nodeField, nodeShape]} graph={graph} />
  ) : (
    <Stencil nodes={[nodeCircle]} graph={graph} />
  );
};
