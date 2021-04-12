import React from "react";
import { rootStore } from "./stores/RootStore";
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { RootContextProvider } from './stores/RootContext';
import { GraphEditor } from './components/GraphEditor';
import { viewDescrCollConstr } from "./stores/view";
import "./App.css";


const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

const App = () => {
	return(
		<React.StrictMode>
			<Provider store={store}>
				<RootContextProvider>
					<GraphEditor viewDescrId={viewDescrCollConstr['@id']}/>
				</RootContextProvider>
			</Provider>
		</React.StrictMode>
	)
};

export default App;
