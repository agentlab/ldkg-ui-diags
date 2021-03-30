
import React from "react";
import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";
import { useGraph } from "../../stores/graph";

const parentNotReady = Symbol('parentNotReady');

export const ParentContext = 
	React.createContext<string | null | typeof parentNotReady>(null);

export const NodeBox = observer(({ node, children }: any) => {
	const {graphStore, layoutStore} = useGraph();
	const [rendered, setRendered] = React.useState<boolean>(false);
	const parentId = React.useContext(ParentContext); // try to get nearest parent

	React.useEffect(() => {
		if (parentId === parentNotReady) { // parent not available, just wait
			return;
		}
		else if (parentId === null) { // no parent, render to canvas
			const res = graphStore.graph.addNode(node);
		}
		else {
			const child = (graphStore.graph as Graph).addNode(node);
			const parent: Cell = (graphStore.graph as Graph).getCell(parentId);
			parent.addChild(child);
		}
		setRendered(true);

		graphStore.addNode(node.id);

		return (() => {
			(graphStore.graph as Graph).removeNode(node.id);
			graphStore.deleteNode(node.id);
		});

	}, [node, parentId, graphStore.graph]);

	React.useEffect(() => {
		// console.log("RESIZE", toJS(layoutStore.computedSize[node.id]));
		if (layoutStore.computedSize[node.id]) {
			const n: Node = (graphStore.graph as Graph).getCell(node.id);
			n.resize(
				layoutStore.computedSize[node.id].width,
				layoutStore.computedSize[node.id].height, {
				ignore: true,
			});
			n.setPosition(
				layoutStore.computedSize[node.id].left,
				layoutStore.computedSize[node.id].top, {
				ignore: true,
			});
		}

	}, [layoutStore.computedSize[node.id]]);

	return (
		// provide current node id as parent id for childrens
		<ParentContext.Provider value={rendered ? node.id : parentNotReady}>
			{children}
		</ParentContext.Provider>
	);
});
