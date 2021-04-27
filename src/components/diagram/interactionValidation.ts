import { Node } from '@antv/x6';

export const validate = ({ child, parent }: { child: Node; parent: Node }) => {
  if (parent.shape === 'field') {
    return false;
  }
  if (parent.shape === 'group' && child.shape === 'group') {
    return false;
  }
  return true;
};
