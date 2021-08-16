import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';

import { SparqlClientImpl, MstRepository, registerMstCollSchema } from '@agentlab/sparql-jsld-client';
import {
  MstContextProvider,
  MstViewDescr,
  MstViewKind,
  registerMstViewKindSchema,
  viewKindCollConstr,
  viewDescrCollConstr,
} from '@agentlab/ldkg-ui-react';

import { GraphEditor } from '../src/components/GraphEditor';
import { MstDiagramNodeVKElement, MstDiagramEdgeVKElement } from '../src/models/MstDiagramEditorSchemas';
import { classViewKinds, classViewDescrs, classModelInitialState } from '../src/stores/viewClass';

import '../src/index.css';
import '../src/App.css';

export default {
  title: 'GraphEditor/ClassDiagram',
  component: GraphEditor,
} as Meta;

const Template: Story<any> = (args: any) => {
  //@ts-ignore
  registerMstCollSchema('aldkg:ViewKind', MstViewKind);
  //@ts-ignore
  registerMstCollSchema('aldkg:ViewDescr', MstViewDescr);

  registerMstViewKindSchema('aldkg:DiagramNodeVKElement', MstDiagramNodeVKElement);
  registerMstViewKindSchema('aldkg:DiagramEdgeVKElement', MstDiagramEdgeVKElement);

  const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
  // for remote data from server
  //const rootStore = createModelFromState('mktp', client, rootModelInitialState, additionalColls);
  // for local hardcoded data
  //@ts-ignore
  const rootStore = MstRepository.create(classModelInitialState, { client });
  const store: any = asReduxStore(rootStore);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  connectReduxDevtools(require('remotedev'), rootStore);
  return (
    <Provider store={store}>
      <MstContextProvider store={rootStore}>
        <GraphEditor {...args} onSelect={(ids) => console.log('SELECTED: ', ids)} />
      </MstContextProvider>
    </Provider>
  );
};

export const LocalData = Template.bind({});
LocalData.args = {
  viewDescrCollId: viewDescrCollConstr['@id'],
  viewDescrId: classViewDescrs[0]['@id'],
  viewKindCollId: viewKindCollConstr['@id'],
  viewKindId: classViewKinds[0]['@id'],
};
