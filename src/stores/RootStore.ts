import { Repository } from '@agentlab/sparql-jsld-client';

export const createRootStoreFromState = (rmRepositoryParam, client, state: any) => {
  //@ts-ignore
  const initinitialState = Repository.create(state, { client });
  initinitialState.setId(rmRepositoryParam['Repository ID']);
  initinitialState.ns.reloadNs();
  return initinitialState;
};
