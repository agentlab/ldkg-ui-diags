import Plot from 'react-plotly.js';

// for now use custom mocks
export const event = (id_, shape_) => {
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

export const union = (iterables) => {
  const set = new Set();
  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }
  return set;
};

export const median = (runList) => {
  return [...Array(runList[0].length)].map((_, idx) => {
    const numbers = runList.map((run) => run[idx]);
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  });
};

export const Benchmark = ({ perfTest, length = 100, runs = 5 }) => {
  const results = [...Array(runs)].map((_, idx) => {
    console.log('Run: ', idx);
    return perfTest(length);
  });
  console.log(results);
  const aggregated = median(results);
  return (
    <Plot
      data={[
        {
          x: Array.from(Array(length).keys()),
          y: aggregated,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
      ]}
      layout={{
        yaxis: {
          rangemode: 'tozero',
        },
      }}
    />
  );
};
