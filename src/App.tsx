import React, {useState} from "react";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import cloneDeep from 'lodash/cloneDeep';
import { Spin } from "antd";

import EditorToolbar from './components/editor/Toolbar/EditorToolbar'
import styles from './Editor.module.css'

import "./App.css";
import { rootStore } from "./stores/RootStore";
import { Graph } from "./components/diagram/Graph";
import ConfigPanel from "./components/editor/ConfigPanel/ConfigPanel";
import { useGraph } from "./stores/graph";
import { Minimap } from "./components/diagram/visualComponents/minimap";
import { createStencils } from "./components/diagram/Stencil";
import { viewDescrCollConstr } from "./stores/view";


const App = observer(() => {
	let view: any = {};
	let shapesStore: any = {}
	let shapes: any = [];
	let viewDescrObs: any = undefined;
	const { graphStore, isClassDiagram } = useGraph();

	// Should get ViewDescr data first to trigger ViewDescr.afterAttach() call
	const collWithViewDescrsObs = rootStore.getColl(viewDescrCollConstr['@id']);
	if (!collWithViewDescrsObs) return <Spin />;
	viewDescrObs = collWithViewDescrsObs?.dataByIri('rm:DataModelView');
	if (!viewDescrObs) return <Spin />;

	shapesStore = rootStore.getColl('rm:NodeShapes_CollConstr');
	shapes = shapesStore?.data;
	if (shapes) {
		shapes = (getSnapshot(shapes) as []);
	} else {
		shapes = [];
	}
	view = getSnapshot(viewDescrObs);
	const stencils = graphStore.graph ? createStencils(isClassDiagram) : <></>;
	return (
		<div className={styles.wrap}>
			{view.title &&
				<div className={styles.header}>
					<span>{view.title}</span>
				</div>
			}
			<div className={styles.content}>
				<div id="stencil" className={styles.sider} >
					{stencils}
					<Minimap />
				</div>
				<div className={styles.panel}>
					<div className={styles.toolbar}>
						<EditorToolbar />
					</div>
					{(shapes.length > 0)
					?
						( <Graph view={view} data={{shapes}} loadData={() => shapesStore.loadMore()} /> )
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
		</div>
	)
});

export default App;
