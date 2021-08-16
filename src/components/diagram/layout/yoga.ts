import Yoga, { Node } from 'yoga-layout-prebuilt';
import { Graph, Node as X6Node } from '@antv/x6';
import { Record, List } from 'immutable';
import { getRoot } from './kiwi';
const PositionRecord: any = Record({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const r: any = Record({
  width: 'auto',
  height: 'auto',
  minWidth: 0,
  minHeight: 0,
  maxWidth: NaN,
  maxHeight: NaN,
  justifyContent: Yoga.JUSTIFY_FLEX_START,
  alignItems: Yoga.ALIGN_STRETCH,
  alignSelf: Yoga.ALIGN_AUTO,
  alignContent: Yoga.ALIGN_STRETCH,
  flexDirection: Yoga.FLEX_DIRECTION_ROW,
  padding: PositionRecord(),
  margin: PositionRecord(),
  border: PositionRecord(),
  position: PositionRecord({
    left: NaN,
    top: NaN,
    right: NaN,
    bottom: NaN,
  }),
  positionType: Yoga.POSITION_TYPE_RELATIVE,
  flexWrap: Yoga.WRAP_NO_WRAP,
  flexBasis: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  children: List(),
  aspectRatio: 'auto',
});

const rehydrate = (node: any): any => {
  let record = r(node);
  record = record.set('padding', PositionRecord(record.padding));
  record = record.set('border', PositionRecord(record.border));
  record = record.set('margin', PositionRecord(record.margin));
  record = record.set('position', PositionRecord(record.position));
  record = record.set('children', List(record.children.map(rehydrate)));
  return record;
};

type Event = 'resize' | 'move' | 'add' | 'changeParent' | 'changeChildren' | 'remove';

export const addYogaSolver = ({ graph }: { graph: Graph }): void => {
  graph.on('cell:change:size', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    const changed = handleGraphEvent(e, 'resize', graph);
    updateVariables(changed, graph);
  });
  graph.on('node:moved', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    const changed = handleGraphEvent(e, 'move', graph);
    updateVariables(changed, graph);
  });
  graph.on('node:added', (e) => {
    const changed = handleGraphEvent(e, 'add', graph);
    updateVariables(changed, graph);
  });
  graph.on('node:change:parent', (e: any) => {
    const changed = handleGraphEvent(e, 'changeParent', graph);
    updateVariables(changed, graph);
  });
  graph.on('node:change:children', (e: any) => {
    const changed = handleGraphEvent(e, 'changeChildren', graph);
    updateVariables(changed, graph);
  });
  graph.on('node:removed', (e) => {
    const changed = handleGraphEvent(e, 'remove', graph);
    updateVariables(changed, graph);
  });
};

const defaultLayout = {
  width: 'auto',
  height: 'auto',
  minWidth: 0,
  minHeight: 0,
  maxWidth: 'none',
  maxHeight: 'none',
  justifyContent: Yoga.JUSTIFY_FLEX_START,
  alignItems: Yoga.ALIGN_STRETCH,
  alignSelf: Yoga.ALIGN_AUTO,
  alignContent: Yoga.ALIGN_STRETCH,
  flexDirection: Yoga.FLEX_DIRECTION_COLUMN,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  border: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  position: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  positionType: Yoga.POSITION_TYPE_RELATIVE,
  flexWrap: Yoga.WRAP_NO_WRAP,
  flexBasis: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  children: [],
  aspectRatio: 'auto',
};

const applyProperties = (props: { [key: string]: string | number | null | any }, node: Yoga.YogaNode) => {
  [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'alignContent',
    'flexGrow',
    'flexShrink',
    'positionType',
    'aspectRatio',
    'flexWrap',
    'flexDirection',
  ].forEach((key) => {
    try {
      const value = props[key] === '' ? defaultLayout[key] : props[key];
      node[`set${key[0].toUpperCase()}${key.substr(1)}`](value);
    } catch (e) {
      console.log(e);
    }
  });

  ['padding', 'margin', 'position', 'border'].forEach((key) => {
    ['top', 'right', 'bottom', 'left'].forEach((direction) => {
      try {
        node[`set${key[0].toUpperCase()}${key.substr(1)}`](
          Yoga[`EDGE_${direction.toUpperCase()}`],
          props[key][direction],
        );
      } catch (e) {
        console.log(e);
      }
    });
  });

  node.setDisplay(Yoga.DISPLAY_FLEX);
};

export const handleGraphEvent = (e: any, type: Event, graph: Graph): Set<any> => {
  const node: any = e.node || e.cell;
  let changedNodes = new Set<any>([node, getRoot(node)]);
  if (type === 'add') {
    addNode(node);
    if (node.hasParent()) {
      const changed = changeParent(null, node.getParent(), node, graph);
      changedNodes = new Set([...changedNodes, ...changed]);
    }
  } else if (type === 'changeParent') {
    const changed = changeParent(e.previous, e.current, node, graph);
    changedNodes = new Set([...changedNodes, ...changed]);
  } else if (type === 'move') {
    if (node.getParent() && !node.getStore().get().movable) {
      moveNode(node.getParent());
    }
    moveNode(node);
  } else if (type === 'resize') {
    resizeNode(node, graph);
  } else if (type === 'remove') {
    removeNode(node);
  } else if (type === 'changeChildren') {
    const changed = changeChildren(e.previous || [], e.current || [], node);
    changedNodes = new Set([...changedNodes, ...changed]);
  }
  return changedNodes;
};

