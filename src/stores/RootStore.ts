import { when } from 'mobx';
import moment from 'moment';

import { Repository, rootModelInitialState, SparqlClientImpl } from '@agentlab/sparql-jsld-client';

import { rdfServerUrl, rmRepositoryParam } from '../config';
import {
  viewDataRootNodes,
  viewDataChildNodes,
  viewDataArrows,
  viewDescrCollConstr,
  viewDescrs,
  viewDescrCollConstr0,
  viewDescrs0,
  viewDataRootCardNodes,
} from './view';
//import { viewKindCollConstr, viewKinds } from "./viewKinds";

const client = new SparqlClientImpl(rdfServerUrl);
const rootModelInitialState2 = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    // ViewDescr
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: viewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewKindDescr
    //[viewKindCollConstr['@id']]: {
    //	'@id': viewKindCollConstr['@id'],
    //	collConstr: viewKindCollConstr,
    //	dataIntrnl: viewKinds,
    //	updPeriod: undefined,
    //	lastSynced: moment.now(),
    //	resolveCollConstrs: false,
    //},

    // Data
    [viewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[1]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[1]['@id'], // reference by @id
      dataIntrnl: viewDataChildNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};

const rootModelInitialState3 = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: viewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootCardNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};

//@ts-ignore
let initialState = Repository.create(rootModelInitialState3, { client });
export const rootStore = initialState;

rootStore.setId(rmRepositoryParam['Repository ID']);
rootStore.ns.reloadNs();

/*when(
	()=> Object.keys(rootStore.ns.currentJs).length > 5 && !rootStore.getColl(viewDescrCollConstr['@id']),
	()=> {
		const coll0 = rootStore.addColl(
			viewDescrCollConstr0,
			{
				updPeriod: undefined,
				lastSynced: moment.now(),
			},
			viewDescrs0
		);
		if (!coll0) {
		  console.warn('coll0 is undefined');
		}
	}
);
*/
