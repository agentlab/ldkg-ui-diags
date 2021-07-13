import { Node } from '@antv/x6';
import { Options } from '@antv/x6/lib/graph/options'; // TODO: how to properly import Options?

export const validateEmbedding = ({ child, parent }: { child: Node; parent: Node }): boolean => {
  return true;
};

export const validateConnection = ({ sourceCell, targetCell }: Options.ValidateConnectionArgs): boolean => {
  return true;
};
