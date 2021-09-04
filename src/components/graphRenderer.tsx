import React, { useContext } from 'react';
import {
  compareByIri,
  MstContext,
  processViewKindOverride,
  RankedTester,
  rankWith,
  RenderProps,
  uiTypeIs,
} from '@agentlab/ldkg-ui-react';
import { getSnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import { Graph } from './diagram/Graph';

export const graphRendererTester: RankedTester = rankWith(2, uiTypeIs('aldkg:DiagramEditorVKElement'));
export const testTester: RankedTester = rankWith(2, uiTypeIs('test'));
const Test = (props) => {
  console.log('TEST');
  return <div>TEST</div>;
};

export const GraphRenderer = observer<RenderProps>((props) => {
  const { store } = useContext(MstContext);
  const { viewKind, viewDescr, form, enabled } = props;
  const [id, collIri, collIriOverride, inCollPath, viewKindElement, viewDescrElement] = processViewKindOverride(
    props,
    store,
  );

  const options = viewKindElement.options || {};
  const regStencils = (stencils, arr) => {
    arr.forEach((e) => {
      if (e.elements) {
        regStencils(stencils, e.elements);
      }
      if (e['@type'] === 'aldkg:DiagramNodeVKElement') {
        stencils[e['@id']] = e;
      }
    });
  };
  const stencilPanel: any = {};
  const viewKindStencils = ((viewKindElement as any)?.elements || []).reduce((acc, e) => {
    if (e.elements) {
      regStencils(acc, e.elements);
    }
    acc[e['@id']] = e;
    stencilPanel[e['@id']] = e;
    return acc;
  }, {});

  const dataSource = ((viewKindElement as any)?.elements || []).reduce((acc, e) => {
    if (e.resultsScope) {
      const dataUri = (viewDescr as any).collsConstrs.filter((el) => compareByIri(el['@parent'], e.resultsScope));
      if (dataUri.length > 0) {
        const graphData = store.getColl(dataUri[0]);
        acc[e['@id']] = graphData?.data ? getSnapshot(graphData?.data) : [];
      } else {
        console.log('No data for element', e);
      }
    }
    return acc;
  }, {});
  const scope = viewKindElement.resultsScope;
  const withConnections = options.connections;
  const onChange = (data: any) => {
    if (data) {
      store.setSelectedData(scope, data);
      withConnections && store.editConn(withConnections, data[0]);
    }
  };

  return (
    <Graph
      view={viewDescrElement}
      viewDescrObs={viewDescrElement}
      viewKindStencils={viewKindStencils}
      stencilPanel={stencilPanel}
      viewKind={viewKind?.elements[0]}
      dataSource={dataSource}
      onSelect={onChange}
    />
  );
});

export const graphRenderers = [
  { tester: graphRendererTester, renderer: GraphRenderer },
  { tester: testTester, renderer: Test },
];
