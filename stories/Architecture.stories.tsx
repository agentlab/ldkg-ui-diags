import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl, Repository } from '@agentlab/sparql-jsld-client';
import { MstContextProvider } from '@agentlab/ldkg-ui-react';

import { GraphEditor } from '../src/components/GraphEditor';

import { archModelInitialState, archViewDescrs, archViewKinds } from '../src/stores/ViewArch';
import { viewDescrCollConstr } from '../src/stores/view';
import { viewKindCollConstr } from '../src/stores/viewKinds';

import '../src/index.css';
import '../src/App.css';

const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
//@ts-ignore
const rootStore = Repository.create(archModelInitialState, { client });
const store: any = asReduxStore(rootStore);
// eslint-disable-next-line @typescript-eslint/no-var-requires
connectReduxDevtools(require('remotedev'), rootStore);

export default {
  title: 'GraphEditor/ArchDiagram',
  component: GraphEditor,
} as Meta;

const Template: Story<any> = (args: any) => (
  <Provider store={store}>
    <MstContextProvider store={rootStore}>
      <GraphEditor {...args} />
    </MstContextProvider>
  </Provider>
);

export const LocalData = Template.bind({});
LocalData.args = {
  viewDescrCollId: viewDescrCollConstr['@id'],
  viewDescrId: archViewDescrs[0]['@id'],
  viewKindCollId: viewKindCollConstr['@id'],
  viewKindId: archViewKinds[0]['@id'],
};
