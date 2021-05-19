import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl } from '@agentlab/sparql-jsld-client';

import { rdfServerUrl, rmRepositoryParam } from '../config';
import { GraphEditor } from '../components/GraphEditor';
import { RootContextProvider } from '../stores/RootContext';

import { createRootStoreFromState } from '../stores/RootStore';
import { viewDescrCollConstr, rootModelInitialState2, viewDescrs } from '../stores/view';
import { viewKinds, viewKindCollConstr } from '../stores/viewKinds';
import '../index.css';
import '../App.css';

const client = new SparqlClientImpl(rdfServerUrl);
const rootStore = createRootStoreFromState(rmRepositoryParam, client, rootModelInitialState2);
const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

export default {
  title: 'GraphEditor/ClassDiagram',
  component: GraphEditor,
} as Meta;

const Template: Story<any> = (args: any) => (
  <Provider store={store}>
    <RootContextProvider rootStore={rootStore}>
      <GraphEditor {...args} />
    </RootContextProvider>
  </Provider>
);

export const Add = Template.bind({});
Add.args = {
  viewDescrCollId: viewDescrCollConstr['@id'],
  viewDescrId: viewDescrs[0]['@id'],
  viewKindCollId: viewKindCollConstr['@id'],
  viewKindId: viewKinds[0]['@id'],
};
