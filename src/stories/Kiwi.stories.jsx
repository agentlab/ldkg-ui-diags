import * as kiwi from 'kiwi.js';
import { v4 as uuidv4 } from 'uuid';
import { addNewParentNodes, createGraph } from '../components/diagram/graphCore';
import { handleGraphEvent, updateVariables, addKiwiSolver } from '../components/diagram/layout/kiwi';
import { Benchmark, event, union } from './benchmarkCommon';

const embed = (parent, type, solver) => {
  let e = event(uuidv4(), type);
  const c1 = handleGraphEvent(e, 'add', solver);
  parent.node._children.push(e.node);
  e.node._parent = parent.node;
  const c2 = handleGraphEvent(e, 'embed', solver);
  return [e, new Set([...c1, ...c2])];
};

const addComplexRoot = (solver) => {
  const rootId = uuidv4();
  let root = event(rootId, 'rm:ClassNodeStencil');
  const c1 = handleGraphEvent(root, 'add', solver);
  const c2 = [...Array(2)].map(() => {
    let [comp, c2] = embed(root, 'rm:CompartmentNodeStencil', solver);
    const c3 = [...Array(3)].map(() => {
      let [, c3] = embed(comp, 'rm:PropertyNodeStencil', solver);
      return c3;
    });
    return union([c2, union(c3)]);
  });
  const changed = union([c1, union(c2)]);
  updateVariables(changed, solver);
  return root;
};

const perfTestAddComplexRoot = (length) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const start = performance.now();
    addComplexRoot(solver);
    const end = performance.now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestMove = (length) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const root = addComplexRoot(solver);
    const start = performance.now();
    root.node.pos = { x: 100, y: 100 };
    const c = handleGraphEvent(root, 'move', solver);
    updateVariables(c, solver);
    const end = performance.now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestAddSimpleRoot = (length) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const start = performance.now();
    const root = event(uuidv4(), 'rm:ClassNodeStencil');
    const changed = handleGraphEvent(root, 'add', solver);
    updateVariables(changed, solver);
    const end = performance.now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestAddChildren = (length) => {
  const solver = new kiwi.Solver();
  let root = event(uuidv4(), 'rm:ClassNodeStencil');
  const c1 = handleGraphEvent(root, 'add', solver);
  updateVariables(c1, solver);

  const round = () => {
    const start = performance.now();
    let [, changed] = embed(root, 'rm:PropertyNodeStencil', solver);
    updateVariables(changed, solver);
    const end = performance.now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestAddSimpleRootX6 = (length) => {
  const container = document.createElement('div');
  const minimap = document.createElement('div');
  const graph = createGraph({
    height: 100,
    width: 100,
    refContainer: { current: container },
    minimapContainer: { current: minimap },
  });
  addKiwiSolver({ graph: graph });
  const round = () => {
    const start = performance.now();
    addNewParentNodes({
      graph: graph,
      nodesData: [
        {
          '@id': uuidv4(),
          height: 100,
          width: 100,
          x: 10,
          y: 10,
          shape: 'rm:ClassNodeStencil',
        },
      ],
    });
    const end = performance.now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

export default {
  title: 'Benchmark/Kiwi',
  component: Benchmark,
};

const Template = (args) => <Benchmark {...args} />;

export const AddComplexRoot = Template.bind({});
AddComplexRoot.args = {
  perfTest: perfTestAddComplexRoot,
  length: 50,
  runs: 10,
};

export const Move = Template.bind({});
Move.args = {
  perfTest: perfTestMove,
  length: 50,
  runs: 10,
};

export const AddSimpleRoot = Template.bind({});
AddSimpleRoot.args = {
  perfTest: perfTestAddSimpleRoot,
  runs: 10,
};

export const AddChildren = Template.bind({});
AddChildren.args = {
  perfTest: perfTestAddChildren,
  length: 50,
  runs: 5,
};

export const AddSimpleRootX6 = Template.bind({});
AddSimpleRootX6.args = {
  perfTest: perfTestAddSimpleRootX6,
  runs: 20,
  length: 100,
};
