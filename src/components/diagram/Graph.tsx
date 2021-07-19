import React, { useContext, useEffect } from 'react';
import { MstContext } from '@agentlab/ldkg-ui-react';

import { createGraph, createGrid, addNewData } from './graphCore';
import { addYogaSolver } from './layout/yoga';
//import { addKiwiSolver } from './layout/kiwi';
import { Markup } from '@antv/x6';
import { Minimap } from './visualComponents/Minimap';
import { Stencil } from './visualComponents/Stencil';
import { GraphToolbar } from '../editor/Toolbar/EditorToolbar';
import { ZoomToolbar } from '../editor/Toolbar/ZoomToolbar';
import { GraphConfigPanel } from '../editor/ConfigPanel/ConfigPanel';
import styles from '../../Editor.module.css';
import { ConnectorTool } from './ConnectorTool';

export const Graph = (props: any) => {
  const { view } = props;
  const options = view.options || {};
  const { store } = useContext(MstContext);
  const [graph, setGraph] = React.useState<any>(null);
  const refContainer = React.useRef<any>();
  const refWrap = React.useRef<any>();
  const getContainerSize = () => {
    return {
      width: refWrap.current.clientWidth,
      height: refWrap.current.clientHeight - 37,
    };
  };
  const minimapContainer = React.useRef<HTMLDivElement>(null);
  const edgeConnectorRef = React.useRef<any>();
  const [edgeConnector, setEdgeConnector] = React.useState<any>();
  const [edges, setEdges] = React.useState([]);
  const onEdgeSelect = (idx) => setEdgeConnector(edges[idx]);

  useEffect(() => {
    const { width, height } = getContainerSize();
    const graph = createGraph({
      height,
      width,
      refContainer,
      viewKindStencils: props.viewKindStencils,
      minimapContainer,
      edgeConnectorRef,
      store,
    });
    createGrid({ graph, view: props.view });
    addYogaSolver({ graph });
    addNewData({ graph, data: props.dataSource, viewKindStencils: props.viewKindStencils, store });
    setGraph(graph);
    const resizeFn = () => {
      const { width, height } = getContainerSize();
      graph.resize(width, height);
    };
    resizeFn();
    graph.selection.widget.collection.on('updated', (e) => {
      const nodeIds = graph.selection.widget.collection.cells.map((c) => c.id);
      props.onSelect(nodeIds);
    });
    graph.enableRubberband();
    window.addEventListener('resize', resizeFn);
    // dispose attached HTML objects
    return () => {
      graph.dispose();
      window.removeEventListener('resize', resizeFn);
    };
  }, []);
  const createEdges = () => {
    const viewKindStencils = props.viewKindStencils;
    const edges = Object.keys(viewKindStencils).reduce((acc: any, e: any) => {
      if (viewKindStencils[e].type === 'DiagramEdge') {
        const edge = {
          label: {
            markup: [{ ...Markup.getForeignObjectMarkup() }],
            attrs: {
              fo: {
                label: viewKindStencils[e].name,
                width: 1,
                height: 1,
                x: 60,
                y: -10,
              },
            },
          },
          attrs: {
            line: {
              ...viewKindStencils[e].line,
            },
            outline: {
              ...viewKindStencils[e].outline,
            },
          },
          ...viewKindStencils[e],
        };
        acc.push(edge);
      }
      return acc;
    }, []);
    return edges;
  };
  React.useEffect(() => {
    edgeConnectorRef.current = edgeConnector;
  }, [edgeConnector]);

  React.useEffect(() => {
    const viewKindStencils = props.viewKindStencils;
    const newEdges = Object.keys(viewKindStencils).reduce((acc: any, e: any) => {
      if (viewKindStencils[e].type === 'DiagramEdge') {
        const edge = {
          label: {
            markup: [{ ...Markup.getForeignObjectMarkup() }],
            attrs: {
              fo: {
                label: viewKindStencils[e].title,
                width: 1,
                height: 1,
                x: 60,
                y: -10,
              },
            },
          },
          attrs: {
            line: {
              ...viewKindStencils[e].line,
            },
            outline: {
              ...viewKindStencils[e].outline,
            },
          },
          ...viewKindStencils[e],
        };
        acc.push(edge);
      }
      return acc;
    }, []);
    setEdges(newEdges);
  }, [props.viewKindStencils]);
  return (
    <React.Fragment>
      <div className={styles.wrap}>
        {props.view.title && options.title !== false && (
          <div className={styles.header}>
            <span>{props.view.title}</span>
          </div>
        )}
        <div className={styles.content}>
          <div id='stencil' className={styles.sider}>
            <Stencil graph={graph} viewKindStencils={props.stencilPanel} />
            <ConnectorTool edges={edges} onSelect={onEdgeSelect} />
          </div>
          <div className={styles.panel} ref={refWrap}>
            {options.toolbar === false ? null : <GraphToolbar graph={graph} />}
            <div style={{ position: 'relative' }}>
              {/*<Button type='primary' shape='round' onClick={props.loadData}>
                Load More
              </Button>*/}
              <ZoomToolbar graph={graph} />
              <div
                id='container'
                style={{ position: 'absolute', top: 0, left: 0 }}
                ref={refContainer}
                className='x6-graph'
              />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            {options.configPanel === false ? null : (
              <GraphConfigPanel view={props.view} viewDescrObs={props.viewDescrObs} />
            )}
            {options.minimap === false ? null : <Minimap minimapContainer={minimapContainer} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
