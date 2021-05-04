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

const embed = (parent, type, solver) => {
  let e = event(uuidv4(), type);
  const c1 = calcNodeSize(e, 'add', solver);
  parent.node._children.push(e.node);
  e.node._parent = parent.node;
  const c2 = calcNodeSize(e, 'embed', solver);
  return [e, new Set([...c1, ...c2])];
};

const addRoot = (solver) => {
  const rootId = uuidv4();
  let root = event(rootId, 'group');
  const c1 = calcNodeSize(root, 'add', solver);

  let [comp1, c2] = embed(root, 'compartment', solver);
  let [comp2, c3] = embed(root, 'compartment', solver);
  let [, c4] = embed(comp1, 'field', solver);
  let [, c5] = embed(comp1, 'field', solver);
  let [, c6] = embed(comp1, 'field', solver);
  let [, c7] = embed(comp2, 'field', solver);
  let [, c8] = embed(comp2, 'field', solver);
  let [, c9] = embed(comp2, 'field', solver);
  const changed = new Set([...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8, ...c9]);
  updateVariables(changed, solver);
  return root;
};

const perfTestAdd = (roundsCount, setResult) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const start = performance.now();
    addRoot(solver);
    const end = performance.now();

    return end - start;
  };
  [...Array(roundsCount)].forEach((_, idx) => {
    setResult((old) => {
      console.log(idx);
      return [...old, [idx, round()]];
    });
  });
};

const perfTestMove = (roundsCount, setResult) => {
  const solver = new kiwi.Solver();
  const round = () => {
    const root = addRoot(solver);
    const start = performance.now();
    root.node.pos = { x: 100, y: 100 };
    const c = calcNodeSize(root, 'move', solver);
    updateVariables(c, solver);
    const end = performance.now();

    return end - start;
  };
  [...Array(roundsCount)].forEach((_, idx) => {
    setResult((old) => {
      console.log(idx);
      return [...old, [idx, round()]];
    });
  });
};

const Benchmark = ({ perfTest }) => {
  const [results, setResult] = React.useState([]);
  React.useEffect(() => {
    perfTest(100, setResult);
  }, [perfTest]);

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

export const Add = Template.bind({});
Add.args = {
  perfTest: perfTestAdd,
};

export const Move = Template.bind({});
Move.args = {
  perfTest: perfTestMove,
};
