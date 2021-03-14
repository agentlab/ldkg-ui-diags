
import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import { Graph, Node, } from "@antv/x6";
// import "@antv/x6-react-shape";
import { ReactShape } from "@antv/x6-react-shape";
import * as kiwi from "kiwi.js";
import { toJS, observable, action } from 'mobx'

export const layoutContext = React.createContext<any>(null);
export const graphContext = React.createContext<any>(null);

export const Canvas = ({ children, width, height }) => {
	const refContainer = React.useRef<any>();
	const [callbacks_binded, set_callbacks_binded] = React.useState<boolean>(false);

	const graphStore = useLocalObservable(() => ({
		graph: undefined as any,
		nodes: observable.set() as any,
		setGraph(graph: any) {
			graphStore.graph = graph;
		},
		getGraph() {
			return graphStore.graph;
		},

		addNode(id: string) {
			graphStore.nodes.add(id);
		},
		deleteNode(id: string) {
			graphStore.nodes.delete(id);
		},
	}),
		{
			graph: observable.ref,
		});

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
			width: width,
			height: height,
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

			let changed_ids = layoutStore.propogate_updates(layoutStore.get_root(node.id));

			if (type === "add") {
				layoutStore.add_node(node);
			}
			else if (type === "embed") {

				// remove from old parent
				if (e.previous) {
					const parent_id = e.previous;

					const parent = layoutStore.size_data[parent_id];
					layoutStore.solver.removeConstraint(parent.children.data[node.id]);
					delete parent.children.data[node.id];

					layoutStore.update_parent(parent_id);

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

			}
			else if (type === "move") {
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].left, node.position().x);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].top, node.position().y);
			}
			else if (type === "resize") {
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].width, node.size().width);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].height, node.size().height);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].left, node.position().x);
				layoutStore.solver.suggestValue(layoutStore.size_data[node.id].top, node.position().y);
			}
			else if (type === "remove") {
				const removed = layoutStore.size_data[node.id];

				if (removed.parent) {
					const parent_id = layoutStore.size_data[node.id].parent.id;
					const parent = layoutStore.size_data[parent_id];
					layoutStore.solver.removeConstraint(parent.children.data[node.id]);
					delete parent.children.data[node.id];

					layoutStore.update_parent(parent_id);

					for (const constraint of removed.parent.constraints) {
						layoutStore.solver.removeConstraint(constraint);
					}
				}

				// embed events should've already removed children from `updated` component

				for (const constraint of removed.constraints) {
					layoutStore.solver.removeConstraint(constraint);
				}
				layoutStore.solver.removeEditVariable(removed.top);
				layoutStore.solver.removeEditVariable(removed.left);
				layoutStore.solver.removeEditVariable(removed.width);
				layoutStore.solver.removeEditVariable(removed.height);

				delete layoutStore.size_data[node.id];
				delete layoutStore.computed_size[node.id];
			}

			changed_ids = [...changed_ids, ...layoutStore.propogate_updates(layoutStore.get_root(node.id))];

			layoutStore.solver.updateVariables();
			for (const id of changed_ids) {
				const sizes = layoutStore.size_data[id];
				if (!sizes) { // node deleted
					continue;
				}
				layoutStore.computed_size[id] = {
					width: sizes.width.value(),
					height: sizes.height.value(),
					top: sizes.top.value(),
					left: sizes.left.value(),
				};
			}

		},
		propogate_updates(root_id: string) {
			let changed_ids: any = new Set([root_id]);
			const current = layoutStore.size_data[root_id];
			if (!current) {
				return changed_ids;
			}
			for (const child_id of Object.keys(current.children.data)) {
				changed_ids = [...changed_ids, ...layoutStore.propogate_updates(child_id)];
			}
			return changed_ids;
		},
		get_root(id: string) {
			let current = layoutStore.size_data[id];
			let c_id = id;
			if (!current) {
				return c_id;
			}
			while (current.parent) {
				c_id = current.parent.id;
				current = layoutStore.size_data[c_id];
			}
			return c_id;
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
				}
				else if (node.shape === "compartment") {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.medium);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.medium);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.weak);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.weak);
					n.padding = { top: 30, bottom: 5, left: 5, right: 5 };
				}
				else if (node.shape === "group") {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.weak);
					n.padding = { top: 40, bottom: 5, left: 5, right: 5 };
				}
				else {
					layoutStore.solver.addEditVariable(n.top, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.left, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.width, kiwi.Strength.strong);
					layoutStore.solver.addEditVariable(n.height, kiwi.Strength.weak);
					n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
				}

				layoutStore.solver.suggestValue(n.left, node.position().x);
				layoutStore.solver.suggestValue(n.top, node.position().y);
				for (const constraint of n.constraints) {
					layoutStore.solver.addConstraint(constraint);
				}
				layoutStore.computed_size[node.id] = {
					width: 0,
					height: 0,
					top: 0,
					left: 0
				};
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
		},
	}), {
		solver: observable.ref,
		size_data: observable,
		computed_size: observable
	});

	React.useEffect(() => {
		if (graphStore.graph && !callbacks_binded) {
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
			graphStore.graph.on("node:removed", (e) => {
				layoutStore.size_calc(e, "remove");
			});

			set_callbacks_binded(true);
		}
	}, [graphStore.graph]);

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