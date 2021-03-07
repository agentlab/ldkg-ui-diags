import React from "react";
import { Graph, Addon, Node, Model } from "@antv/x6";
import * as kiwi from "kiwi.js";

import { ReactShape } from "@antv/x6-react-shape";
import "@antv/x6-react-shape";

import { NodeShape } from "./NodeShape";
import { Compartment } from "./Compartment";
import { NodeField } from "./NodeField";

const { Stencil } = Addon;

const graphWidth = 800;
const graphHeight = 600;

const randPos = () => {
	return {
		x: Math.random() * (graphWidth  - 100),
		y: Math.random() * (graphHeight  - 100),
	};
};

const parse_data = (data: any, graph: any, size_data: any, solver: any) => {
	console.log("Parsing");
	const test_data = data;
	const model = new Model();
	model.on("node:resized", (e: any) => {
		if (e.options && e.options.ignore) {
			return;
		}
		size_calc(e, "resize", model, size_data, solver);
	});
	model.on("node:moved", (e: any) => {
		if (e.options && e.options.ignore) {
			return;
		}
		size_calc(e, "move", model, size_data, solver);
	});
	model.on("node:change:children", (e) => {
		size_calc(e, "embed", model, size_data, solver);
	});
	model.on("node:added", (e) => {
		size_calc(e, "add", model, size_data, solver);
	});

	for (const prop of test_data.properties) {
		model.addNode({
			id: prop["@id"],
			size: { width: 140, height: 40 },
			zIndex: 0,
			position: randPos(),
			shape: "group",
			component: <NodeShape text={prop["@id"]} />,
		});
	}
	for (const shape of test_data.shapes) {
		const shape_node = model.addNode({
			id: shape["@id"],
			size: { width: 140, height: 40 },
			zIndex: 0,
			position: randPos(),
			shape: "group",
			component: <NodeShape text={shape["@id"]} />,
		});
		const props = Object.entries(shape).filter(
			([name]) => name !== "@id" && name !== "property"
		);
		if (props) {
			const prop_compartment = model.addNode({
				size: { width: 200, height: 30 },
				zIndex: 1,
				shape: "compartment",
				component: <Compartment text="General" />,
			});
			prop_compartment.addTo(shape_node);

			for (const [name, val] of props) {
				const prop_node = model.addNode({
					size: { width: 200, height: 50 },
					zIndex: 2,
					shape: "field",
					component: <NodeField text={`${name}:    ${val}`} />,
				});
				prop_node.addTo(prop_compartment);
			}
		}

		if (shape.property && Array.isArray(shape.property) && shape.property.length !== 0) {
			const prop_compartment = model.addNode({
				size: { width: 200, height: 30 },
				zIndex: 1,
				shape: "compartment",
				component: <Compartment text="Properties" />,
			});
			prop_compartment.addTo(shape_node);

			for (const prop of shape.property) {
				const prop_id = prop["@id"];
				// filter blank nodes (embedded shapes)
				if (prop_id && !prop_id.startsWith('_:')) {
					const prop_node = model.addNode({
						size: { width: 200, height: 50 },
						zIndex: 2,
						shape: "field",
						component: <NodeField text={`sh:property:    ${prop_id}`} />,
					});
					prop_node.addTo(prop_compartment);
				}
			}

			for (const prop of shape.property) {
				const prop_id = prop["@id"];
				// filter blank nodes (embedded shapes)
				if (prop_id && !prop_id.startsWith('_:')) {
					model.addEdge({
						source: shape["@id"],
						target: prop_id,
						label: "sh:property",
					});
				}
			}
		}
	}

	for (const prop of test_data.properties) {
		if (prop.node) {
			model.addEdge({
				target: prop["node"],
				source: prop["@id"],
				label: "sh:node",
			});
		}
	}
	// const circularLayout = new Layout({
	// 	type: 'circular',
	// 	width: 600,
	// 	height: 400,
	// 	center: [300, 200],
	// 	radius: 50,
	// });
	// const newModel = circularLayout.layout({nodes: model.getNodes()});
	// console.log(newModel);
	(graph as Graph).fromJSON(model.toJSON(), {silent: false});
};

