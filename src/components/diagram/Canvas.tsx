import React from "react";
import { Graph } from "@antv/x6";
import { ReactShape } from "@antv/x6-react-shape";
import { useGraph } from '../../stores/graph'


export const Canvas = ({ children, view, width, height }) => {
	const refContainer = React.useRef<any>();
	const [callbacksBinded, setCallbacksBinded] = React.useState<boolean>(false);
	const { graphStore, layoutStore, minimap } = useGraph();

	React.useEffect(() => {
		try {
			Graph.registerNode("group", {
				inherit: ReactShape,
			}, true);
			Graph.registerNode("compartment", {
				inherit: ReactShape,
			}, true);
			Graph.registerNode("field", {
				inherit: ReactShape,
			}, true);

			const circlArrowhead = {
				tagName: 'circle',
				attrs: {
					r: 6,
					fill: 'grey',
					'fill-opacity': 0.3,
					stroke: 'black',
					'stroke-width': 1,
					cursor: 'move',
				},
			};
			Graph.registerEdgeTool(
				'circle-source-arrowhead',
				{
					inherit: 'source-arrowhead',
					...circlArrowhead,
				},
				true,
			);
			Graph.registerEdgeTool(
				'circle-target-arrowhead',
				{
					inherit: 'target-arrowhead',
					...circlArrowhead,
				},
				true,
			)
		}
		catch (e) { // typically happens during recompilation
			console.log(e);
		}

		const g = new Graph({
			container: refContainer.current,
			width: width,
			height: height,
			grid: {
				visible: true,
			},
			resizing: {
				enabled: true,
			},
			history: true,
			clipboard: {
				enabled: true,
			},
			scroller: {
				enabled: true,
				pageVisible: true,
				pageBreak: false,
				pannable: true,
			},
			mousewheel: {
				enabled: true,
				factor: 1.1,
				modifiers: ['ctrl', 'meta'],
			},
			minimap,
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
			interacting: {
				edgeMovable: true,
				arrowheadMovable: true,
			},
		});

		// g.on("node:added", (e) => {
		// 	handleGraphEvent(e, "add");
		// });

		graphStore.setGraph(g);
	}, [graphStore, height, minimap, width]);

	const getContainerSize = () => {
		return {
			width: document.body.offsetWidth - 581,
			height: document.body.offsetHeight - 90,
		}
	}

	React.useEffect(() => {
		const resizeFn = () => {
			const { width, height } = getContainerSize()
			graphStore.graph?.resize(width, height)
		}
		resizeFn()
		window.addEventListener('resize', resizeFn)
		return () => {
			window.removeEventListener('resize', resizeFn)
		}
	}, [graphStore.graph])

	React.useEffect(() => {
		if (graphStore.graph && !callbacksBinded) {
			graphStore.graph?.on("node:resized", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.sizeCalc(e, "resize");
			});
			graphStore.graph?.on("node:moved", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.sizeCalc(e, "move");
			});
			graphStore.graph?.on("node:added", (e) => {
				layoutStore.sizeCalc(e, "add");
			});
			graphStore.graph?.on("node:change:parent", (e) => {
				layoutStore.sizeCalc(e, "embed");
			});
			graphStore.graph?.on("node:removed", (e) => {
				layoutStore.sizeCalc(e, "remove");
			});
			graphStore.graph.on('edge:mouseenter', ({ cell }) => {
				cell.addTools([
					'circle-source-arrowhead', 'circle-target-arrowhead'
				])
			});

			graphStore.graph.on('edge:mouseleave', ({ cell }) => {
				cell.removeTools()
			})

			const connect_key = 'alt';
			graphStore.graph.bindKey(connect_key, () => {
				(graphStore.graph as Graph).getNodes().map(node =>
					node.attr('body/magnet', true)
				);
			}, 'keydown');
			graphStore.graph.bindKey(connect_key, () => {
				(graphStore.graph as Graph).getNodes().map(node =>
					node.attr('body/magnet', false)
				);
			}, 'keyup');
			graphStore.graph.on('edge:connected', () => {
				(graphStore.graph as Graph).getNodes().map(node =>
					node.attr('body/magnet', false)
				);
			});

			setCallbacksBinded(true);
		}
	}, [graphStore.graph, callbacksBinded, layoutStore]);

	if (graphStore.graph) {
		const onGridAttrsChanged = (attrs) => {
			let options
			if (attrs.type === 'doubleMesh') {
				options = {
					type: attrs.type,
					args: [
						{
							color: attrs.color,
							thickness: attrs.thickness,
						},
						{
							color: attrs.colorSecond,
							thickness: attrs.thicknessSecond,
							factor: attrs.factor,
						},
					],
				}
			} else {
				options = {
					type: attrs.type,
					args: [
						{
							color: attrs.color,
							thickness: attrs.thickness,
						},
					],
				}
			}
			graphStore.graph?.drawGrid(options)
		}

		if (view.options?.gridOptions) {
			onGridAttrsChanged(view.options.gridOptions);
			if (view.options.gridOptions.size) graphStore.graph?.setGridSize(view.options.gridOptions.size);
			if (view.options.gridOptions.bgColor) graphStore.graph?.drawBackground({ color: view.options.gridOptions.bgColor });
		}
	}
	const toRender = graphStore.graph ? children : <></>;

	return (
		<div id="container" ref={refContainer} className="x6-graph">
			{toRender}
		</div>
	);
}