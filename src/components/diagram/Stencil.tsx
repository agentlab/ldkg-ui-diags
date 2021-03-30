
import React from "react";
import { Addon } from "@antv/x6";

import { useGraph } from "../../stores/graph";
import { NodeShape } from "./visualComponents/NodeShape";
import { NodeField } from "./visualComponents/NodeField";

import styles from '../../Editor.module.css'


export const Stencil = ({nodes = []}: any) => {
	const refContainer = React.useRef<any>();
	const { graphStore } = useGraph();
	const [stencil, setStencil] = React.useState<any>();

	React.useEffect(() => {
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
		setStencil(s);		
		refContainer.current.appendChild(s.container);
	}, [graphStore.graph]);

	React.useEffect(() => {
		if (stencil) {
			stencil.load(nodes, "group1");
		}
	}, [nodes, stencil]);

	return <div ref={refContainer} className={styles.stencil} />;
}


export const createStencils = (isClassDiagram: boolean) => {
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