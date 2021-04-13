import { getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import { Spin } from "antd";
import { GraphToolbar } from './editor/Toolbar/EditorToolbar'
import styles from '../Editor.module.css'

import { Graph } from "./diagram/Graph";
import { GraphCongigPanel } from "./editor/ConfigPanel/ConfigPanel";
import { Stencils } from "./diagram/Stencil";
import { useRootStore } from '../stores/RootContext';
import { GraphContextProvider } from "../stores/graph";


export const GraphEditor = observer(({viewDescrId}: any) => {
  const { rootStore } = useRootStore();

  const collWithViewDescrsObs = rootStore.getColl(viewDescrId);
	if (!collWithViewDescrsObs) return <Spin />;

	const viewDescrObs = collWithViewDescrsObs?.dataByIri('rm:DataModelView');
	if (!viewDescrObs) return <Spin />;

	//const rootNodes = rootStore.getColl('rm:NodeShapes_CollConstr');
	//const rootNodesData: any = rootNodes?.data ? getSnapshot(rootNodes?.data) : [];
	const rootNodes = rootStore.getColl('rm:RootNodes_CollConstr');
	const rootNodesData: any = rootNodes?.data ? getSnapshot(rootNodes?.data) : [];
	const childNodes = rootStore.getColl('rm:ChildNodes_CollConstr');
	const childNodesData: any = childNodes?.data ? getSnapshot(childNodes?.data) : [];
	const arrows = rootStore.getColl('rm:Arrows_CollConstr');
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
					  <Graph view={view} data={rootNodesData} сhildNodesData={childNodesData} arrowsData={arrowsData} loadData={() => rootNodes.loadMore()} /> )
					</div>
					<GraphCongigPanel view={view} viewDescrObs={viewDescrObs}/>
				</div>
			</div>
		</GraphContextProvider>
	)
})



