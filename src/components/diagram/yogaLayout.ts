import Yoga, { Node } from 'yoga-layout-prebuilt';
import { Graph, Node as X6Node } from '@antv/x6';

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

  for (const n of changedNodes) {
    if (!n._parent) {
      // root node
      const yogaNode: Yoga.YogaNode = n.store.data.yogaProps;
      yogaNode.calculateLayout();
    }
  }

  for (const n of changedNodes) {
    updateNodeRecursive(n);
  }
};

const updateNodeRecursive = (node: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  const computedLayout = yogaNode.getComputedLayout();
  if (!node._parent) {
    // root node
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
  // console.log('children', node._children);
  // node._children?.forEach((childNode: any) => updateNodeRecursive(childNode));
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
  root.setMinWidth(120);
  root.setMinHeight(20);
  root.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);

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

const getRoot = (node: any) => {
  let current = node;
  while (current._parent) {
    current = current._parent;
  }
  return current;
};

const propogateUpdates = (rootNode: any) => {
  let changedNodes = new Set<Node>([rootNode]);
  const current = rootNode;
  if (!current || !current._children) {
    return changedNodes;
  }
  for (const childNode of current._children) {
    changedNodes = new Set([...changedNodes, ...propogateUpdates(childNode)]);
  }
  return changedNodes;
};
