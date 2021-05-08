import React from 'react';
import { Story, Meta } from '@storybook/react';
import { getSnapshot } from 'mobx-state-tree';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl } from '@agentlab/sparql-jsld-client';

import { rdfServerUrl, rmRepositoryParam } from '../config';
import { GraphEditor } from '../components/GraphEditor';
import { RootContextProvider } from '../stores/RootContext';

import { createRootStoreFromState } from '../stores/RootStore';
import { rootModelInitialState3, viewDescrs } from '../stores/ViewCard';
import { viewDescrCollConstr } from '../stores/view';

import '../index.css';
import '../App.css';

const client = new SparqlClientImpl(rdfServerUrl);
const rootStore = createRootStoreFromState(rmRepositoryParam, client, rootModelInitialState3);
const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

const cc = getSnapshot(rootStore);
console.log(cc);

export default {
  title: 'GraphEditor/Cards',
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
};