const add_node = (node: Node, size_data: any, solver: any) => {

	if (!size_data[node.id]) {
		size_data[node.id] = {
			children: { data: {}, constraint: null },
			parent: null,
			top: new kiwi.Variable(),
			left: new kiwi.Variable(),
			width: new kiwi.Variable(),
			height: new kiwi.Variable(),
			padding: null,
			constraints: [],
		};
		const n = size_data[node.id];

		n.constraints = [
			new kiwi.Constraint(n.width, kiwi.Operator.Ge, 200, kiwi.Strength.required),
			new kiwi.Constraint(n.height, kiwi.Operator.Ge, 35, kiwi.Strength.required)
		];

		if (node.shape === "field") {
			solver.addEditVariable(n.top, kiwi.Strength.weak);
			solver.addEditVariable(n.left, kiwi.Strength.weak);
			solver.addEditVariable(n.width, kiwi.Strength.weak);
			solver.addEditVariable(n.height, kiwi.Strength.strong);
			n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
		} else if (node.shape === "compartment") {
			solver.addEditVariable(n.top, kiwi.Strength.medium);
			solver.addEditVariable(n.left, kiwi.Strength.medium);
			solver.addEditVariable(n.width, kiwi.Strength.weak);
			solver.addEditVariable(n.height, kiwi.Strength.weak);
			n.padding = { top: 30, bottom: 5, left: 5, right: 5 };
		} else {
			solver.addEditVariable(n.top, kiwi.Strength.strong);
			solver.addEditVariable(n.left, kiwi.Strength.strong);
			solver.addEditVariable(n.width, kiwi.Strength.strong);
			solver.addEditVariable(n.height, kiwi.Strength.weak);
			n.padding = { top: 40, bottom: 5, left: 5, right: 5 };
		}

		solver.suggestValue(n.left, node.position().x);
		solver.suggestValue(n.top, node.position().y);
		for (const constraint of n.constraints) {
			solver.addConstraint(constraint);
		}
	}
}

const propogade_update = (id: string, graph: any) => {
	const node = graph.getCell(id);
	const ancestors = node.getAncestors();
	let root: any = null;
	if (ancestors.length === 0) {
		root = node;
	} else {
		root = ancestors[ancestors.length - 1];
	}
	const descendants = root.getDescendants();
	let descendants_ids = new Set();
	descendants_ids.add(root.id);
	for (const desc of descendants) {
		descendants_ids.add(desc.id);
	}
	return descendants_ids;
}

const update_parent = (parent: any, size_data: any, solver: any) => {
	// parent is part of data
	if (parent.children.constraint) {
		solver.removeConstraint(parent.children.constraint);
		parent.children.constraint = null;
	}
	if (Object.keys(parent.children.data).length !== 0) {
		let parent_size = new kiwi.Expression(parent.padding.top);
		let offset = new kiwi.Expression(parent.top, parent.padding.top);
		for (const child_id in parent.children.data) {
			const child = size_data[child_id];
			if (parent.children.data[child_id]) {
				solver.removeConstraint(parent.children.data[child_id]);
			}
			const child_offset = new kiwi.Constraint(child.top, kiwi.Operator.Eq, offset, kiwi.Strength.required);
			parent.children.data[child_id] = child_offset;
			solver.addConstraint(child_offset);
			offset = new kiwi.Expression(child.top, child.height);
			parent_size = parent_size.plus(child.height);
		}
		parent.children.constraint = new kiwi.Constraint(parent_size.plus(parent.padding.bottom), kiwi.Operator.Eq, parent.height, kiwi.Strength.required);
		solver.addConstraint(parent.children.constraint);
	}
}

const size_calc = (e: any, type: string, graph: any, size_data: any, solver: any) => {
	// console.log(type, e);
	const node: Node = e.node;

	let changed: any = new Set();
	if (type === "add") {
		add_node(node, size_data, solver);

		changed.add(node.id);
	} else if (type === "embed") {
		const curr = e.current;
		let prev = e.previous;
		if (prev === undefined) {
			prev = [];
		}

		if (curr.length > prev.length) {
			// added
			const intersection = curr.filter((x: any) => !prev.includes(x));
			const updated = intersection[0]; // only 0 for now

			add_node(graph.getCell(updated), size_data, solver);

			const u = size_data[updated];
			u.parent = {
				id: node.id,
				constraints: [],
			};

			const parent = size_data[node.id];
			parent.children.data[updated] = null;

			u.parent.constraints = [
				new kiwi.Constraint(u.width, kiwi.Operator.Eq,
					new kiwi.Expression(parent.width, -parent.padding.right, -parent.padding.left),
					kiwi.Strength.required),
				new kiwi.Constraint(u.left, kiwi.Operator.Eq,
					new kiwi.Expression(parent.left, parent.padding.left), kiwi.Strength.required),
			];
			for (const constraint of u.parent.constraints) {
				solver.addConstraint(constraint);
			}

			update_parent(parent, size_data, solver);

			changed = new Set([...changed, ...propogade_update(updated, graph)]);
		} else {
			// console.log("removed");
			const intersection = prev.filter((x: any) => !curr.includes(x));
			const updated = intersection[0]; // only 0 for now

			const parent = size_data[node.id];
			solver.removeConstraint(parent.children.data[updated]);
			delete parent.children.data[updated];

			update_parent(parent, size_data, solver);

			const u = size_data[updated];
			for (const constraint of u.parent.constraints) {
				solver.removeConstraint(constraint);
			}
			u.parent = null;

			changed = new Set([...changed, ...propogade_update(node.id, graph)]); // only node.id !!!

			// console.log(u.left.value(), u.top.value());
		}
	} else if (type === "move") {
		// console.log(node.position());
		solver.suggestValue(size_data[node.id].left, node.position().x);
		solver.suggestValue(size_data[node.id].top, node.position().y);
		changed = new Set([...changed, ...propogade_update(node.id, graph)]);
	} else if (type === "resize") {
		solver.suggestValue(size_data[node.id].width, node.size().width);
		solver.suggestValue(size_data[node.id].height, node.size().height);
		solver.suggestValue(size_data[node.id].left, node.position().x);
		solver.suggestValue(size_data[node.id].top, node.position().y);
		changed = new Set([...changed, ...propogade_update(node.id, graph)]);
	}

	solver.updateVariables();
	// console.log(changed);
	for (const id of changed) {
		const node: Node = graph.getCell(id);
		if (node) {
			node.resize(size_data[id].width.value(), size_data[id].height.value(), {
				ignore: true,
			});
			node.setPosition(size_data[id].left.value(), size_data[id].top.value(), {
				ignore: true,
			});
		}
	}
	// console.log(size_data);
};

