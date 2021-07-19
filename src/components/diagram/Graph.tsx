import React, { useContext, useEffect } from 'react';
import { MstContext } from '@agentlab/ldkg-ui-react';

import { createGraph, createGrid, addNewData } from './graphCore';
import { addYogaSolver } from './layout/yoga';
//import { addKiwiSolver } from './layout/kiwi';

import { Minimap } from './visualComponents/Minimap';
import { Stencil } from './visualComponents/Stencil';
import { GraphToolbar } from '../editor/Toolbar/EditorToolbar';
import { ZoomToolbar } from '../editor/Toolbar/ZoomToolbar';
import { GraphCongigPanel } from '../editor/ConfigPanel/ConfigPanel';
import styles from '../../Editor.module.css';
import { ConnectorTool, edgeExamples } from './ConnectorTool';
import { viewDataArchArrows } from '../../stores/ViewArch';

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

  React.useEffect(() => {
    edgeConnectorRef.current = edgeConnector;
  }, [edgeConnector]);

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
            <ConnectorTool edges={edgeExamples} onSelect={onEdgeSelect} />
          </div>
          <div className={styles.panel} ref={refWrap}>
            <GraphToolbar graph={graph} enable={options.toolbar} />
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
              <GraphCongigPanel view={props.view} viewDescrObs={props.viewDescrObs} />
            )}
            {options.minimap === false ? null : <Minimap minimapContainer={minimapContainer} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
