
import React from 'react';
import { Graph } from "@antv/x6";

const edges_example = [
	{
		label: 'square-edge',
		router: {
			name: 'manhattan'
		}
	},
	{
		label: 'direct-edge',
		router: {
			name: 'normal'
		}
	}
];

const defOnSelect = (itemIdx: number) => console.log("Selected edge: ", itemIdx);

export const ConnectorTool = ({ edges = edges_example, onSelect = defOnSelect }: any) => {
	const refContainer = React.useRef<HTMLDivElement | null>(null);
	const [selectedIdx, setSelectedIdx] = React.useState<number>(0);
	const [graph, setGraph] = React.useState<Graph | null>(null);

	const selected_boundary = {
		name: 'selected-boundary',
		value: {
			inherit: 'boundary',
			padding: 6,
		}
	};
	const hover_boundary = {
		name: 'hover-boundary',
		value: {
			inherit: 'boundary',
			padding: 6,
			attrs: {
				fill: '#7c68fc',
				stroke: '#9254de',
				strokeWidth: 1,
				fillOpacity: 0.2,
			},
		}
	};

	const width = 200;
	const height = 100;

	React.useEffect(() => {
		if (!refContainer || !refContainer.current) {
			return;
		}
		const g = new Graph({
			container: refContainer.current,
			width: width,
			height: height,
			interacting: false
		});
		edges.forEach((edge, idx) =>
			g.addEdge({
				id: String(idx),
				source: [10, 10 + idx * 30 + 5],
				target: [width - 10, 10 + (idx + 1) * 30 - 5],
				...edge
			})
		);
		Graph.registerEdgeTool(hover_boundary.name, hover_boundary.value, true);
		Graph.registerEdgeTool(selected_boundary.name, selected_boundary.value, true);
		setGraph(g);

	}, [refContainer]);

	React.useEffect(() => {
		if (!graph) {
			return;
		}

		graph.on('edge:mouseenter', ({ edge }) => {
			edge.addTools(hover_boundary.name)
		});
		graph.on('edge:mouseleave', ({ edge }) => {
			edge.removeTool(hover_boundary.name);
		})
		graph.on('edge:click', ({ edge }) => {
			const itemIdx = Number(edge.id)
			setSelectedIdx(itemIdx);
			onSelect(itemIdx);
		});
	}, [graph]);

	React.useEffect(() => {
		if (!graph) {
			return;
		}

		graph.getEdges().forEach(e =>
			e.removeTool(selected_boundary.name)
		);
		graph.getCellById(String(selectedIdx)).addTools(selected_boundary.name);

	}, [graph, selectedIdx]);

	return (
		<div ref={refContainer}>

		</div>
	);
}