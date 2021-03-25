import React, { useRef } from "react";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { observer, useLocalObservable } from "mobx-react-lite";
import moment from "moment";
import cloneDeep from 'lodash/cloneDeep';
import { Spin } from "antd";
import EditorToolbar from './components/editor/Toolbar/EditorToolbar'
import styles from './Editor.module.css'

import "./App.css";

import { rmRepositoryParam } from "./config";
import { rootStore, viewDescrCollConstr, viewDescrs } from "./components/diagram/get_data";
import { Graph } from "./components/diagram/Graph";
import ConfigPanel from "./components/editor/ConfigPanel/ConfigPanel";
import { graphStoreConstr, graphStoreAnnot } from "./stores/graph/GraphStore";
import { layoutStoreConstr, layoutStoreAnnot } from "./stores/graph/LayoutStore";
import { GraphContext } from "./stores/graph";


const App = observer(() => {
	let view: any = {};
	let shapes: any = [];
	let properties: any = [];
	const minimapContainer = useRef<HTMLDivElement>(null);
	let viewDescrObs: any = undefined;

	const graphStore = useLocalObservable(graphStoreConstr, graphStoreAnnot);
	const layoutStore = useLocalObservable(layoutStoreConstr, layoutStoreAnnot);

	if (Object.keys(rootStore.ns.currentJs).length < 5) {
		rootStore.setId(rmRepositoryParam['Repository ID']);
		rootStore.ns.reloadNs();
		return <Spin />;
	} else {
		if (!rootStore.getColl(viewDescrCollConstr['@id'])) {
			const coll0 = rootStore.addColl(viewDescrCollConstr, {updPeriod: undefined, lastSynced: moment.now()}, viewDescrs);
			if (!coll0) {
			  console.warn('coll0 is undefined');
			}
		} else {
			// Should get ViewDescr data first to trigger ViewDescr.afterAttach() call
			const collWithViewDescrsObs = rootStore.getColl(viewDescrCollConstr['@id']);
			viewDescrObs = collWithViewDescrsObs?.dataByIri('rm:DataModelView');
			if (viewDescrObs) {
				view = getSnapshot(viewDescrObs);
				shapes = rootStore.getColl('rm:NodeShapes_CollConstr')?.data;
				properties = rootStore.getColl('rm:PropertyShapes_CollConstr')?.data;
				if (shapes && properties) {
					shapes = (getSnapshot(shapes) as []).slice(8, 10);
					properties = (getSnapshot(properties) as []).slice(8, 18);
				} else {
					shapes = [];
					properties = [];
				}
			}
		}
	}	
	return (
		<div className={styles.wrap}>
			<GraphContext.Provider value={{graphStore, layoutStore}}>
			{view.title &&
				<div className={styles.header}>
					<span>{view.title}</span>
				</div>
			}
			<div className={styles.content}>
				<div id="stencil" className={styles.sider} >
					<span>Panel</span>
					<div className={styles.minimap} ref={minimapContainer} />
				</div>
				<div className={styles.panel}>
					<div className={styles.toolbar}>
						<EditorToolbar />
					</div>
					{(properties.length > 0 && shapes.length > 0)
					?
						( <Graph view={view} data={{shapes, properties}} minimapRef={minimapContainer} /> )
					: 
						( <Spin/> )}
				</div>
				<div className={styles.config}>
					<ConfigPanel view={view} onChange={(val) => {
						if (viewDescrObs) {
							let viewDescr = cloneDeep(view);
							if (!viewDescr.options) viewDescr.options = {};
							viewDescr.options.gridOptions = {
								...viewDescr.options?.gridOptions,
								...val,
							};
							applySnapshot(viewDescrObs, viewDescr);
						}
					}}/>
				</div>
			</div>
			</GraphContext.Provider>
		</div>
	)
});

export default App;
