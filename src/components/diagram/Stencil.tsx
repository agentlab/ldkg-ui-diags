
import React, { useEffect } from "react";
import { Addon } from "@antv/x6";

import { useGraph } from "../../stores/graph";
import { NodeShape } from "./stencils/NodeShape";
import { NodeField } from "./stencils/NodeField";
import { observer } from "mobx-react-lite";
import { Minimap } from "../diagram/visualComponents/minimap";

import styles from '../../Editor.module.css'

export const Stencils = observer(() => {
	const { graphStore, isClassDiagram } = useGraph();
	const stencils = graphStore.graph ? createStencils(isClassDiagram) : <></>;  
	return (
		<div id="stencil" className={styles.sider} >
				{stencils}
				<Minimap />
			</div>
	)
}); 


export const Stencil = ({nodes = []}: any) => {
	const refContainer = React.useRef<any>();
	const { graphStore } = useGraph();
	useEffect(() => {
		const s = new Addon.Stencil({
			title: "Stencil",
			target: graphStore.graph,
			collapsable: true,
			stencilGraphWidth: 290,
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
	
		if (s) {
			s.load(nodes, "group1");
		}
		refContainer.current?.appendChild(s.container);
	},[graphStore, nodes])

	return <div ref={refContainer} className={styles.stencil}/>
};


export const createStencils = (isClassDiagram: boolean) => {
	console.log('CREATE');
	const nodeShape = {
		id: "Node Shape",
		size: { width: 140, height: 40 },
		zIndex: 0,
		shape: "group",
		component(_) {
			return <NodeShape text={"Node Shape"} />;
		},
	};
	const nodeField = {
		id: "Node Field",
		size: { width: 140, height: 40 },
		zIndex: 2,
		shape: "field",
		component(_) {
			return <NodeField text={"Node Field"} />;
		},
	};
	const nodeCircle = {
		id: "Node Circle",
		size: { width: 80, height: 80 },
		zIndex: 0,
		shape: "circle",
		label: "Node Circle",
		attrs: {
			body: {
				fill: '#efdbff',
				stroke: '#9254de',
			},
		},
	};
	return isClassDiagram
		? <Stencil nodes={[nodeField, nodeShape]} />
		: <Stencil nodes={[nodeCircle]} />;
};