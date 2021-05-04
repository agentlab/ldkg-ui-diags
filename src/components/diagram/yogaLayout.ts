import Yoga, { Node } from 'yoga-layout-prebuilt';
import { Graph, Node as X6Node } from '@antv/x6';
import { propogateUpdates, getRoot } from './kiwiCore';

export const addYogaSolver = ({ graph }: { graph: Graph }) => {
  graph.on('node:resized', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    handleGraphEvent(e, 'resize');
  });
  graph.on('node:moved', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    handleGraphEvent(e, 'move');
  });
  graph.on('node:added', (e) => {
    handleGraphEvent(e, 'add');
  });
  graph.on('node:change:parent', (e) => {
    handleGraphEvent(e, 'embed');
  });
  graph.on('node:removed', (e) => {
    handleGraphEvent(e, 'remove');
  });
};

const applyProperties = (properties: { [key: string]: string | number }, node: Yoga.YogaNode) => {
  Object.entries(properties).forEach(([key, value]) => {
    // TODO: forbid position property
    try {
      // see https://github.com/facebook/yoga/blob/cbf6495d66a7a8066d1354daa14d3bb1af19f6ef/website/src/components/Playground/src/YogaNode.js#L144
      node[`set${key[0].toUpperCase()}${key.substr(1)}`](value);
    } catch (e) {
      console.warn('Provided property-value pair is not supported - key: ' + key + ', value: ' + value);
    }
  });
};

const handleGraphEvent = (e: any, type: string) => {
  console.log(type, e);
  const node: X6Node = e.node;
  let changedNodes = new Set<any>([node, ...propogateUpdates(getRoot(node))]);

  if (type === 'add') {
    addNode(node);
  } else if (type === 'embed') {
    const changed = embedNode(e.previous, e.current, node);
    changedNodes = new Set([...changedNodes, ...changed]);
  } else if (type === 'move') {
    moveNode(node);
  } else if (type === 'resize') {
    resizeNode(node);
  } else if (type === 'remove') {
    removeNode(node);
  }

  [...changedNodes]
    .filter((node) => !node._parent)
    .forEach((node) => {
      const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
      yogaNode.calculateLayout();
    });

  changedNodes.forEach((node) => {
    const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
    const computedLayout = yogaNode.getComputedLayout();
    if (!node._parent) {
      // root n
      console.log(node, computedLayout);
      setCumputedSize(node, computedLayout); // set absolute position
    } else {
      const parentYogaNode: Yoga.YogaNode = node._parent.store.data.yogaProps;
      // set position relative to parent
      const computedSize = {
        left: computedLayout.left + parentYogaNode.getComputedLeft(),
        top: computedLayout.top + parentYogaNode.getComputedTop(),
        width: computedLayout.width,
        height: computedLayout.height,
      };
      console.log(node, computedSize);
      setCumputedSize(node, computedSize);
    }
  });
};

const embedNode = (previous: any, current: any, node: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  let changedNodes = new Set<Node>([]);

  // remove from previous parent
  if (previous) {
    const previousParentNode = node._model.graph.getCell(previous);
    const previousParentYogaNode: Yoga.YogaNode = previousParentNode.store.data.yogaProps;
    previousParentYogaNode.removeChild(yogaNode);
    changedNodes = new Set([...changedNodes, ...propogateUpdates(previousParentNode)]);
  }

  // add to new parent
  if (current) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    parentYogaNode.insertChild(yogaNode, 0); // TODO: add to bottom?
  }

  // update node position based on type
  if (node._parent) {
    yogaNode.setPosition(Yoga.EDGE_LEFT, 0);
    yogaNode.setPosition(Yoga.EDGE_TOP, 0);
  } else {
    yogaNode.setPosition(Yoga.EDGE_LEFT, node.position().x);
    yogaNode.setPosition(Yoga.EDGE_TOP, node.position().y);
  }

  return changedNodes;
};

const removeNode = (node: any) => {
  // TODO: what is node at this point? does it exist inside graph?
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  if (node._parent) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    parentYogaNode.removeChild(yogaNode);
  }
};

const addNode = (node: any) => {
  const root = Node.create();
  root.setPosition(Yoga.EDGE_LEFT, node.position().x);
  root.setPosition(Yoga.EDGE_TOP, node.position().y);
  // root.setMinWidth(120);
  // root.setMinHeight(20);
  root.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);

  applyProperties(
    {
      minWidth: 120,
      minHeight: 20,
      test: 'auto',
    },
    root,
  );

  node.store.data.yogaProps = root;
};

const moveNode = (node: any) => {
  if (!node._parent) {
    const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
    yogaNode.setPosition(Yoga.EDGE_LEFT, node.position().x);
    yogaNode.setPosition(Yoga.EDGE_TOP, node.position().y);
  }
};

const resizeNode = (node: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  yogaNode.setWidth(node.size().width);
  yogaNode.setHeight(node.size().height);
  if (!node._parent) {
    yogaNode.setPosition(Yoga.EDGE_LEFT, node.position().x);
    yogaNode.setPosition(Yoga.EDGE_TOP, node.position().y);
  }
};

const setCumputedSize = (node: X6Node, size: any) => {
  node.resize(size.width, size.height, {
    ignore: true,
  });
  node.setPosition(size.left, size.top, {
    ignore: true,
  });
};
