import * as kiwi from 'kiwi.js';

export const addKiwiSolver = ({ graph }) => {
  const solver = new kiwi.Solver();
  graph.on('node:resized', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    calcNodeSize(e, 'resize', solver);
  });
  graph.on('node:moved', (e: any) => {
    if (e.options && e.options.ignore) {
      return;
    }
    calcNodeSize(e, 'move', solver);
  });
  graph.on('node:added', (e) => {
    calcNodeSize(e, 'add', solver);
  });
  graph.on('node:change:parent', (e) => {
    calcNodeSize(e, 'embed', solver);
  });
  graph.on('node:removed', (e) => {
    calcNodeSize(e, 'remove', solver);
  });
};

export const setCumputedSize = (node: any, size: any) => {
  node.resize(size.width, size.height, {
    ignore: true,
  });
  node.setPosition(size.left, size.top, {
    ignore: true,
  });
};

export const calcNodeSize = (e: any, type: string, solver) => {
  const node: any = e.node;
  let changedNodes = new Set([node, ...propogateUpdates(getRoot(node))]);
  if (type === 'add') {
    addNode(node, solver);
  } else if (type === 'embed') {
    const child = node.store.data.kiwiProps;
    const childId = node.store.data.id;
    // remove from old parent
    if (e.previous) {
      const parentNode = node._model.graph.getCell(e.previous);
      const parent = parentNode.store.data.kiwiProps;
      solver.removeConstraint(parent.children.data[childId]);
      delete parent.children.data[childId];
      updateParent(parentNode, solver);
      for (const constraint of child.parent.constraints) {
        solver.removeConstraint(constraint);
      }
      child.parent = null;
      changedNodes = new Set([...changedNodes, ...propogateUpdates(parentNode)]);
    }
    // add to new parent
    if (e.current) {
      child.parent = {
        constraints: [],
      };
      const parentNode = node._parent;
      const parent = node._parent.store.data.kiwiProps;
      parent.children.data[childId] = null;
      child.parent.constraints = [
        new kiwi.Constraint(
          child.width,
          kiwi.Operator.Eq,
          new kiwi.Expression(parent.width, -parent.padding.right, -parent.padding.left),
          kiwi.Strength.required,
        ),
        new kiwi.Constraint(
          child.left,
          kiwi.Operator.Eq,
          new kiwi.Expression(parent.left, parent.padding.left),
          kiwi.Strength.required,
        ),
      ];
      for (const constraint of child.parent.constraints) {
        solver.addConstraint(constraint);
      }
      updateParent(parentNode, solver);
    }
    solver.suggestValue(child.left, node.position().x);
    solver.suggestValue(child.top, node.position().y);
  } else if (type === 'move') {
    solver.suggestValue(node.store.data.kiwiProps.left, node.position().x);
    solver.suggestValue(node.store.data.kiwiProps.top, node.position().y);
  } else if (type === 'resize') {
    solver.suggestValue(node.store.data.kiwiProps.width, node.size().width);
    solver.suggestValue(node.store.data.kiwiProps.height, node.size().height);
    solver.suggestValue(node.store.data.kiwiProps.left, node.position().x);
    solver.suggestValue(node.store.data.kiwiProps.top, node.position().y);
  } else if (type === 'remove') {
    const removed = node.store.data.kiwiProps;
    if (node._parent) {
      const parent = node._parent.store.data.kiwiProps;
      solver.removeConstraint(parent.children.data[node.id]);
      delete parent.children.data[node.id];
      updateParent(node._parent, solver);
      for (const constraint of removed.parent.constraints) {
        solver.removeConstraint(constraint);
      }
    }
    // embed events should've already removed children from `updated` component
    for (const constraint of removed.constraints) {
      solver.removeConstraint(constraint);
    }
    solver.removeEditVariable(removed.top);
    solver.removeEditVariable(removed.left);
    solver.removeEditVariable(removed.width);
    solver.removeEditVariable(removed.height);
  }
  //changedIds = [...changedIds, ...this.propogateUpdates(this.getRoot(node.id))];
  return changedNodes;
};

