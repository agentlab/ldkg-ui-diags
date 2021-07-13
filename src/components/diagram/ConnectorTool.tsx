import React from 'react';
import { Graph, Markup } from '@antv/x6';
import ReactDOM from 'react-dom';
import { stencils } from './stencils';

export const edgeExamples = [
  {
    label: {
      markup: [{ ...Markup.getForeignObjectMarkup() }],
      attrs: {
        fo: {
          label: 'похожесть',
          width: 1,
          height: 1,
          x: 60,
          y: -10,
        },
      },
    },
    attrs: {
      line: {
        stroke: '#808080',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          fill: '#808080',
        },
      },
    },
  },
  {
    label: {
      markup: [{ ...Markup.getForeignObjectMarkup() }],
      attrs: {
        fo: {
          label: 'в категории',
          width: 1,
          height: 1,
          x: 60,
          y: -10,
        },
      },
    },
    attrs: {
      line: {
        stroke: '#808080',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          open: true,
        },
      },
    },
  },
  {
    label: {
      markup: [{ ...Markup.getForeignObjectMarkup() }],
      attrs: {
        fo: {
          label: 'подкатегория',
          width: 1,
          height: 1,
          x: 60,
          y: -10,
        },
      },
    },
    attrs: {
      line: {
        stroke: '#808080',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          fill: 'white',
        },
      },
    },
  },
];

const defOnSelect = (itemIdx: number) => console.log('Selected edge: ', itemIdx);

export const ConnectorTool = ({ edges = edgeExamples, onSelect = defOnSelect }: any) => {
  const refContainer = React.useRef<HTMLDivElement | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [graph, setGraph] = React.useState<Graph | null>(null);

  const selectedBoundary = {
    name: 'selected-boundary',
    value: {
      inherit: 'boundary',
      padding: 6,
    },
  };
  const hoverBoundary = {
    name: 'hover-boundary',
    value: {
      inherit: 'boundary',
      padding: 6,
      attrs: {
        fill: '#7c68fc',
        stroke: '#9254de',
        strokeWidth: 1,
        fillOpacity: 0.2,
      },
    },
  };

  const width = 120;
  const height = 200;
  const itemHeight = 30;

  React.useEffect(() => {
    if (!refContainer || !refContainer.current) {
      return;
    }
    const g = new Graph({
      container: refContainer.current,
      width: width,
      height: height,
      interacting: false,
      onEdgeLabelRendered: (args) => {
        const { selectors, label } = args;
        const edge: any = args.edge;
        const Renderer = stencils['defaultLabel'];
        const content = selectors.foContent as HTMLDivElement;
        if (content) {
          ReactDOM.render(
            <Renderer
              parent={selectors.fo}
              label={label?.attrs?.fo.label}
              editable={edge.store.data.editable}
              onSave={() => {
                /*do nothing*/
              }}
            />,
            content,
          );
        }
      },
    });
    edges.forEach((edge, idx) =>
      g.addEdge({
        id: String(idx),
        editable: false,
        source: [10, 10 + idx * itemHeight],
        target: [width - 10, 10 + idx * itemHeight],
        ...edge,
      }),
    );
    Graph.registerEdgeTool(hoverBoundary.name, hoverBoundary.value, true);
    Graph.registerEdgeTool(selectedBoundary.name, selectedBoundary.value, true);
    setGraph(g);
  }, [refContainer]);

  React.useEffect(() => {
    if (!graph) {
      return;
    }

    graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools(hoverBoundary.name);
    });
    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTool(hoverBoundary.name);
    });
    graph.on('edge:click', ({ edge }) => {
      const itemIdx = Number(edge.id);
      setSelectedIdx(itemIdx);
      onSelect(itemIdx);
    });
  }, [graph]);

  React.useEffect(() => {
    if (!graph || selectedIdx === null) {
      return;
    }

    graph.getEdges().forEach((e) => e.removeTool(selectedBoundary.name));
    graph.getCellById(String(selectedIdx)).addTools(selectedBoundary.name);
  }, [graph, selectedIdx]);

  return <div ref={refContainer}></div>;
};
