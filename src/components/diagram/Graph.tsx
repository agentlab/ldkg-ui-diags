
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from 'uuid';

import { NodeShape } from "./visual_components/NodeShape";
import { Compartment } from "./visual_components/Compartment";
import { NodeField } from "./visual_components/NodeField";
import { NodeBox } from "./NodeBox"
import { EdgeBox } from "./EdgeBox";
import { Canvas } from "./Canvas"
import useGraph from "../../stores/graph";

const graphWidth = 800;
const graphHeight = 600;

const randPos = () => {
	return {
		x: Math.random() * (graphWidth - 100),
		y: Math.random() * (graphHeight - 100),
	};
};

const prepare_array = (obj: any) => {
	if (!obj) {
		return [];
	}
	if (Array.isArray(obj)) {
		return obj;
	}
	else {
		return [obj];
	}
}

const DirectEdge = observer(({ target_id, label, parent_id }: any) => {

	const edge = {
		id: uuidv4(),
		target: target_id,
		label: label,
		router: {
			name: 'normal'
		}
	};

	return (
		<EdgeBox edge={edge} parent_id={parent_id} />
	);
});

const SquareEdge = observer(({ target_id, label, parent_id }: any) => {

	const edge = {
		id: uuidv4(),
		target: target_id,
		label: label,
		router: {
			name: 'manhattan'
		}
	};

	return (
		<EdgeBox edge={edge} parent_id={parent_id} />
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

	const propertyFields = prepare_array(data['property'])
		.map((prop) => ['sh:property', prop['@id']]);

	return (
		<NodeBox node={node} edges={[]} parent_id={parent_id}>
			{(generalFields.length > 0)
				? <WrapBox header="General" data={generalFields} />
				: <></>}
			{(propertyFields.length > 0)
				? [
					<WrapBox header="Properties" data={propertyFields} />,
					...propertyFields.map(([label, dest_id], idx) =>
						<SquareEdge key={idx} target_id={dest_id} label={label} />)
				]
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

const CircleNode = observer((props: any) => {
	const { data, parent_id } = props;

	const node = {
		id: data["@id"],
		size: { width: 80, height: 80 },
		zIndex: 0,
		position: randPos(),
		shape: "circle",
		label: data["@id"],
		attrs: {
			body: {
				fill: '#efdbff',
				stroke: '#9254de',
			},
		},
	}

	const propertyFields = prepare_array(data['property'])
		.map((prop) => ['sh:property', prop['@id']]);

	return (
		<NodeBox node={node} parent_id={parent_id}>
			{propertyFields.map(([label, dest_id], idx) =>
				<DirectEdge key={idx} target_id={dest_id} label={label} />)}
		</NodeBox>
	);
});

export const Graph = observer((props: any) => {

	const {layoutStore} = useGraph();

	const shapes = [...props.data.shapes, ...props.data.properties];

	const render_children = () => {
		if (layoutStore.isClassDiagram) {
			return shapes.map(shape =>
				<VericalBox key={shape['@id']} data={shape} />);
		}
		else {
			return shapes.map(shape =>
				<CircleNode key={shape['@id']} data={shape} />)
		}
	};

	return (
		<Canvas width={graphWidth} height={graphHeight} minimapRef={props.minimapRef}>
			{render_children()}
		</Canvas>
	);
});
