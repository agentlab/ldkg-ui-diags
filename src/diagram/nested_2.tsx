import React from "react";
import { Graph, Node, Cell } from "@antv/x6";

import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";

import { useLocalObservable, observer } from "mobx-react-lite";
import * as kiwi from "kiwi.js";
import { v4 as uuidv4 } from 'uuid';

const graphWidth = 800;
const graphHeight = 600;

const randPos = () => {
	return {
		x: Math.random() * (graphWidth - 100),
		y: Math.random() * (graphHeight - 100),
	};
};

export const layoutContext = React.createContext<any>(null);
export const LayoutProvider = ({ children }) => {
	const store = useLocalObservable(() => ({
		solver: new kiwi.Solver(),
		size: {}
	}));
	return <layoutContext.Provider value={store}>{children}</layoutContext.Provider>;
};

export const graphContext = React.createContext<any>(null);

export const Canvas = ({ children }) => {
	const refContainer = React.useRef<any>();

	const graphStore = useLocalObservable(() => ({
		graph: undefined as any,
		deferredEdges: {} as any,
		setGraph(graph: any) {
			graphStore.graph = graph;
		},
		getGraph() {
			return graphStore.graph;
		},

		deleteEdge(id: string) {
			const { [id]: _, ...newEdges } = graphStore.deferredEdges;
			graphStore.deferredEdges = newEdges;
		},
		hasEdge(id: string) {
			return (id in graphStore.deferredEdges);
		},
		getEdge(id: string) {
			return graphStore.deferredEdges[id];
		},
		addEdge(dest_id: string, src_id: string, label: string) {
			graphStore.deferredEdges[dest_id] = [src_id, label];
		}
	}));

	React.useEffect(() => {
		try {
			Graph.registerNode("group", {
				inherit: ReactShape,
			});
			Graph.registerNode("compartment", {
				inherit: ReactShape,
			});
			Graph.registerNode("field", {
				inherit: ReactShape,
			});
		}
		catch (e) { // typically happens during recompilation
			console.log(e);
		}

		const g = new Graph({
			container: refContainer.current,
			width: graphWidth,
			height: graphHeight,
			grid: {
				size: 10,
				visible: true,
				type: 'dot',
				args: {
					color: '#a0a0a0',
					thickness: 2,
				},
			},
			background: {
				color: '#ededed',
			},
			resizing: {
				enabled: true,
			},
			embedding: {
				enabled: true,
				findParent: "center",
			},
			selecting: true,
			connecting: {
				dangling: false,
				router: "manhattan",
				connector: {
					name: "jumpover",
					args: {
						type: "gap",
					},
				},
			},
			keyboard: {
				enabled: true,
			},
		});

		// g.on("node:added", (e) => {
		// 	handleGraphEvent(e, "add");
		// });

		graphStore.setGraph(g);

	}, []);


	return (
		<div className="app-wrap">
			<div ref={refContainer} className="app-content" />
			<graphContext.Provider value={graphStore}>
				<LayoutProvider>
					{children}
				</LayoutProvider>
			</graphContext.Provider>
		</div>
	);
}

export const NodeBox = observer(({ node, children, parent_id = null, edges = [] }: any) => {
	const graphStore = React.useContext(graphContext);
	console.log(`${parent_id} -> ${node.id}`);
	const [rendered, setRendered] = React.useState<boolean>(false);

	React.useEffect(() => {
		console.log("1");
		if (!graphStore.graph) {
			return;
		}
		if (parent_id === -1) { // parent not available
			return;
		}
		if (parent_id === null) { // no parent, render to canvas
			const res = graphStore.graph.addNode(node);
			console.log("RES:", node);
		}
		else {
			console.log('parent:', parent_id);
			const parent: Cell = (graphStore.graph as Graph).getCell(parent_id);
			const child = (graphStore.graph as Graph).addNode(node);
			parent.addChild(child);
			console.log(parent.getChildren());
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

	}, [node, parent_id, graphStore.graph]);

	React.useEffect(() => {
		console.log("2");
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

	const childrenWithProps = React.Children.map(children, child =>
		React.cloneElement(child, { parent_id: rendered ? node.id : -1 })
	);

	return (
		<>{childrenWithProps}</>
	);
});

export const VericalBox = observer((props: any) => {
	const { data, parent_id } = props;

	const node = {
		id: data["@id"],
		size: { width: 140, height: 40 },
		zIndex: 0,
		position: randPos(),
		shape: "group",
		component(_) {
			return (<NodeShape text={data["@id"]} />);
		},
	}
	console.log("high:", node.component);

	const generalFields = Object.entries(data)
		.filter(([key, val]) => (key !== 'property' && key !== '@id'));
	const propertyFields = data['property']
		? data['property'].map((prop) => ['sh:property', prop['@id']])
		: [];

	return (
		<NodeBox node={node} edges={propertyFields} parent_id={parent_id}>
			{(generalFields.length > 0)
				? <WrapBox header="General" data={generalFields} />
				: <></>}
			{(propertyFields.length > 0)
				? <WrapBox header="Properties" data={propertyFields} />
				: <></>}
		</NodeBox>
	);
});

export const WrapBox = observer((props: any) => {
	const { parent_id, header, data } = props;

	const node = {
		id: uuidv4(),
		size: { width: 200, height: 30 },
		zIndex: 1,
		shape: "compartment",
		component(_) {
			return <Compartment text={header} />;
		},
	}

	return (
		<NodeBox node={node} parent_id={parent_id}>
			{data.map(([name, val], idx) => <FieldBox key={idx} text={`${name}:	${val}`} />)}
		</NodeBox>
	);
});

export const FieldBox = observer((props: any) => {
	const { parent_id, text } = props;

	const node = {
		id: uuidv4(),
		size: { width: 200, height: 50 },
		zIndex: 2,
		shape: "field",
		component(_) {
			return <NodeField text={text} />
		},
	}

	return (
		<NodeBox node={node} parent_id={parent_id}/>
	);
});

export const G = (props: any) => {

	return (
		<Canvas>
			{props.data.shapes.map(shape => <VericalBox key={shape['@id']} data={shape} />)}
			{props.data.properties.map(shape => <VericalBox key={shape['@id']} data={shape} />)}
		</Canvas>
	);
}
