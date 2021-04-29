import * as kiwi from 'kiwi.js';
import React from 'react';
import Plot from 'react-plotly.js';
import { v4 as uuidv4 } from 'uuid';
import { calcNodeSize, updateVariables } from '../components/diagram/kiwiCore';

// for now use custom mocks
const event = (id_, shape_) => {
  let node = {
    id: id_,
    shape: shape_,
    _parent: null,
    _children: [],
    pos: { x: 10, y: 10 },

    store: {
      data: {
        id: id_,
      },
    },
    _model: {
      graph: {
        getCell(childId) {
          return node._children.find((child) => child.id === childId);
        },
      },
    },
    position() {
      return node.pos;
    },
    size() {
      return { width: 200, height: 40 };
    },
    resize() {},
    setPosition() {},
  };
  const e = {
    node: node,
    current: 'not null',
  };
  return e;
};

// TODO: move helper functions to separate file
function union(iterables) {
  const set = new Set();
  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }
  return set;
}

const embed = (parent, type, solver) => {
  let e = event(uuidv4(), type);
  const c1 = calcNodeSize(e, 'add', solver);
  parent.node._children.push(e.node);
  e.node._parent = parent.node;
  const c2 = calcNodeSize(e, 'embed', solver);
  return [e, new Set([...c1, ...c2])];
};

const addComplexRoot = (solver) => {
  const rootId = uuidv4();
  let root = event(rootId, 'group');
  const c1 = calcNodeSize(root, 'add', solver);
  const c2 = [...Array(2)].map(() => {
    let [comp, c2] = embed(root, 'compartment', solver);
    const c3 = [...Array(3)].map(() => {
      let [, c3] = embed(comp, 'field', solver);
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
    return [idx, round()];
  });
};

const perfTestMove = (length) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const root = addComplexRoot(solver);
    const start = performance.now();
    root.node.pos = { x: 100, y: 100 };
    const c = calcNodeSize(root, 'move', solver);
    updateVariables(c, solver);
    const end = performance.now();

    return end - start;
  };

  return [...Array(length)].map((_, idx) => {
    console.log(idx);
    return [idx, round()];
  });
};

const Benchmark = ({ perfTest }) => {
  const results = perfTest(100);

  console.log(results.length);
  return (
    <Plot
      data={[
        {
          x: results.map(([c, r]) => c),
          y: results.map(([c, r]) => r),
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
      ]}
    />
  );
};

export default {
  title: 'Test/Benchmark',
  component: Benchmark,
};

const Template = (args) => <Benchmark {...args} />;

export const AddComplexRoot = Template.bind({});
AddComplexRoot.args = {
  perfTest: perfTestAddComplexRoot,
};

export const Move = Template.bind({});
Move.args = {
  perfTest: perfTestMove,
};
