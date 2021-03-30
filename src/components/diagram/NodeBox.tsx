
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";
import { useGraph } from "../../stores/graph";

const parentNotReady = Symbol('no_parent');

export const ParentContext = 
	React.createContext<string | null | typeof parentNotReady>(null);

export const NodeBox = observer(({ node, children, edges = [] }: any) => {
	const {graphStore, layoutStore} = useGraph();
	const [rendered, setRendered] = React.useState<boolean>(false);
	const parent_id = React.useContext(ParentContext); // try to get nearest parent

	React.useEffect(() => {
		if (parent_id === parentNotReady) { // parent not available, just wait
			return;
		}
		else if (parent_id === null) { // no parent, render to canvas
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

	return (
		// provide current node id as parent id for childrens
		<ParentContext.Provider value={rendered ? node.id : parentNotReady}>
			{children}
		</ParentContext.Provider>
	);
});
