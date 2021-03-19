
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";
import useGraph from "../stores/graph";


export const EdgeBox = observer(({ edge, parent_id }: any) => {
	if (parent_id === undefined) {
		throw ReferenceError(`Parent is undefined for edge ${edge.id}`);
	}
	const graph_edge = { ...edge, source: parent_id }
	const dest_id = graph_edge.target;

	const {graphStore} = useGraph();

	const [rendered, set_rendered] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!graphStore.graph) {
			return;
		}
		if (!rendered) {
			if ((graphStore.graph as Graph).hasCell(dest_id)) {
				(graphStore.graph as Graph).addEdge(graph_edge);
				set_rendered(true);
			}
		}

		return (() => {
			(graphStore.graph as Graph).removeEdge(graph_edge.id);
		});

	}, [edge, graphStore.graph]);

	React.useEffect(() => {
		if (!graphStore.graph || rendered) {
			return;
		}
		if (graphStore.nodes.has(dest_id)) {
			(graphStore.graph as Graph).addEdge(graph_edge);
			set_rendered(true);
		}
	}, [graphStore.nodes]);

	return (<></>);
});
