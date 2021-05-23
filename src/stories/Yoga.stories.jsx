import { v4 as uuidv4 } from 'uuid';
import { handleGraphEvent, updateVariables } from '../components/diagram/layout/yoga';
import { Benchmark, union, now } from './benchmarkCommon';
import { event } from '../test/node.mock';

const embed = (parent, type) => {
  let e = event(uuidv4(), type);
  const c1 = handleGraphEvent(e, 'add');
  parent.node._children.push(e.node);
  e.node._parent = parent.node;
  const c2 = handleGraphEvent(e, 'embed');
  return [e, new Set([...c1, ...c2])];
};

const addComplexRoot = () => {
  const rootId = uuidv4();
  let root = event(rootId, 'rm:ClassNodeStencil');
  const c1 = handleGraphEvent(root, 'add');
  const c2 = [...Array(2)].map(() => {
    let [comp, c2] = embed(root, 'rm:CompartmentNodeStencil');
    const c3 = [...Array(3)].map(() => {
      let [, c3] = embed(comp, 'rm:PropertyNodeStencil');
      return c3;
    });
    return union([c2, union(c3)]);
  });
  const changed = union([c1, union(c2)]);
  updateVariables(changed);
  return root;
};

const perfTestAddComplexRoot = (length) => {
  const round = () => {
    const start = now();
    addComplexRoot();
    const end = now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestMove = (length) => {
  const round = () => {
    const root = addComplexRoot();
    const start = now();
    root.node.pos = { x: 100, y: 100 };
    const c = handleGraphEvent(root, 'move');
    updateVariables(c);
    const end = now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestAddSimpleRoot = (length) => {
  const round = () => {
    const start = now();
    const root = event(uuidv4(), 'rm:ClassNodeStencil');
    const changed = handleGraphEvent(root, 'add');
    updateVariables(changed);
    const end = now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

const perfTestAddChildren = (length) => {
  let root = event(uuidv4(), 'rm:ClassNodeStencil');
  const c1 = handleGraphEvent(root, 'add');
  updateVariables(c1);

  const round = () => {
    const start = now();
    let [, changed] = embed(root, 'rm:PropertyNodeStencil');
    updateVariables(changed);
    const end = now();
    return end - start;
  };
  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return round();
  });
};

export default {
  title: 'Benchmark/Yoga',
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
