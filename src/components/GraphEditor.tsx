import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import cloneDeep from 'lodash/cloneDeep';
import { Spin } from "antd";
import EditorToolbar from './editor/Toolbar/EditorToolbar'
import styles from '../Editor.module.css'

import { Graph } from "./diagram/Graph";
import ConfigPanel from "./editor/ConfigPanel/ConfigPanel";
import { useGraph } from "../stores/graph";
import { Minimap } from "./diagram/visualComponents/minimap";
import { createStencils } from "./diagram/Stencil";
import { useRootStore } from '../stores/RootContext';
import { GraphContextProvider } from "../stores/graph";


export const GraphEditor = observer(({viewDescrId}: any) => {
  const { rootStore } = useRootStore();

  const collWithViewDescrsObs = rootStore.getColl(viewDescrId);
	if (!collWithViewDescrsObs) return <Spin />;

	const viewDescrObs = collWithViewDescrsObs?.dataByIri('rm:DataModelView');
	if (!viewDescrObs) return <Spin />;

	const rootNodes = rootStore.getColl('rm:RootNodes_CollConstr');
	const childNodes = rootStore.getColl('rm:ChildNodes_CollConstr');
	const arrows = rootStore.getColl('rm:Arrows_CollConstr');
	const shapesData: any = rootNodes?.data ? getSnapshot(rootNodes?.data) : [];
	const childNodesData: any = childNodes?.data ? getSnapshot(childNodes?.data) : [];
	const arrowsData: any = arrows?.data ? getSnapshot(arrows?.data) : [];

	const view: any = getSnapshot(viewDescrObs);

	return (
		<GraphContextProvider>
			<div className={styles.wrap}>
				{view.title &&
					<div className={styles.header}>
						<span>{view.title}</span>
					</div>
				}
				<div className={styles.content}>
					<Stencils />
					<div className={styles.panel}>
						<GraphToolbar />
					  <Graph view={view} data={shapesData} loadData={() => rootNodes.loadMore()} /> )
					</div>
					<GraphCongigPanel view={view} viewDescrObs={viewDescrObs}/>
				</div>
			</div>
		</GraphContextProvider>
	)
})

const Stencils = () => {
	const { graphStore, isClassDiagram } = useGraph();
	const stencils = graphStore.graph ? createStencils(isClassDiagram) : <></>;  
	return (
		<div id="stencil" className={styles.sider} >
				{stencils}
				<Minimap />
			</div>
	)
} 

const GraphToolbar = () => {
	return (
<		div className={styles.toolbar}>
			<EditorToolbar />
		</div>
	)
}

const GraphCongigPanel = ({view, viewDescrObs}: any) => {
	const onChange = (val) => {
		if (viewDescrObs) {
			let viewDescr = cloneDeep(view);
			if (!viewDescr.options) viewDescr.options = {};
			viewDescr.options.gridOptions = {
				...viewDescr.options?.gridOptions,
				...val,
			};
			applySnapshot(viewDescrObs, viewDescr);
		}
	}
	return (
		<div className={styles.config}>
		<ConfigPanel view={view} onChange={onChange}/>
	</div>
	)
}