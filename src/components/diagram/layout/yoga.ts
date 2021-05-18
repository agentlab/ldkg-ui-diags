import Yoga, { Node } from 'yoga-layout-prebuilt';
import { Graph, Node as X6Node } from '@antv/x6';
import { getRoot } from './kiwi';

const defaultProperties = {
  minWidth: 120,
  minHeight: 20,
  flexDirection: 'column',
  // test: 'auto', // should create warning
};

const nodeConfig = {
  'rm:PropertyNodeStencil': {},
  'rm:CompartmentNodeStencil': {
    paddingTop: 20,
    paddingLeft: 1,
    paddingRight: 1,
    paddingBottom: 1,
  },
  'rm:ClassNodeStencil': {
    paddingTop: 28,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
  },
};

type Event = 'resize' | 'move' | 'add' | 'changeParent' | 'changeChildren' | 'remove';

export const addYogaSolver = ({ graph }: { graph: Graph }) => {
  graph.on('node:resized', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    const changed = handleGraphEvent(e, 'resize');
    updateVariables(changed);
  });
  graph.on('node:moved', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    const changed = handleGraphEvent(e, 'move');
    updateVariables(changed);
  });
  graph.on('node:added', (e) => {
    const changed = handleGraphEvent(e, 'add');
    updateVariables(changed);
  });
  graph.on('node:change:parent', (e: any) => {
    handleGraphEvent(e, 'changeParent');
    // do not update variables, at this point parent node has outdated children array
    // following `node:change:children` event will do the job
  });
  graph.on('node:change:children', (e: any) => {
    const changed = handleGraphEvent(e, 'changeChildren');
    updateVariables(changed);
  });
  graph.on('node:removed', (e) => {
    const changed = handleGraphEvent(e, 'remove');
    updateVariables(changed);
  });
};

const properties = {
  numberProperties: [
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'flexGrow',
    'flexShrink',
    'aspectRatio',
  ],
  enumProperties: {
    // property: keyword
    justifyContent: 'justify',
    alignItems: 'align',
    alignSelf: 'align',
    alignContent: 'align',
    positionType: 'position',
    flexWrap: 'wrap',
    flexDirection: 'flex-direction',
  },
  directionProperties: ['padding', 'margin', 'border'], // `position` is forbidden
  directions: ['top', 'right', 'bottom', 'left'], // paddingTop, ...
};

const applyProperties = (props: { [key: string]: string | number }, node: Yoga.YogaNode) => {
  Object.entries(props).forEach(([key, value]) => {
    // see https://github.com/facebook/yoga/blob/cbf6495d66a7a8066d1354daa14d3bb1af19f6ef/website/src/components/Playground/src/YogaNode.js#L144
    try {
      if (properties.numberProperties.includes(key)) {
        node[`set${key[0].toUpperCase()}${key.substr(1)}`](value);
      } else if (key in properties.enumProperties) {
        node[`set${key[0].toUpperCase()}${key.substr(1)}`](
          Yoga[`${properties.enumProperties[key]}-${value}`.replaceAll('-', '_').toUpperCase()],
        );
      } else {
        const [prop, Direction] = key.replace(/([A-Z])/g, ' $1').split(' ');
        const direction = `${Direction[0].toLowerCase()}${Direction.substr(1)}`;
        if (properties.directionProperties.includes(prop) && properties.directions.includes(direction)) {
          node[`set${prop[0].toUpperCase()}${prop.substr(1)}`](Yoga[`EDGE_${direction.toUpperCase()}`], value);
        } else {
          throw new Error('Property not available');
        }
      }
    } catch (e) {
      console.warn('Provided property-value pair is not supported - key: ' + key + ', value: ' + value);
    }
  });
};

export const handleGraphEvent = (e: any, type: Event) => {
  const node: X6Node = e.node;
  let changedNodes = new Set<any>([node, getRoot(node)]);
  if (type === 'add') {
    addNode(node);
  } else if (type === 'changeParent') {
    const changed = changeParent(e.previous, e.current, node);
    changedNodes = new Set([...changedNodes, ...changed]);
  } else if (type === 'move') {
    moveNode(node);
  } else if (type === 'resize') {
    resizeNode(node);
  } else if (type === 'remove') {
    removeNode(node);
  } else if (type === 'changeChildren') {
    const changed = changeChildren(e.previous || [], e.current || [], node);
    changedNodes = new Set([...changedNodes, ...changed]);
  }

  return changedNodes;
};

export const updateVariables = (changedNodes: Set<any>) => {
  const updateNode = (node) => {
    const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
    const computedLayout = yogaNode.getComputedLayout();
    if (!node._parent) {
      // root n
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
    updateNode(parent);
    (parent._children || []).forEach(updateNodeTree);
  };

  [...changedNodes]
    .filter((node) => !node._parent)
    .forEach((node) => {
      const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
      yogaNode.calculateLayout();
      updateNodeTree(node);
    });
};

const changeParent = (previous: any, current: any, node: any) => {
  const yogaNode: Yoga.YogaNode = node.store.data.yogaProps;
  let changedNodes = new Set<Node>([]);

  // remove from previous parent
  if (previous) {
    const previousParentNode = node._model.graph.getCell(previous);
    const previousParentYogaNode: Yoga.YogaNode = previousParentNode.store.data.yogaProps;
    previousParentYogaNode.removeChild(yogaNode);
    changedNodes = new Set([...changedNodes, getRoot(previousParentNode)]);
  }

  // add to new parent
  if (current) {
    const parentNode = node._parent;
    const parentYogaNode: Yoga.YogaNode = parentNode.store.data.yogaProps;
    parentYogaNode.insertChild(yogaNode, parentYogaNode.getChildCount()); // add to bottom
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
  root.setPosition(Yoga.EDGE_LEFT, node.position().x);
  root.setPosition(Yoga.EDGE_TOP, node.position().y);

  applyProperties(defaultProperties, root);
  if (node.shape in nodeConfig) {
    applyProperties(nodeConfig[node.shape], root);
  }

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