export const G = (props: any) => {
	const [container, setContainer] = React.useState<HTMLDivElement>();
	const [stencilContainer, setStencilContainer] = React.useState<HTMLDivElement>();
	const [editing, setEditing] = React.useState<boolean>(false);
	const [graph, setGraph] = React.useState<Graph>();
	const [size_data, setSizeData] = React.useState<any>({});
	const [solver,] = React.useState<kiwi.Solver>(new kiwi.Solver());

	const graphRef = React.useRef(graph);
	const sizeDataRef = React.useRef(size_data);
	const solverRef = React.useRef(solver);
	React.useEffect(() => {
		graphRef.current = graph;
		sizeDataRef.current = size_data;
		solverRef.current = solver;
	}, [graph, size_data, solver]);
	const handleGraphEvent = (e: any, type: string) => {
		const graph = graphRef.current; 
		const size_data = sizeDataRef.current; 
		const solver = solverRef.current; 
		size_calc(e, type, graph, size_data, solver);
	};

	React.useEffect(() => {
		if (!container || !stencilContainer) {
			return;
		}
		Graph.registerNode("group", {
			inherit: ReactShape,
		});
		Graph.registerNode("compartment", {
			inherit: ReactShape,
		});
		Graph.registerNode("field", {
			inherit: ReactShape,
		});

		const g = new Graph({
			container: container,
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
		g.bindKey("ctrl", () => {
			// console.log("editor toggle");
			setEditing(!editing);
			g.getNodes().forEach((n) => {
				n.attr("fo/magnet", editing);
			});
		});
		const stencil = new Stencil({
			title: "Components",
			target: g,
			collapsable: true,
			stencilGraphWidth: 300,
			stencilGraphHeight: 180,
			layoutOptions: {
				columns: 1,
			},
			groups: [
				{
					name: "group1",
					title: "Components",
				},
			],
		});
		stencilContainer.appendChild(stencil.container);
		const nodeShape = new ReactShape({
			id: "Node Shape",
			size: { width: 140, height: 40 },
			zIndex: 0,
			shape: "group",
			component: <NodeShape text={"Node Shape"} />,
		});
		const nodeField = new ReactShape({
			id: "Node Field",
			size: { width: 140, height: 40 },
			zIndex: 2,
			shape: "field",
			component: <NodeField text={"Node Field"} />,
		});
		stencil.load([nodeShape, nodeField], "group1");

		
		g.on("node:resized", (e: any) => {
			if (e.options && e.options.ignore) {
				return;
			}
			handleGraphEvent(e, "resize");
		});
		g.on("node:moved", (e: any) => {
			if (e.options && e.options.ignore) {
				return;
			}
			handleGraphEvent(e, "move");
		});
		g.on("node:change:children", (e) => {
			handleGraphEvent(e, "embed");
		});
		g.on("node:added", (e) => {
			handleGraphEvent(e, "add");
		});
		
		setGraph(g);
		// parse_data(props.data, g);

	}, [container]);

	React.useEffect(() => {
		console.log(props);
		console.log(graph);
		if (graph) {
			parse_data(props.data, graph, size_data, solver);
		}
	}, [props.data, graph, size_data, solver]);

	const refContainer = (container: HTMLDivElement) => {
		setContainer(container);
	};
	const refStencilContainer = (stencilContainer: HTMLDivElement) => {
		setStencilContainer(stencilContainer);
	};

	return (
		<div className="app-wrap">
			<div ref={refStencilContainer} className="app-stencil" />
			<div ref={refContainer} className="app-content" />
		</div>
	);
}
