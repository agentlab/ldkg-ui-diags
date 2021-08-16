import { cloneDeep } from 'lodash-es';
import React, { useContext } from 'react';
import { Story, Meta } from '@storybook/react';

import { getSnapshot, applySnapshot } from 'mobx-state-tree';
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
  MstContext,
} from '@agentlab/ldkg-ui-react';

import { GraphEditor } from '../src/components/GraphEditor';
import { MstDiagramNodeVKElement, MstDiagramEdgeVKElement } from '../src/models/MstDiagramEditorSchemas';
import { mktpModelInitialState, mktpViewDescrs, mktpViewKinds } from '../src/stores/ViewCard';

import { Spin } from 'antd';

import '../src/index.css';
import '../src/App.css';

const StoryEditor = ({ args }) => {
  const { store } = useContext(MstContext);
  const collWithViewDescrsObs = store.getColl(viewDescrCollConstr['@id']);
  if (!collWithViewDescrsObs) {
    console.log('!collWithViewDescrsObs', viewDescrCollConstr['@id']);
    return <Spin />;
  }

  const viewDescrObs = collWithViewDescrsObs?.dataByIri(mktpViewDescrs[0]['@id']);
  if (!viewDescrObs) {
    console.log('!viewDescrObs', mktpViewDescrs[0]['@id']);
    return <Spin />;
  }
  const viewElem = cloneDeep(getSnapshot(viewDescrObs?.elements[0]));
  (viewElem as any).options = { ...(viewElem as any).options, ...args };
  applySnapshot(viewDescrObs?.elements[0], viewElem);
  return (
    <GraphEditor
      viewDescrCollId={viewDescrCollConstr['@id']}
      viewDescrId={mktpViewDescrs[0]['@id']}
      viewKindCollId={viewKindCollConstr['@id']}
      /*viewKindId={mktpViewKinds[0]['@id']}*/
    />
  );
};
const Template: Story<any> = (args: any) => {
  //@ts-ignore
  registerMstCollSchema('aldkg:ViewKind', MstViewKind);
  //@ts-ignore
  registerMstCollSchema('aldkg:ViewDescr', MstViewDescr);

  registerMstViewKindSchema('aldkg:DiagramNodeVKElement', MstDiagramNodeVKElement);
  registerMstViewKindSchema('aldkg:DiagramEdgeVKElement', MstDiagramEdgeVKElement);

  const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
  //@ts-ignore
  const rootStore = MstRepository.create(mktpModelInitialState, { client });
  const store: any = asReduxStore(rootStore);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  connectReduxDevtools(require('remotedev'), rootStore);
  return (
    <Provider store={store}>
      <MstContextProvider store={rootStore}>
        <StoryEditor args={args} />
      </MstContextProvider>
    </Provider>
  );
};

export default {
  title: 'GraphEditor/CardsDiagramOptions',
  component: Template,
} as Meta;

export const GraphOptions = Template.bind({});
GraphOptions.args = {
  title: true,
  minimap: true,
  configPanel: true,
  toolbar: true,
};
