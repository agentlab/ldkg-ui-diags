import React from "react";
import { getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Spin } from "antd";

import "./App.css";

import { rmRepositoryParam } from "./config";
import { rootStore, viewDescrCollConstr, viewDescrs } from "./diagram/get_data";
import { Graph } from "./diagram/graph";

const App = observer(() => {
	let shapes: any = [];
	let properties: any = [];
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
			const viewDescrObs: any = collWithViewDescrsObs?.dataByIri('rm:DataModelView');
			if (viewDescrObs) {
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
	return (properties.length > 0 && shapes.length > 0)
		?
			( <Graph data={{shapes, properties}} /> )
		: 
			( <Spin/> );
});

export default App;
