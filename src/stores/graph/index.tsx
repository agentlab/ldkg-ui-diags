import React, { useContext, createContext, PropsWithChildren } from "react";
import { useLocalObservable } from "mobx-react-lite";
import { graphStoreAnnot, graphStoreConstr } from "./GraphStore";
import { layoutStoreAnnot, layoutStoreConstr } from "./LayoutStore";

interface GraphContextProps {
	graphStore: any,
	layoutStore: any,
	minimap: any
	setMinimap: React.Dispatch<any>,
	isClassDiagram: boolean,
	switchShape: () => void,
	edgeConnector: any,
	setEdgeConnector: any
}

export const GraphContext = createContext<GraphContextProps>({ graphStore: {}, layoutStore: {}, minimap: {}, setMinimap: () => { }, isClassDiagram: true, switchShape: () => { }, edgeConnector: {}, setEdgeConnector: () => { } });
export const useGraph = () => useContext(GraphContext);

export const GraphContextProvider = ({ children }: PropsWithChildren<any>) => {
	const graphStore = useLocalObservable(graphStoreConstr, graphStoreAnnot);
	const layoutStore = useLocalObservable(layoutStoreConstr, layoutStoreAnnot);

	const [minimap, setMinimap] = React.useState<any>();
	const [edgeConnector, setEdgeConnector] = React.useState<any>();

	const [isClassDiagram, setIsClassDiagram] = React.useState<boolean>(true);
	const switchShape = () => {
		setIsClassDiagram(!isClassDiagram);
	}
	return (
		<GraphContext.Provider
			value={{
				graphStore,
				layoutStore,
				minimap,
				setMinimap,
				isClassDiagram,
				switchShape,
				edgeConnector,
				setEdgeConnector
			}}>
			{children}
		</GraphContext.Provider>
	);
}
