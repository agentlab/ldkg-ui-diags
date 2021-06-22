import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';
import { SparqlClientImpl, Repository } from '@agentlab/sparql-jsld-client';
import { MstContextProvider } from '@agentlab/ldkg-ui-react';

import { Graph } from '../src/components/diagram/Graph';

import { mktpModelInitialState, mktpViewDescrs, mktpViewKinds } from '../src/stores/ViewCard';
import { viewDescrCollConstr } from '../src/stores/view';
import { viewKindCollConstr } from '../src/stores/viewKinds';
import { getSnapshot } from 'mobx-state-tree';
import { Spin } from 'antd';
import { MstContext } from '@agentlab/ldkg-ui-react';

import '../src/index.css';
import '../src/App.css';

const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
//@ts-ignore
const rootStore = Repository.create(mktpModelInitialState, { client });
const store: any = asReduxStore(rootStore);
// eslint-disable-next-line @typescript-eslint/no-var-requires
connectReduxDevtools(require('remotedev'), rootStore);

const GraphEditor = ({ viewDescrCollId, viewDescrId, viewKindCollId, viewKindId, args }: any) => {
  const { rootStore } = React.useContext(MstContext);
  if (!rootStore) {
    console.log('!rootStore', rootStore);
    return <Spin />;
  }

  const collWithViewDescrsObs = rootStore.getColl(viewDescrCollId);
  if (!collWithViewDescrsObs) {
    console.log('!collWithViewDescrsObs', viewDescrCollId);
    return <Spin />;
  }

  const viewDescrObs = collWithViewDescrsObs?.dataByIri(viewDescrId);
  if (!viewDescrObs) {
    console.log('!viewDescrObs', viewDescrId);
    return <Spin />;
  }

  const collWithViewKindsObs = rootStore.getColl(viewKindCollId);
  if (!collWithViewKindsObs) {
    console.log('!collWithViewKindsObs', viewKindCollId);
    return <Spin />;
  }
  const viewKindObs = collWithViewKindsObs?.dataIntrnl[0];
  if (!viewKindObs) {
    console.log('!viewKindObs', viewKindId);
    return <Spin />;
  }
  const viewKind: any = getSnapshot(viewKindObs);
  const view: any = getSnapshot(viewDescrObs);

  const regStencils = (stencils, arr) => {
    arr.forEach((e) => {
      if (e.elements) {
        regStencils(stencils, e.elements);
      }
      if (e.type === 'DiagramNode') {
        stencils[e['@id']] = e;
      }
    });
  };
  const stencilPanel: any = {};
  const viewKindStencils = viewKind?.elements.reduce((acc, e) => {
    if (e.elements) {
      regStencils(acc, e.elements);
    }
    acc[e['@id']] = e;
    stencilPanel[e['@id']] = e;
    return acc;
  }, {});

  const dataSource = viewKind?.elements.reduce((acc, e) => {
    const dataUri = view.collsConstrs.filter((el) => el['@parent'] === e.resultsScope);
    const graphData = rootStore.getColl(dataUri[0]);
    acc[e['@id']] = graphData?.data ? getSnapshot(graphData?.data) : [];
    return acc;
  }, {});

  const newView = { ...view, ...{ options: { ...view.options, ...args } } };
  return (
    <Graph
      view={newView}
      viewDescrObs={viewDescrObs}
      viewKindStencils={viewKindStencils}
      stencilPanel={stencilPanel}
      viewKind={viewKind}
      dataSource={dataSource}
    />
  );
};

const Template: Story<any> = (args: any) => {
  return (
    <Provider store={store}>
      <MstContextProvider rootStore={rootStore}>
        <GraphEditor
          args={args}
          viewDescrCollId={viewDescrCollConstr['@id']}
          viewDescrId={mktpViewDescrs[0]['@id']}
          viewKindCollId={viewKindCollConstr['@id']}
          viewKindId={mktpViewKinds[0]['@id']}
        />
      </MstContextProvider>
    </Provider>
  );
};

export default {
  title: 'GraphEditor/CardsDiagram',
  component: Template,
} as Meta;

export const GraphOptions = Template.bind({});
GraphOptions.args = {
  title: true,
  minimap: false,
  configPanel: false,
  toolbar: false,
};
