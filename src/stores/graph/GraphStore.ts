import { action, makeObservable, observable } from 'mobx'

export default class GraphStore {
  graph;
  nodes;

  constructor() {
    this.nodes = observable.set() as any
    makeObservable(this, {
      graph: observable.ref,
      nodes: observable,
      setGraph: action,
      getGraph: action,
      addNode: action,
      deleteNode: action
    })
  }

  setGraph(graph: any) {
    this.graph = graph;
  }

  getGraph() {
    return this.graph;
  }

  addNode(id: string) {
    this.nodes.add(id);
  }

  deleteNode(id: string) {
    this.nodes.delete(id);
  }
}

