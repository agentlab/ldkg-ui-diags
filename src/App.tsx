import React from 'react';
import { Provider } from 'react-redux';
import { when } from 'mobx';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl } from '@agentlab/sparql-jsld-client';

import { rdfServerUrl, rmRepositoryParam } from './config';
import { createRootStoreFromState } from './stores/RootStore';
import { RootContextProvider } from './stores/RootContext';
import { GraphEditor } from './components/GraphEditor';
import { rootModelInitialState2, viewDescrCollConstr } from './stores/view';

import './App.css';

const client = new SparqlClientImpl(rdfServerUrl);
export const rootStore = createRootStoreFromState(rmRepositoryParam, client, rootModelInitialState2);
const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <RootContextProvider rootStore={rootStore}>
          <GraphEditor viewDescrId={viewDescrCollConstr['@id']} />
        </RootContextProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default App;

/*when(
	()=> Object.keys(rootStore.ns.currentJs).length > 5 && !rootStore.getColl(viewDescrCollConstr['@id']),
	()=> {
		const coll0 = rootStore.addColl(
			viewDescrCollConstr0,
			{
				updPeriod: undefined,
				lastSynced: moment.now(),
			},
			viewDescrs0
		);
		if (!coll0) {
		  console.warn('coll0 is undefined');
		}
	}
);
*/
