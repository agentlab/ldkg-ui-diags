import { getSnapshot } from "mobx-state-tree";
import { Spin } from "antd";
import { Graph } from "./diagram/Graph";
import { useRootStore } from '../stores/RootContext';

export const GraphEditor = ({viewDescrId}: any) => {
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

	return <Graph 
						view={view} 
						viewDescrObs={viewDescrObs}
						data={rootNodesData} 
						сhildNodesData={childNodesData} 
						arrowsData={arrowsData} 
						loadData={() => rootNodes.loadMore()} 
						/>;
};



