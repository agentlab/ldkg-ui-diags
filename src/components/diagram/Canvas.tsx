import React from "react";
import { Graph } from "@antv/x6";
import { ReactShape } from "@antv/x6-react-shape";
import { useGraph } from '../../stores/graph'


export const Canvas = ({ children, view, width, height }) => {
	const refContainer = React.useRef<any>();
	const [callbacks_binded, set_callbacks_binded] = React.useState<boolean>(false);
	const {graphStore, layoutStore, minimap} = useGraph();

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
		});

		// g.on("node:added", (e) => {
		// 	handleGraphEvent(e, "add");
		// });

		graphStore.setGraph(g);
	}, []);

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
		if (graphStore.graph && !callbacks_binded) {
			graphStore.graph?.on("node:resized", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.size_calc(e, "resize");
			});
			graphStore.graph?.on("node:moved", (e: any) => {
				if (e.options && e.options.ignore) {
					return;
				}
				layoutStore.size_calc(e, "move");
			});
			graphStore.graph?.on("node:added", (e) => {
				layoutStore.size_calc(e, "add");
			});
			graphStore.graph?.on("node:change:parent", (e) => {
				layoutStore.size_calc(e, "embed");
			});
			graphStore.graph?.on("node:removed", (e) => {
				layoutStore.size_calc(e, "remove");
			});

			set_callbacks_binded(true);
		}
	}, [graphStore.graph]);

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

	return (
		<div id="container" ref={refContainer} className="x6-graph">
			{children}
		</div>
	);
}