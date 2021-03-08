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

const layoutContext = React.createContext<any>(null);
const graphContext = React.createContext<any>(null);

const Canvas = ({ children }) => {
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

	const layoutStore = useLocalObservable(() => ({
		solver: new kiwi.Solver(),
		size_data: {},
		computed_size: {},
		size_calc(e: any, type: string) {
			console.log(type, e);
			const node: Node = e.node;

			if (type === "add") {
				layoutStore.add_node(node);
			} else if (type === "embed") {

				// remove from old parent
				if (e.previous) {
					const parent_id = e.previous;

					const parent = layoutStore.size_data[parent_id];
					layoutStore.solver.removeConstraint(parent.children.data[node.id]);
					delete parent.children.data[node.id];

					layoutStore.update_parent(parent);

					const updated = layoutStore.size_data[node.id];
					for (const constraint of updated.parent.constraints) {
						layoutStore.solver.removeConstraint(constraint);
					}
					updated.parent = null;
				}

				// add to new parent
				if (e.current) {
					const parent_id = e.current;

					layoutStore.add_node(node);

					const updated = layoutStore.size_data[node.id];
					updated.parent = {
						id: parent_id,
						constraints: [],
					};

					const parent = layoutStore.size_data[parent_id];
					parent.children.data[node.id] = null;

					updated.parent.constraints = [
						new kiwi.Constraint(updated.width, kiwi.Operator.Eq,
							new kiwi.Expression(parent.width, -parent.padding.right, -parent.padding.left),
							kiwi.Strength.required),
						new kiwi.Constraint(updated.left, kiwi.Operator.Eq,
							new kiwi.Expression(parent.left, parent.padding.left), kiwi.Strength.required),
					];
					for (const constraint of updated.parent.constraints) {
						layoutStore.solver.addConstraint(constraint);
					}

					layoutStore.update_parent(parent_id);
				}

				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].left, node.position().x);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].top, node.position().y);

			} else if (type === "move") {
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].left, node.position().x);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].top, node.position().y);
			} else if (type === "resize") {
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].width, node.size().width);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].height, node.size().height);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].left, node.position().x);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].top, node.position().y);
			}

			layoutStore.solver.updateVariables();
			for (const [id, sizes] of Object.entries(layoutStore.size_data) as any) {
				layoutStore.computed_size[id] = {
					width: sizes.width.value(),
					height: sizes.height.value(),
					top: sizes.top.value(),
					left: sizes.left.value()
				};
			}
		},
		add_node(node: Node) {
			if (!layoutStore.size_data[node.id]) {
				layoutStore.size_data[node.id] = {
					children: { data: {}, constraint: null },
					parent: null,
					top: new kiwi.Variable(),
					left: new kiwi.Variable(),
					width: new kiwi.Variable(),
					height: new kiwi.Variable(),
					padding: null,
					constraints: [],
				};
				const n = layoutStore.size_data[node.id];

				n.constraints = [
					new kiwi.Constraint(n.width, kiwi.Operator.Ge, 200, kiwi.Strength.required),
					new kiwi.Constraint(n.height, kiwi.Operator.Ge, 35, kiwi.Strength.required)
				];

				if (node.shape === "field") {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.weak);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.weak);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.weak);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.strong);
					n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
				} else if (node.shape === "compartment") {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.medium);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.medium);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.weak);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.weak);
					n.padding = { top: 30, bottom: 5, left: 5, right: 5 };
				} else {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.weak);
					n.padding = { top: 40, bottom: 5, left: 5, right: 5 };
				}

				layoutStore.solver.suggestValue(n.left, node.position().x);
				layoutStore.solver.suggestValue(n.top, node.position().y);
				for (const constraint of n.constraints) {
					layoutStore.solver.addConstraint(constraint);
				}
			}

		},
		update_parent(parent_id: string) {
			const parent = layoutStore.size_data[parent_id]
			if (parent.children.constraint) {
				layoutStore.solver.removeConstraint(parent.children.constraint);
				parent.children.constraint = null;
			}
			if (Object.keys(parent.children.data).length !== 0) {
				let parent_size = new kiwi.Expression(parent.padding.top);
				let offset = new kiwi.Expression(parent.top, parent.padding.top);
				for (const child_id in parent.children.data) {
					const child = layoutStore.size_data[child_id];
					if (parent.children.data[child_id]) {
						layoutStore.solver.removeConstraint(parent.children.data[child_id]);
					}
					const child_offset = new kiwi.Constraint(child.top, kiwi.Operator.Eq, offset, kiwi.Strength.required);
					parent.children.data[child_id] = child_offset;
					layoutStore.solver.addConstraint(child_offset);
					offset = new kiwi.Expression(child.top, child.height);
					parent_size = parent_size.plus(child.height);
				}
				parent.children.constraint = new kiwi.Constraint(parent_size.plus(parent.padding.bottom), kiwi.Operator.Eq, parent.height, kiwi.Strength.required);
				layoutStore.solver.addConstraint(parent.children.constraint);
			}
		}
	}));

	React.useEffect(() => {
		if (graphStore.graph) {
			graphStore.graph.on("node:resized", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.size_calc(e, "resize");
			});
			graphStore.graph.on("node:moved", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.size_calc(e, "move");
			});
			graphStore.graph.on("node:added", (e) => {
				layoutStore.size_calc(e, "add");
			});
			graphStore.graph.on("node:change:parent", (e) => {
				layoutStore.size_calc(e, "embed");
			});
		}
	}, [graphStore.graph, layoutStore]);

	return (
		<div className="app-wrap">
			<div ref={refContainer} className="app-content" />
			<graphContext.Provider value={graphStore}>
				<layoutContext.Provider value={layoutStore}>
					{children}
				</layoutContext.Provider>
			</graphContext.Provider>
		</div>
	);
}

const NodeBox = observer(({ node, children, parent_id = null, edges = [] }: any) => {
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
			const parent: Cell = (graphStore.graph as Graph).getCell(parent_id);
			const child = (graphStore.graph as Graph).addNode(node);
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
			console.log("RERUN", layoutStore.computed_size[node.id].width,  layoutStore.computed_size[node.id].height);
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
		React.cloneElement(child, { parent_id: rendered ? node.id : -1 })
	);

	return (
		<>{childrenWithProps}</>
	);
});

const VericalBox = observer((props: any) => {
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

	const generalFields = Object.entries(data)
		.filter(([key, val]) => (key !== 'property' && key !== '@id'));

	let propertyFields = [] as any;
	if (data['property']) {
		if (Array.isArray(data['property'])) {
			propertyFields = data['property'].map((prop) => ['sh:property', prop['@id']]);
		}
		else {
			propertyFields = [ [ 'sh:property', data['property']['@id'] ] ];
		}
	}

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

const WrapBox = observer((props: any) => {
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

const FieldBox = observer((props: any) => {
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
		<NodeBox node={node} parent_id={parent_id} />
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
