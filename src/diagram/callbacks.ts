import { Node } from "@antv/x6";

const match_width = (src: Node, dest: Node) => {
  dest.resize(src.size().width, dest.size().height);
  dest.setPosition({
    x: src.position().x,
    y: dest.position().y,
  });
};

const children_width = (node: Node, ignoreNode: any = undefined) => {
  const children = node.getChildren();
  if (!children) {
    return;
  }
  for (const child of children) {
    if (child === ignoreNode) {
      continue;
    }
    if (child.isNode()) {
      const childNode: Node = child;
      match_width(node, childNode);
      children_width(childNode);
    }
  }
};

const parent_width = (node: Node, src: any = undefined) => {
  const parent = node.getParent();
  if (!parent) {
    return;
  }
  if (parent.isNode()) {
    const parentNode: Node = parent;
    if (parentNode.size().width > node.size().width) {
      // decreased
      match_width(parentNode, node);
    } else {
      match_width(node, parentNode);
      parent_width(parentNode, node);
    }
    children_width(parentNode, node);
  }
};

const e_width = (e) => {
  console.log("children_width", e);
  parent_width(e.cell);
  children_width(e.cell);
};

const header_size = 30;

const node_height = (node: Node) => {
  if (node.shape === "compartment" || node.shape === "group") {
    node.fit({ padding: { top: header_size } });
  }
  let offset = node.position().y + header_size;
  const children = node.getChildren();
  if (!children) {
    return;
  }

  for (const child of children) {
    if (child.isNode()) {
      const childNode: Node = child;
      childNode.position(childNode.position().x, offset, { deep: true });
      offset += childNode.size().height;
    }
  }
  node.fit({ padding: { top: header_size } });
  parent_height(node);
};

const parent_height = (node: Node) => {
  if (node.shape === "compartment" || node.shape === "group") {
    node.fit({ padding: { top: header_size } });
  }
  const parent = node.getParent();
  if (!parent) {
    return;
  }
  if (parent.isNode()) {
    const parentNode: Node = parent;
    let offset = parentNode.position().y + header_size;
    const children = parentNode.getChildren();
    if (!children) {
      return;
    }

    for (const child of children) {
      if (child.isNode()) {
        const childNode: Node = child;
        childNode.position(childNode.position().x, offset, { deep: true });
        offset += childNode.size().height;
      }
    }
    parent.fit({ padding: { top: header_size } });
    parent_height(parent);
  }
};

const e_height = (e) => {
  console.log("children_height", e);
  parent_height(e.cell);
};

const e_children = (e) => {
  let node = e.cell as Node;
  console.log("changed children", e);
  if (e.current === undefined) {
    return;
  }
  if (e.previous === undefined) {
    parent_height(node);
    parent_width(node);
    children_width(node);
    return;
  }

  const curr: any = e.current;
  const prev: any = e.previous;
  if (curr.length > prev.length) {
    // added
    const intersection = curr.filter((x) => !prev.includes(x));
    const updated = intersection[0]; // only 0 for now
    const updatedChild = node
      .getChildren()
      ?.filter((c) => c.id === updated)[0] as Node;
    updatedChild.position(node.position().x, updatedChild.position().y, {
      deep: true,
    });
    parent_height(updatedChild);
    parent_width(updatedChild);
    children_width(updatedChild);
  } else {
    // removed
    node_height(node);
  }
};

const e_moved = (e) => {
  console.log("moved", e);
  const node: Node = e.cell;
  const parent = node.getParent();
  if (!parent) {
    return;
  }
  const parentNode = parent as Node;
  if (!parentNode.getBBox().containsPoint(node.getBBox().center)) {
    // moved outside
    return; // node:change:children will handle this move
  }
  node.position(parentNode.position().x, node.position().y); // undo move
  parent_width(node);
  children_width(node);
  parent_height(node);
};

export {
  e_width,
  e_height,
  parent_height,
  parent_width,
  node_height,
  e_children,
  e_moved,
};