export const updateVariables = (changedNodes: Set<any>, graph: Graph): void => {
  graph.history.disable();
  const updateNode = (node) => {
    const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
    const computedLayout = yogaNode.getComputedLayout();
    if (!node._parent) {
      setComputedSize(node, computedLayout); // set absolute position
    } else {
      // set position relative to parent
      const computedSize = {
        left: computedLayout.left + node._parent.position().x,
        top: computedLayout.top + node._parent.position().y,
        width: computedLayout.width,
        height: computedLayout.height,
      };
      setComputedSize(node, computedSize);
    }
  };

  const updateNodeTree = (parent) => {
    if (graph.hasCell(parent)) {
      updateNode(parent);
      (parent._children || []).forEach(updateNodeTree);
    }
  };
  [...changedNodes]
    .filter((node) => !node._parent)
    .forEach((node) => {
      const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
      yogaNode.calculateLayout();
      updateNodeTree(node);
    });
  graph.history.enable();
};

const changeParent = (previous: any, current: any, node: any, graph: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  let changedNodes = new Set<X6Node>([]);

  // remove from previous parent
  if (previous) {
    const previousParentNode = node._model.graph.getCell(previous);
    const previousParentYogaNode: Yoga.YogaNode = previousParentNode.store.data.yogaProps;
    const previousParentLayout = previousParentYogaNode.getComputedLayout();
    previousParentYogaNode.removeChild(yogaNode);
    if (previousParentYogaNode.getChildCount() === 0) {
      previousParentYogaNode.setWidth(previousParentLayout.width);
      previousParentYogaNode.setHeight(previousParentLayout.height);
    }
    changedNodes = new Set([...changedNodes, getRoot(previousParentNode)]);
    if (!current) {
      yogaNode.setWidth(previousParentLayout.width);
    }
  }
  // add to new parent
  if (current) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    const parentLayout = parentYogaNode.getComputedLayout();
    let idx = parentYogaNode.getChildCount();
    const order = node.store.data.order;
    if (Number.isInteger(order)) {
      (parentNode.store.data.nodes || []).forEach((node, index) => {
        if (order < node.store.data.order && idx > index) {
          idx = index;
        }
      });
    } else {
      node.store.data.order = idx;
    }
    parentYogaNode.insertChild(yogaNode, idx);
    if (parentNode.store.data.nodes) {
      parentNode.store.data.nodes.splice(idx, 0, node);
    } else {
      parentNode.store.data.nodes = [node];
    }

    const childLayout = yogaNode.getComputedLayout();
    parentYogaNode.setHeight('auto');
    if (childLayout.width >= parentLayout.width) {
      setChildParentsRelative(node);
      const rootNode = getRoot(node);
      const rootYogaNode: Yoga.YogaNode = rootNode.store.data.yogaProps;
      rootYogaNode.calculateLayout();
      const layout = rootYogaNode.getComputedLayout();
      setChildParentsWidth(node, '100%');
      rootYogaNode.setWidth(layout.width);
      rootYogaNode.setHeight(layout.height);
    }
    yogaNode.setWidth('100%');
    changedNodes = new Set([...changedNodes, getRoot(parentNode)]);
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

const changeChildren = (previous: string[], current: string[], node: any) => {
  const removed = previous.filter((x) => !current.includes(x));
  const added = current.filter((x) => !previous.includes(x));

  const changedIds = [...removed, ...added];
  const changedNodes = changedIds.map((nodeId) => (node._model.graph as Graph).getCell(nodeId));

  return node.getParent() ? new Set(changedNodes.map((node) => getRoot(node))) : new Set([]);
};

const removeNode = (node: any) => {
  // TODO: what is node at this point? does it exist inside graph?
  node.store.data.nodes = [];
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  if (node._parent) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    parentYogaNode.removeChild(yogaNode);
  }
};

const addNode = (node: any) => {
  const root = Node.create();
  applyProperties(
    rehydrate({
      alignItems: 'stretch',
      minHeight: 0,
      ...node.store.data.size,
      ...node.store.data.layoutProp,
    }),
    root,
  );
  root.setPosition(Yoga.EDGE_LEFT, node.position().x);
  root.setPosition(Yoga.EDGE_TOP, node.position().y);
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

const resizeNode = (node: any, graph: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  yogaNode.setWidth(node.size().width);
  yogaNode.setHeight(node.size().height);
  if (node._parent) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    const parentLayout = parentYogaNode.getComputedLayout();
    if (node.size().width >= parentLayout.width) {
      setChildParentsRelative(node);
      const rootNode = getRoot(node);
      const rootYogaNode: Yoga.YogaNode = rootNode.store.data.yogaProps;
      rootYogaNode.calculateLayout();
      const layout = rootYogaNode.getComputedLayout();
      setChildParentsWidth(node, '100%');
      rootYogaNode.setWidth(layout.width);
      rootYogaNode.setHeight(layout.height);
    }
    yogaNode.setWidth('100%');
  } else {
    yogaNode.setPosition(Yoga.EDGE_LEFT, node.position().x);
    yogaNode.setPosition(Yoga.EDGE_TOP, node.position().y);
  }
};

const setComputedSize = (node: X6Node, size: any) => {
  node.resize(size.width, size.height, {
    ignore: true,
  });
  node.setPosition(size.left, size.top, {
    ignore: true,
  });
};

const setNodeRelative = (yogaNode: any) => {
  yogaNode.setWidth('auto');
  yogaNode.setHeight('auto');
};

const setChildParentsRelative = (node: any) => {
  if (node.getParent()) {
    const parent = node.getParent();
    const parentYogaNode: Yoga.YogaNode = parent.store.data.yogaProps;
    setNodeRelative(parentYogaNode);
    setChildParentsRelative(parent);
  }
};

const setChildParentsWidth = (node: any, width: string) => {
  if (node.getParent()) {
    const parent = node.getParent();
    const parentYogaNode: Yoga.YogaNode = parent.store.data.yogaProps;
    parentYogaNode.setWidth(width);
    setChildParentsWidth(parent, width);
  }
};
