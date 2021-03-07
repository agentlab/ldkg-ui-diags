import React from "react";
import { Graph } from "@antv/x6";

import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";

import { useLocalObservable, observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import * as kiwi from "kiwi.js";

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
			console.log(toJS(graphStore.deferredEdges));
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

export const NodeBox = observer(({ node, children, edges = [] }: any) => {
	const graphStore = React.useContext(graphContext);

	React.useEffect(() => {
		if (!graphStore.graph) {
			return;
		}
		graphStore.graph.addNode(node);

		if (graphStore.hasEdge(node.id)) {
			console.log("HAS!")
			const [src_id, label] = graphStore.getEdge(node.id);
			(graphStore.graph as Graph).addEdge({
				source: src_id,
				target: node.id,
				label: label,
			});
			graphStore.deleteEdge(node.id)
		}

	}, [node, graphStore.graph]);

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

	return (
		<>{children}</>
	);
});

export const VericalBox = observer((props: any) => {
	const { data } = props;

	const node = {
		id: data["@id"],
		size: { width: 140, height: 40 },
		zIndex: 0,
		position: randPos(),
		shape: "group",
		component: <NodeShape text={data["@id"]} />,
	}

	const generalFields = Object.entries(data)
		.filter(([key, val]) => (key !== 'property' && key !== '@id'));
	let propertyFields = [];
	if (data['property']) {
		propertyFields = data['property'].map((prop) => ['sh:property', prop['@id']]);
	}

	return (
		<NodeBox node={node} edges={propertyFields.length > 0 ? propertyFields : []}>
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
	const { header, data } = props;

	const node = {
		size: { width: 200, height: 30 },
		zIndex: 1,
		shape: "compartment",
		component: <Compartment text={header} />,
	}

	return (
		<NodeBox node={node}>
			{data.map(([name, val], idx) => <FieldBox key={idx} text={`${name}:	${val}`} />)}
		</NodeBox>
	);
});

export const FieldBox = observer((props: any) => {
	const { text } = props;

	const node = {
		size: { width: 200, height: 50 },
		zIndex: 2,
		shape: "field",
		component: <NodeField text={text} />,
	}

	return (
		<NodeBox node={node} />
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
