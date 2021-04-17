import React, {useEffect} from "react";
import { Button } from 'antd';
import { createGraph, createGrid, addNewParentNodes, addNewChildNodes, addNewEdges } from './graphCore';
import { addKiwiSolver } from './kiwiCore';
import  { Minimap } from './visualComponents/Minimap';
import  { createStencils } from './visualComponents/Stencil';
import { GraphToolbar } from '../editor/Toolbar/EditorToolbar'
import { GraphCongigPanel } from "../editor/ConfigPanel/ConfigPanel";
import styles from '../../Editor.module.css'

const graphWidth = 800;
const graphHeight = 600;

export const Graph = (props: any) => {
	const [ graph, setGraph ] = React.useState<any>(null);
	const refContainer = React.useRef<any>();
	const minimapContainer = React.useRef<HTMLDivElement>(null);
	useEffect(() => {
		const graph = createGraph({height: graphHeight, width: graphWidth, refContainer, minimapContainer});
		createGrid({graph, view: props.view});
		addKiwiSolver({graph});
		addNewParentNodes({graph, nodesData: props.data});
		addNewChildNodes({graph, nodesData: props.сhildNodesData});
		addNewEdges({graph, edgesData: props.arrowsData});
		setGraph(graph);
	},[]);
	return (
		<React.Fragment>
			<div className={styles.wrap}>
				{props.view.title &&
					<div className={styles.header}>
						<span>{props.view.title}</span>
					</div>
				}
				<div className={styles.content}>
					<div id="stencil" className={styles.sider} >
						{createStencils(true, graph)}
						<Minimap minimapContainer={minimapContainer} />
					</div>
					<div className={styles.panel}>
						<GraphToolbar graph={graph}/>
						<React.Fragment>
					 	 	<Button type="primary" shape="round" onClick={props.loadData}>Load More</Button>
							<div id="container" ref={refContainer} className="x6-graph"/>
						</React.Fragment>					
					</div>
					<GraphCongigPanel view={props.view} viewDescrObs={props.viewDescrObs}/>
				</div>
			</div>
		</React.Fragment>
	);
}
