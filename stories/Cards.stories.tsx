import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl, Repository } from '@agentlab/sparql-jsld-client';

import { GraphEditor } from '../src/components/GraphEditor';
import { RootContextProvider } from '../src/stores/RootContext';

import { rootModelInitialState3, viewDescrs, viewKinds } from '../src/stores/ViewCard';
import { viewDescrCollConstr } from '../src/stores/view';
import { viewKindCollConstr } from '../src/stores/viewKinds';

import '../src/index.css';
import '../src/App.css';

const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
//const rootStore = createRootStoreFromState('mktp', client, rootModelInitialState3);
//@ts-ignore
const rootStore = Repository.create(rootModelInitialState3, { client });
const store: any = asReduxStore(rootStore);
// eslint-disable-next-line @typescript-eslint/no-var-requires
connectReduxDevtools(require('remotedev'), rootStore);

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
  viewKindCollId: viewKindCollConstr['@id'],
  viewKindId: viewKinds[0]['@id'],
};
