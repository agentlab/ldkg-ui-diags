export const SingleLine = {
  attrs: {
    line: {
      targetMarker: null,
    },
  },
};

export const DoubleLine = {
  shape: 'double-edge',
  attrs: {
    line: {
      strokeWidth: 4,
      stroke: 'white',
      targetMarker: null,
    },
    outline: {
      stroke: 'black',
      strokeWidth: 6,
    },
  },
};
