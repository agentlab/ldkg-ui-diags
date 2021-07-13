// for now use custom mocks
export const event = (nodeId, nodeShape) => {
  let node = {
    id: nodeId,
    shape: nodeShape,
    _parent: null,
    _children: [],
    _pos: { x: 10, y: 10 },
    _size: { width: 200, height: 40 },
    store: {
      data: {
        id: nodeId,
      },
    },
    _model: {
      graph: {
        getCell(childId) {
          return node._children.find((child) => child.id === childId);
        },
      },
    },
    position() {
      return node._pos;
    },
    size() {
      return node._size;
    },
    resize(width, height) {
      node._size = { width, height };
    },
    setPosition(x, y) {
      node._pos = { x, y };
    },
    hasParent() {
      return node._parent !== null;
    },
    getParent() {
      return node._parent;
    },
  };
  const e = {
    node: node,
    current: 'not null',
  };
  return e;
};
