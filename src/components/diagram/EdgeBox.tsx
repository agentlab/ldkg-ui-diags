
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph } from "@antv/x6";
import { useGraph } from "../../stores/graph";

import { ParentContext } from './NodeBox'

export const EdgeBox = observer(({ edge }: any) => {
	
	const parent_id = React.useContext<any>(ParentContext);
	if (parent_id === undefined) {
		throw ReferenceError(`Parent is undefined for edge ${edge.id}`);
	}
	const graph_edge = { ...edge, source: parent_id }
	const dest_id = graph_edge.target;

	const {graphStore} = useGraph();

	React.useEffect(() => {
		if (graphStore.nodes.has(dest_id)) {
			(graphStore.graph as Graph).addEdge(graph_edge);
		}
		return (() => {
			(graphStore.graph as Graph).removeEdge(graph_edge.id);
		});
	}, [graph_edge, graphStore.graph, graphStore.nodes]);

	return (<></>);
});
