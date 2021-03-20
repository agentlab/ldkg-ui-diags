
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";
import useGraph from "../../stores/graph";

const no_parent = Symbol('no_parent');

export const NodeBox = observer(({ node, children, parent_id = null, edges = [] }: any) => {
	const {graphStore, layoutStore} = useGraph();
	const [rendered, setRendered] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!graphStore.graph) {
			return;
		}
		if (parent_id === no_parent) { // parent not available
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

		graphStore.addNode(node.id);

		return (() => {
			(graphStore.graph as Graph).removeNode(node.id);
			graphStore.deleteNode(node.id);
		});

	}, [node, parent_id, graphStore.graph]);

	React.useEffect(() => {
		// console.log("RESIZE", toJS(layoutStore.computed_size[node.id]));
		if (layoutStore.computed_size[node.id]) {
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

	}, [layoutStore.computed_size[node.id]]);

	const childrenWithProps = React.Children.map(children, child =>
		React.cloneElement(child, { parent_id: rendered ? node.id : no_parent })
	);

	return (
		<>{childrenWithProps}</>
	);
});