export const updateVariables = (changedNodes, solver) => {
  solver.updateVariables();
  for (const n of changedNodes) {
    const computedSize = {
      width: n.store.data.kiwiProps.width.value(),
      height: n.store.data.kiwiProps.height.value(),
      top: n.store.data.kiwiProps.top.value(),
      left: n.store.data.kiwiProps.left.value(),
    };
    setCumputedSize(n, computedSize);
  }
};

const propogateUpdates = (rootNode: any) => {
  let changedNodes: any = new Set([rootNode]);
  const current = rootNode;
  if (!current || !current._children) {
    return changedNodes;
  }
  for (const childNode of current._children) {
    changedNodes = [...changedNodes, ...propogateUpdates(childNode)];
  }
  return changedNodes;
};

const getRoot = (node: any) => {
  let current = node;
  while (current._parent) {
    current = current._parent;
  }
  return current;
};

const addNode = (node: any, solver: any) => {
  node.store.data.kiwiProps = {
    children: { data: {}, constraint: null },
    parent: null,
    top: new kiwi.Variable(),
    left: new kiwi.Variable(),
    width: new kiwi.Variable(),
    height: new kiwi.Variable(),
    padding: null,
    constraints: [],
  };
  const n = node.store.data.kiwiProps;
  n.constraints = [
    new kiwi.Constraint(n.width, kiwi.Operator.Ge, 120, kiwi.Strength.required),
    new kiwi.Constraint(n.height, kiwi.Operator.Ge, 20, kiwi.Strength.required),
  ];
  if (node.shape === 'field') {
    solver.addEditVariable(n.top, kiwi.Strength.weak);
    solver.addEditVariable(n.left, kiwi.Strength.weak);
    solver.addEditVariable(n.width, kiwi.Strength.weak);
    solver.addEditVariable(n.height, kiwi.Strength.strong);
    n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
  } else if (node.shape === 'compartment') {
    solver.addEditVariable(n.top, kiwi.Strength.medium);
    solver.addEditVariable(n.left, kiwi.Strength.medium);
    solver.addEditVariable(n.width, kiwi.Strength.weak);
    solver.addEditVariable(n.height, kiwi.Strength.weak);
    n.padding = { top: 20, bottom: 3, left: 3, right: 3 };
  } else if (node.shape === 'group') {
    solver.addEditVariable(n.top, kiwi.Strength.strong);
    solver.addEditVariable(n.left, kiwi.Strength.strong);
    solver.addEditVariable(n.width, kiwi.Strength.strong);
    solver.addEditVariable(n.height, kiwi.Strength.weak);
    n.padding = { top: 30, bottom: 3, left: 3, right: 3 };
  } else {
    solver.addEditVariable(n.top, kiwi.Strength.strong);
    solver.addEditVariable(n.left, kiwi.Strength.strong);
    solver.addEditVariable(n.width, kiwi.Strength.strong);
    solver.addEditVariable(n.height, kiwi.Strength.weak);
    n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
  }
  solver.suggestValue(n.left, node.position().x);
  solver.suggestValue(n.top, node.position().y);
  for (const constraint of n.constraints) {
    solver.addConstraint(constraint);
  }
};

const updateParent = (parentNode: any, solver: any) => {
  const parent = parentNode.store.data.kiwiProps;
  if (parent.children.constraint) {
    solver.removeConstraint(parent.children.constraint);
    parent.children.constraint = null;
  }
  let parentSize = new kiwi.Expression(parent.padding.top);
  let offset = new kiwi.Expression(parent.top, parent.padding.top);
  if (Object.keys(parent.children.data).length !== 0) {
    for (const childId in parent.children.data) {
      const child = parentNode._model.graph.getCell(childId).store.data.kiwiProps;
      if (parent.children.data[childId]) {
        solver.removeConstraint(parent.children.data[childId]);
      }
      const childOffset = new kiwi.Constraint(child.top, kiwi.Operator.Eq, offset, kiwi.Strength.required);
      parent.children.data[childId] = childOffset;
      solver.addConstraint(childOffset);
      offset = new kiwi.Expression(child.top, child.height);
      parentSize = parentSize.plus(child.height);
    }
  }
  parent.children.constraint = new kiwi.Constraint(
    parentSize.plus(parent.padding.bottom),
    kiwi.Operator.Eq,
    parent.height,
    kiwi.Strength.required,
  );
  solver.addConstraint(parent.children.constraint);
};
