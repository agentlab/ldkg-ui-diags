import Plot from 'react-plotly.js';
import * as math from 'mathjs';

export const union = (iterables: any): Set<any> => {
  const set = new Set();
  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }
  return set;
};

export const now = (): number => {
  return performance.now();
};

export const Benchmark = ({ perfTest, length = 100, runs = 5, step = 1 }): any => {
  const results = [...Array(runs)].map((item, idx) => {
    console.log('Run: ', idx);
    return perfTest(length)
      .map((p, idx) => ({ p, idx }))
      .filter(({ idx }) => idx % step === 0);
  });
  console.log(results);

  const data = results[0].map((item, idx) => {
    const y = results.map((run) => run[idx].p);
    const mean = math.mean(y);
    const std = math.std(y);
    const yClear = y.filter((yi) => math.abs(yi - mean) < 2 * std);

    return {
      type: 'box',
      y: yClear,
      name: results[0][idx].idx,
      boxpoints: false,
      marker: { color: 'darkblue' },
    };
  });

  return (
    <Plot
      data={data}
      layout={{
        yaxis: {
          rangemode: 'tozero',
          title: 'мс',
        },
        xaxis: {
          title: 'число элементов',
        },
        showlegend: false,
      }}
    />
  );
};
