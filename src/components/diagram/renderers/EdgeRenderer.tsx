import { observer } from "mobx-react-lite";
import { Graph } from "@antv/x6";
import { useGraph } from "../../../stores/graph";

export const EdgeRenderer = observer(({data, renderer}: any) => {
	const { graphStore } = useGraph();
	const arrowFrom = data.arrowFrom;
	const arrowTo = data.arrowTo;
	if (!graphStore.nodes.has(arrowFrom) || !graphStore.nodes.has(arrowTo)){
		return null;
	}
	return <CreateEdge data={data} />
});

export const CreateEdge = observer(({data}: any) => {
	const { graphStore } = useGraph();
	const edge = {
		id: data['@id'],
		target: data.arrowTo,
		source: data.arrowFrom,
		label: {

			markup: [
				{
					tagName: 'rect',
					selector: 'body',
				},
				{
					tagName: 'text',
					selector: 'label',
				},
			],
			attrs: {
				text: {
					text: data.subject.name,
					fill: '#000',
					fontSize: 10,
					textAnchor: 'middle',
					textVerticalAnchor: 'middle',
					pointerEvents: 'none',
				},
				rect: {
					ref: 'label',
					fill: '#fff',
					rx: 3,
					ry: 3,
					refWidth: 1,
					refHeight: 1,
					refX: 0,
					refY: 0,
				},
			},
			position: {
				distance: 0.5,
			},
		},
		router: {
			name: data.router || 'normal',
		}
	};
	(graphStore.graph as Graph).addEdge(edge);
	return <></>;
})
	