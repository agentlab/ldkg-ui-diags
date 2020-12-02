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
      parentNode.resize(node.size().width, parentNode.size().height);
      parentNode.setPosition({
        x: node.position().x,
        y: parentNode.position().y,
      });
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

const parent_height = (node: Node) => {
  if (node.shape == "compartment" || node.shape == "group") {
    node.fit({ padding: { top: header_size } });
  }
  const parent = node.getParent();
  if (!parent) {
    return;
  }
  if (parent.isNode()) {
    const parentNode: Node = parent;
    let offset = parent.position().y + header_size;
    const children = parent.getChildren();
    if (!children) {
      return;
    }
    for (const child of children) {
      if (child.isNode()) {
        const childNode: Node = child;
        child.position(child.position().x, offset, { deep: true });
        offset += child.size().height;
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

export { e_width, e_height, parent_height };
