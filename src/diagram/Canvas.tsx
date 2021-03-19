
import React from "react";
import { Graph } from "@antv/x6";
import { ReactShape } from "@antv/x6-react-shape";
import useGraph from '../stores/graph'

export const Canvas = ({ children, width, height }) => {
	const refContainer = React.useRef<any>();
	const [callbacks_binded, set_callbacks_binded] = React.useState<boolean>(false);

	const {graphStore, layoutStore} = useGraph();

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
		<div id="container" ref={refContainer} className="x6-graph">
			{children}
		</div>
	);
}