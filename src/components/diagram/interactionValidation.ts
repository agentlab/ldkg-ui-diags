import { Node } from '@antv/x6';
import { Options } from '@antv/x6/lib/graph/options'; // TODO: how to properly import Options?

export const validateEmbedding = ({ child, parent }: { child: Node; parent: Node }): boolean => {
  if (parent.shape === 'field') {
    return false;
  }
  if (parent.shape === 'group' && child.shape === 'group') {
    return false;
  }
  return true;
};

export const validateConnection = ({ sourceCell, targetCell }: Options.ValidateConnectionArgs): boolean => {
  if (!sourceCell || !targetCell) {
    return false;
  }
  if (sourceCell.shape !== 'group' || targetCell.shape !== 'group') {
    return false;
  }
  if (sourceCell.id === targetCell.id) {
    return false;
  }
  return true;
};
