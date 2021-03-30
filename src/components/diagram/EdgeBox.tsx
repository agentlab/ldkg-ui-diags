
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph } from "@antv/x6";
import { useGraph } from "../../stores/graph";

import { ParentContext } from './NodeBox'

export const EdgeBox = observer(({ edge }: any) => {
	
	const parentId = React.useContext<any>(ParentContext);
	if (parentId === undefined) {
		throw ReferenceError(`Parent is undefined for edge ${edge.id}`);
	}
	const graphEdge = { ...edge, source: parentId }
	const destId = graphEdge.target;

	const {graphStore} = useGraph();

	React.useEffect(() => {
		if (graphStore.nodes.has(destId)) {
			(graphStore.graph as Graph).addEdge(graphEdge);
		}
		return (() => {
			(graphStore.graph as Graph).removeEdge(graphEdge.id);
		});
	}, [graphEdge, graphStore.graph, graphStore.nodes]);

	return (<></>);
});
