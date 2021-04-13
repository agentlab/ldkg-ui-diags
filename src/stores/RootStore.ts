import { when } from 'mobx';
import moment from "moment";

import { Repository, rootModelInitialState, SparqlClientImpl } from "@agentlab/sparql-jsld-client";

import { rdfServerUrl, rmRepositoryParam } from '../config';
import { viewDataProperties, viewDataShapes, viewDescrCollConstr, viewDescrs } from './view';
import { viewKindCollConstr, viewKinds } from "./viewKinds";

const client = new SparqlClientImpl(rdfServerUrl);
const rootModelInitialState2 = {
	...rootModelInitialState,
	colls: {
		...rootModelInitialState.colls,
		// ViewDescr
		/*[viewDescrCollConstr['@id']]: {
			'@id': viewDescrCollConstr['@id'],
			collConstr: viewDescrCollConstr,
			dataIntrnl: viewDescrs,
			updPeriod: undefined,
			lastSynced: moment.now(),
			//resolveCollConstrs: false,
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
			collConstr: viewDescrs[0].collsConstrs?.[0]['@id'],
			dataIntrnl: viewDataShapes,
			updPeriod: undefined,
			lastSynced: moment.now(),
			resolveCollConstrs: false,
		},
		[viewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
			'@id': viewDescrs[0].collsConstrs?.[1]['@id'],
			collConstr: viewDescrs[0].collsConstrs?.[1]['@id'],
			dataIntrnl: viewDataProperties,
			updPeriod: undefined,
			lastSynced: moment.now(),
			resolveCollConstrs: false,
		},*/
	},
};

//@ts-ignore
let initialState = Repository.create(rootModelInitialState2, { client });
export const rootStore = initialState;

rootStore.setId(rmRepositoryParam['Repository ID']);
rootStore.ns.reloadNs();

when(
	()=> Object.keys(rootStore.ns.currentJs).length > 5 && !rootStore.getColl(viewDescrCollConstr['@id']),
	()=> {
		const coll0 = rootStore.addColl(
			viewDescrCollConstr,
			{
				updPeriod: undefined,
				lastSynced: moment.now(),
				//resolveCollConstrs: false,
			},
			viewDescrs
		);
		if (!coll0) {
		  console.warn('coll0 is undefined');
		}
	}
);
