
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";

import { graphContext, layoutContext } from "./Canvas"

export const NodeBox = observer(({ node, children, parent_id = null, edges = [] }: any) => {
	const graphStore = React.useContext(graphContext);
	const layoutStore = React.useContext(layoutContext);
	const [rendered, setRendered] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!graphStore.graph) {
			return;
		}
		if (parent_id === -1) { // parent not available
			return;
		}
		if (parent_id === null) { // no parent, render to canvas
			const res = graphStore.graph.addNode(node);
		}
		else {
			const child = (graphStore.graph as Graph).addNode(node);
			const parent: Cell = (graphStore.graph as Graph).getCell(parent_id);
			parent.addChild(child);
		}
		setRendered(true);

		if (graphStore.hasEdge(node.id)) {
			const [src_id, label] = graphStore.getEdge(node.id);
			(graphStore.graph as Graph).addEdge({
				source: src_id,
				target: node.id,
				label: label,
			});
			graphStore.deleteEdge(node.id)
		}

		return (() => {
			(graphStore.graph as Graph).removeNode(node.id);
		});

	}, [node, parent_id, graphStore.graph]);

	React.useEffect(() => {
		if (!graphStore.graph) {
			return;
		}
		for (const [label, dest_id] of edges) {
			if ((graphStore.graph as Graph).hasCell(dest_id)) {
				graphStore.addEdge({
					source: node.id,
					target: dest_id,
					label: label,
				});
			}
			else {
				graphStore.addEdge(dest_id, node.id, label);
			}
		}
	}, [edges, node.id, graphStore.graph]);

	React.useEffect(() => {
		if (layoutStore.computed_size[node.id]) {
			console.log("RERUN", layoutStore.computed_size[node.id].width, layoutStore.computed_size[node.id].height);
			const n: Node = (graphStore.graph as Graph).getCell(node.id);
			n.resize(
				layoutStore.computed_size[node.id].width,
				layoutStore.computed_size[node.id].height, {
				ignore: true,
			});
			n.setPosition(
				layoutStore.computed_size[node.id].left,
				layoutStore.computed_size[node.id].top, {
				ignore: true,
			});
		}
		return (() => {

		});
	}, [layoutStore.computed_size[node.id]]);

	const childrenWithProps = React.Children.map(children, child =>
		React.cloneElement(child, { parent_id: rendered ? node.id : -1 })
	);

	return (
		<>{childrenWithProps}</>
	);
});
