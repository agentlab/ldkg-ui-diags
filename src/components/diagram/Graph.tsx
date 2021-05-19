import React, { useEffect } from 'react';
import { Button } from 'antd';
import { createGraph, createGrid, addNewData } from './graphCore';
import { addKiwiSolver } from './kiwiCore';
import { Minimap } from './visualComponents/Minimap';
import { createStencils } from './visualComponents/Stencil';
import { GraphToolbar } from '../editor/Toolbar/EditorToolbar';
import { ZoomToolbar } from '../editor/Toolbar/ZoomToolbar';
import { GraphCongigPanel } from '../editor/ConfigPanel/ConfigPanel';
import styles from '../../Editor.module.css';
import { ConnectorTool, edgeExamples } from './ConnectorTool';
import { useRootStore } from '../../stores/RootContext';

export const Graph = (props: any) => {
  const { rootStore } = useRootStore();
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
  const onEdgeSelect = (idx) => setEdgeConnector(edgeExamples[idx]);

  useEffect(() => {
    const { width, height } = getContainerSize();
    const graph = createGraph({
      height,
      width,
      refContainer,
      viewKindStencils: props.viewKindStencils,
      minimapContainer,
      edgeConnectorRef,
      rootStore,
    });
    createGrid({ graph, view: props.view });
    addKiwiSolver({ graph });
    addNewData({ graph, data: props.dataSource, viewKindStencils: props.viewKindStencils, rootStore });
    setGraph(graph);
    const resizeFn = () => {
      const { width, height } = getContainerSize();
      graph.resize(width, height);
    };
    resizeFn();

    window.addEventListener('resize', resizeFn);
    // dispose attached HTML objects
    return () => {
      graph.dispose();
      window.removeEventListener('resize', resizeFn);
    };
  }, []);

  React.useEffect(() => {
    edgeConnectorRef.current = edgeConnector;
  }, [edgeConnector]);

  return (
    <React.Fragment>
      <div className={styles.wrap}>
        {props.view.title && (
          <div className={styles.header}>
            <span>{props.view.title}</span>
          </div>
        )}
        <div className={styles.content}>
          <div id='stencil' className={styles.sider}>
            {createStencils(graph, props.viewKindStencils)}
            <ConnectorTool edges={edgeExamples} onSelect={onEdgeSelect} />
          </div>
          <div className={styles.panel} ref={refWrap}>
            <GraphToolbar graph={graph} />
            <div style={{ position: 'relative' }}>
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
            <GraphCongigPanel view={props.view} viewDescrObs={props.viewDescrObs} />
            <Minimap minimapContainer={minimapContainer} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
