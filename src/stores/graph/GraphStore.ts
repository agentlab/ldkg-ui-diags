import { action, observable } from 'mobx'

export const graphStoreConstr = () => ({
  graph: undefined as any,
  nodes: observable.set() as any,
  setGraph(graph: any) {
    this.graph = graph;
  },
  getGraph() {
    return this.graph;
  },
  addNode(id: string) {
    this.nodes.add(id);
  },
  deleteNode(id: string) {
    this.nodes.delete(id);
  },
});

export const graphStoreAnnot = {
  graph: observable.ref,
  nodes: observable,
  setGraph: action,
  getGraph: action,
  addNode: action,
  deleteNode: action,
}