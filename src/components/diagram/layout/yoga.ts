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
  maxWidth: 'none',
  maxHeight: 'none',
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

const nodeConfig = {
  'rm:PropertyNodeStencil': {},
  'rm:CompartmentNodeStencil': {
    paddingTop: 20,
    paddingLeft: 1,
    paddingRight: 1,
    paddingBottom: 1,
  },
  'rm:PropertiesCompartmentNodeStencil': {
    padding: {
      top: 28,
      left: 3,
      right: 3,
      bottom: 3,
    },
  },
  'rm:ClassNodeStencil': {
    padding: {
      top: 28,
      left: 3,
      right: 3,
      bottom: 3,
    },
    flexDirection: 'row',
    alignItems: 'stretch',
  },
};

type Event = 'resize' | 'move' | 'add' | 'changeParent' | 'changeChildren' | 'remove';

export const addYogaSolver = ({ graph }: { graph: Graph }) => {
  graph.on('node:resized', (e: any) => {
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
    handleGraphEvent(e, 'changeParent', graph);
    // do not update variables, at this point parent node has outdated children array
    // following `node:change:children` event will do the job
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
    } catch (e) {}
  });

  ['padding', 'margin', 'position', 'border'].forEach((key) => {
    ['top', 'right', 'bottom', 'left'].forEach((direction) => {
      try {
        node[`set${key[0].toUpperCase()}${key.substr(1)}`](
          Yoga[`EDGE_${direction.toUpperCase()}`],
          props[key][direction],
        );
      } catch (e) {}
    });
  });

  node.setDisplay(Yoga.DISPLAY_FLEX);
};

export const handleGraphEvent = (e: any, type: Event, graph: any) => {
  const node: X6Node = e.node;
  let changedNodes = new Set<any>([node, getRoot(node)]);
  if (type === 'add') {
    addNode(node);
    if (node.hasParent()) {
      const changed = changeParent(null, node, node, graph);
      changedNodes = new Set([...changedNodes, ...changed]);
    }
  } else if (type === 'changeParent') {
    const changed = changeParent(e.previous, e.current, node, graph);
    changedNodes = new Set([...changedNodes, ...changed]);
  } else if (type === 'move') {
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

export const updateVariables = (changedNodes: Set<any>, graph: any) => {
  const updateNode = (node) => {
    const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
    const computedLayout = yogaNode.getComputedLayout();
    if (yogaNode.getChildCount() === 0) {
      yogaNode.setWidth(computedLayout.width);
    } else {
      yogaNode.setWidth('auto');
    }
    if (!node._parent) {
      setCumputedSize(node, computedLayout); // set absolute position
    } else {
      // set position relative to parent
      const computedSize = {
        left: computedLayout.left + node._parent.position().x,
        top: computedLayout.top + node._parent.position().y,
        width: computedLayout.width,
        height: computedLayout.height,
      };
      setCumputedSize(node, computedSize);
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
};

const changeParent = (previous: any, current: any, node: any, graph: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  let changedNodes = new Set<Node>([]);

  // remove from previous parent
  if (previous) {
    const previousParentNode = node._model.graph.getCell(previous);
    const previousParentYogaNode: Yoga.YogaNode = previousParentNode.store.data.yogaProps;
    previousParentYogaNode.removeChild(yogaNode);
    if (previousParentYogaNode.getChildCount() === 0) {
      const width = previousParentYogaNode.getComputedLayout().width;
      previousParentYogaNode.setWidth(width);
    }
    changedNodes = new Set([...changedNodes, getRoot(previousParentNode)]);
  }

  // add to new parent
  if (current) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    parentYogaNode.insertChild(yogaNode, parentYogaNode.getChildCount()); // add to bottom
    setNodeRealative(parentYogaNode);
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

  return new Set(changedNodes.map((node) => getRoot(node)));
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
  applyProperties(
    rehydrate({
      alignItems: 'stretch',
      minHeight: 0,
      ...node.store.data.size,
      ...nodeConfig[node.shape],
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
  setChildrenRelative(node, graph);
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

const setNodeRealative = (yogaNode: any) => {
  yogaNode.setWidth('auto');
  yogaNode.setHeight('auto');
};

const setChildrenRelative = (node: any, graph: any) => {
  if (node._children) {
    node._children.forEach((child: any) => {
      if (graph.hasCell(child)) {
        const yogaChild = child.store.data.yogaProps;
        yogaChild.setWidth('100%');
        setChildrenRelative(child, graph);
      }
    });
  }
};
