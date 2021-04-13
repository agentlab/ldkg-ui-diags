import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from 'antd';
import { Canvas } from "./Canvas"
import { renderers } from './renderers';
import { stencils } from './stencils';

const graphWidth = 800;
const graphHeight = 600;

/*const VericalBox = observer(({ data }: any) => {
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
	const propertyShapes = () => {
		if ( !data.property ) {
			return null;
		}
		if (Array.isArray(data.property)) {
			return data.property.map(shape =>
				<VericalBox key={shape['@id']} data={shape} />) 
		}
		return <VericalBox key={data.property['@id']} data={data.property} />
	}
	return (
		<React.Fragment>
			<NodeBox node={node} edges={[]}>
				{(generalFields.length > 0)
					? <WrapBox header="General" data={generalFields} pId={data['@id']}/>
					: <></>}
				{(propertyFields.length > 0)
					? [
						<WrapBox header="Properties" data={propertyFields} pId={data['@id']}/>,
						...propertyFields.map(([label, destId], idx) =>
							<SquareEdge key={idx} targetId={destId} label={label} pId={data['@id']}/>)
					]
					: <></>}
			</NodeBox>
			
			{propertyShapes()}
		</React.Fragment>
	);
});*/

/*const WrapBox = observer(({ header, data, pId }: any) => {
	const node = {
		id: pId + '/' + header,
		size: { width: 200, height: 30 },
		zIndex: 1,
		shape: "compartment",
		component(_) {
			return <Compartment text={header} />;
		},
	}
	return (
		<NodeBox node={node}>
			{data.map(([name, val], idx) => <FieldBox key={idx} text={`${name}:	${val}`} pId={node.id}/>)}
		</NodeBox>
	);
});*/

/*const CircleNode = observer(({ data }: any) => {
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
});*/
const RenderPiece = ({data}) => {
	const type = data['@type'] || 'default';
	const stencil = data.stencil || 'default';
	const RenderType = renderers[type];
	const RenderStencil = stencils[stencil];
	const renderer = <RenderStencil data={data} />;
	return <RenderType data={data} renderer={renderer} />;
}

export const Graph = observer((props: any) => {
	return (
		<React.Fragment>
			<Button type="primary" shape="round" onClick={props.loadData}>Load More</Button>
			<Canvas view={props.view} width={graphWidth} height={graphHeight} >
				<React.Fragment>
					{props.data.map((e) => <RenderPiece data={e} />)}
					{props.сhildNodesData.map((e) => <RenderPiece data={e} />)}
					{props.arrowsData.map((e) => <RenderPiece data={e} />)}
				</React.Fragment>
			</Canvas>
		</React.Fragment>
	);
});


