import React, { useContext } from 'react';
import { getSnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd';
import { MstContext } from '@agentlab/ldkg-ui-react';

import { Graph } from './diagram/Graph';

export interface GraphEditorProps {
  viewDescrCollId: string;
  viewDescrId: string;
  viewKindCollId: string;
  onSelect?: () => void;
}
export const GraphEditor = observer<GraphEditorProps>(
  ({ viewDescrCollId, viewDescrId, viewKindCollId, onSelect = () => null }) => {
    const { store } = useContext(MstContext);
    if (!store) {
      console.log('!store', store);
      return <Spin />;
    }

    const collWithViewDescrsObs = store.getColl(viewDescrCollId);
    if (!collWithViewDescrsObs) {
      console.log('!collWithViewDescrsObs', viewDescrCollId);
      return <Spin />;
    }

    const viewDescrObs = collWithViewDescrsObs?.dataByIri(viewDescrId);
    if (!viewDescrObs) {
      console.log('!viewDescrObs', viewDescrId);
      return <Spin />;
    }

    //const collWithViewKindsObs = store.getColl(viewKindCollId);
    //if (!collWithViewKindsObs) {
    //  console.log('!collWithViewKindsObs', viewKindCollId);
    //  return <Spin />;
    //}
    //const viewKindId = viewDescrObs.viewKind;
    //const viewKindObs = collWithViewKindsObs.dataByIri(viewKindId);
    const viewKindObs = viewDescrObs.viewKind;
    if (!viewKindObs) {
      console.log('!viewKindObs for viewDescr', getSnapshot(viewDescrObs));
      return <Spin />;
    }
    const viewKind: any = getSnapshot(viewKindObs);
    const view: any = getSnapshot(viewDescrObs);

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
    const viewKindStencils = viewKind?.elements[0]?.elements.reduce((acc, e) => {
      if (e.elements) {
        regStencils(acc, e.elements);
      }
      acc[e['@id']] = e;
      stencilPanel[e['@id']] = e;
      return acc;
    }, {});

    const dataSource = viewKind?.elements[0]?.elements.reduce((acc, e) => {
      if (e.resultsScope) {
        const dataUri = view.collsConstrs.filter((el) => el['@parent'] === e.resultsScope);
        if (dataUri.length > 0) {
          const graphData = store.getColl(dataUri[0]);
          acc[e['@id']] = graphData?.data ? getSnapshot(graphData?.data) : [];
        } else {
          console.log('No data for element', e);
        }
      }
      return acc;
    }, {});

    //console.log('Graph Data', { dataSource, viewKindStencils });

    return (
      <Graph
        view={view?.elements[0]}
        viewDescrObs={viewDescrObs?.elements[0]}
        viewKindStencils={viewKindStencils}
        stencilPanel={stencilPanel}
        viewKind={viewKind?.elements[0]}
        dataSource={dataSource}
        onSelect={onSelect}
      />
    );
  },
);
