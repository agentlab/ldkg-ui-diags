import { observer } from "mobx-react-lite";
import { Graph, Node, Cell } from "@antv/x6";
import { useGraph } from "../../../stores/graph";

export const CreateNode = observer(({data, renderer, parentId, shape}: any) => {
const { graphStore } = useGraph();
	const node = {
		id: data["@id"],
		size: { width: data.width, height: data.height },
		position: { x: data.x, y: data.y},
		shape: shape,
		component(_) {
			return renderer;
		},
	}
	console.log('ID', node.id);
	if (parentId === null || parentId === undefined) { // no parent, render to canvas
		(graphStore.graph as Graph).addNode(node);
		console.log('ID-end0', node.id);
	}
	else {
		const child = (graphStore.graph as Graph).addNode(node);
		const parent: Cell = (graphStore.graph as Graph).getCell(parentId);
		parent.addChild(child);
		console.log('ID-end01', node.id);
	}
	console.log('ID-end1', node.id);
	graphStore.addNode(node.id);
	console.log('ID-end2', node.id);
	return <NodeSizeControl nodeId={data["@id"]}/>;
});

export const NodeSizeControl = observer(({nodeId}: any) => {
	const {graphStore, layoutStore} = useGraph();
	const nodeSize = layoutStore.computedSize[nodeId];
	if (nodeSize) {
		const n: Node = (graphStore.graph as Graph).getCell(nodeId);
		n.resize(
			nodeSize.width,
			nodeSize.height, {
			ignore: true,
		});
		n.setPosition(
			nodeSize.left,
			nodeSize.top, {
			ignore: true,
		});
	}
	
	return <></>;
});

export const RootNodeRenderer = ({data, renderer}:any) => {
	const parentId = data.parent;
	return <CreateNode key={data['@id']} data={data} renderer={renderer} parentId={parentId} shape={'group'}/>;
};

export const ChildNodeRenderer = observer(({data, renderer}: any) => {
	const { graphStore } = useGraph();
	const parentId = data.parent;
	if (!graphStore.nodes.has(parentId)){
		return null;
	}
	
	return <CreateNode  data={data} renderer={renderer} parentId={parentId} shape={"field"}/>;
});
