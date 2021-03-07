import React from "react";
import { observer } from "mobx-react-lite";

import "./App.css";

import { collsConstrs, collsConstrs2, rootStore, viewDescr } from "./diagram/get_data";
import { G } from "./diagram/nested";
import { getSnapshot } from "mobx-state-tree";

const App = observer(() => {
	const ss = getSnapshot(rootStore);
	let shapes: any = [];
	let properties: any = [];

	if (rootStore.ns.current.size > 4) {
		let view: any;
		if (rootStore.views.has(viewDescr['@id'])) {
			view = rootStore.views.get(viewDescr['@id']);
			const l = view.viewDescr.collsConstrs.length;
			if (l === 0)
				view.viewDescr.setCollConstrs(collsConstrs);
		} else {
			view = rootStore.createView(viewDescr);
		}
		if (view.colls.size === collsConstrs.length) {
			shapes = view.colls.get('rm:NodeShapes_CollConstr')?.data;
			properties = view.colls.get('rm:PropertyShapes_CollConstr')?.data;
			if (shapes && properties) {
				shapes = (getSnapshot(shapes) as []).slice(8, 10);
				properties = (getSnapshot(properties) as []).slice(8, 18);
			} else {
				shapes = [];
				properties = [];
			}
		}
	}
	
	return (properties.length > 0 && shapes.length > 0) ? (
		<G data={{shapes, properties}} />
	) : (
		<></>
	);
});

export default App;
