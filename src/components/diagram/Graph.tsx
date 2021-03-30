import React from "react";
import { observer } from "mobx-react-lite";
import { v4 as uuidv4 } from 'uuid';

import { NodeShape } from "./visualComponents/NodeShape";
import { Compartment } from "./visualComponents/Compartment";
import { NodeField } from "./visualComponents/NodeField";
import { NodeBox } from "./NodeBox"
import { EdgeBox } from "./EdgeBox";
import { Canvas } from "./Canvas"
import { useGraph } from "../../stores/graph";

const graphWidth = 800;
const graphHeight = 600;

const randPos = () => {
	return {
		x: Math.random() * (graphWidth - 100),
		y: Math.random() * (graphHeight - 100),
	};
};

const prepareArray = (obj: any) => {
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

const DirectEdge = observer(({ targetId, label }: any) => {
	const edge = {
		id: uuidv4(),
		target: targetId,
		label: label,
		router: {
			name: 'normal'
		}
	};
	return (
		<EdgeBox edge={edge} />
	);
});

const SquareEdge = observer(({ targetId, label }: any) => {
	const edge = {
		id: uuidv4(),
		target: targetId,
		label: label,
		router: {
			name: 'manhattan'
		}
	};
	return (
		<EdgeBox edge={edge} />
	);
});

const VericalBox = observer(({ data }: any) => {
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
		.filter(([key,]) => (key !== 'property' && key !== '@id'));
	const propertyFields = prepareArray(data['property'])
		.map((prop) => ['sh:property', prop['@id']]);
	return (
		<NodeBox node={node} edges={[]}>
			{(generalFields.length > 0)
				? <WrapBox header="General" data={generalFields} />
				: <></>}
			{(propertyFields.length > 0)
				? [
					<WrapBox header="Properties" data={propertyFields} />,
					...propertyFields.map(([label, destId], idx) =>
						<SquareEdge key={idx} targetId={destId} label={label} />)
				]
				: <></>}
		</NodeBox>
	);
});

const WrapBox = observer(({ header, data }: any) => {
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
		<NodeBox node={node}>
			{data.map(([name, val], idx) => <FieldBox key={idx} text={`${name}:	${val}`} />)}
		</NodeBox>
	);
});

const FieldBox = observer(({ text }: any) => {
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
		<NodeBox node={node} />
	);
});

const CircleNode = observer(({ data }: any) => {
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
	const propertyFields = prepareArray(data['property'])
		.map((prop) => ['sh:property', prop['@id']]);
	return (
		<NodeBox node={node}>
			{propertyFields.map(([label, destId], idx) =>
				<DirectEdge key={idx} targetId={destId} label={label} />)}
		</NodeBox>
	);
});

export const Graph = observer((props: any) => {
	const { isClassDiagram } = useGraph();
	const shapes = [...props.data.shapes, ...props.data.properties];
	const renderChildren = () => {
		if (isClassDiagram) {
			return shapes.map(shape =>
				<VericalBox key={shape['@id']} data={shape} />);
		}
		else {
			return shapes.map(shape =>
				<CircleNode key={shape['@id']} data={shape} />)
		}
	};
	return (
		<Canvas view={props.view} width={graphWidth} height={graphHeight} >
			{renderChildren()}
		</Canvas>
	);
});
