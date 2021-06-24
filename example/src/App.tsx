import React from 'react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl, Repository } from '@agentlab/sparql-jsld-client';
import { MstContextProvider } from '@agentlab/ldkg-ui-react';

import {
  GraphEditor,
  rootModelInitialState3,
  viewDescrs,
  viewKinds,
  viewDescrCollConstr,
  viewKindCollConstr,
} from '../../es';

import '../../es/index.css';
import './App.css';

const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
// for remote data from server
//const rootStore = createModelFromState('mktp', client, rootModelInitialState, additionalColls);
// for local hardcoded data
//@ts-ignore
const rootStore = Repository.create(rootModelInitialState3, { client });
const store: any = asReduxStore(rootStore);
// eslint-disable-next-line @typescript-eslint/no-var-requires
connectReduxDevtools(require('remotedev'), rootStore);

function App() {
  return (
    <Provider store={store}>
      <MstContextProvider store={rootStore}>
        <GraphEditor
          viewDescrCollId={viewDescrCollConstr['@id']}
          viewDescrId={viewDescrs[0]['@id']}
          viewKindCollId={viewKindCollConstr['@id']}
          viewKindId={viewKinds[0]['@id']}
        />
      </MstContextProvider>
    </Provider>
  );
}

export default App;
