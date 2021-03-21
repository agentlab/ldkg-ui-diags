
import React from "react";
import { Addon } from "@antv/x6";

import { graphContext } from "./Canvas"

import { NodeShape } from "./visual_components/NodeShape";
import { NodeField } from "./visual_components/NodeField";
import { ReactShape } from "@antv/x6-react-shape";

export const Stencil = ({nodes = []}: any) => {

	const refContainer = React.useRef<any>();
	const graphStore = React.useContext(graphContext);
	const [stencil, set_stencil] = React.useState<any>();

	React.useEffect(() => {
		const s = new Addon.Stencil({
			title: "Stencil",
			target: graphStore.graph,
			collapsable: true,
			stencilGraphWidth: 300,
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
		set_stencil(s);
		
		refContainer.current.appendChild(s.container);
	}, [graphStore.graph]);

	React.useEffect(() => {
		if (stencil) {
			stencil.load(nodes, "group1");
		}
	}, [nodes, stencil]);


	return <div ref={refContainer} className="app-stencil" />;
}
