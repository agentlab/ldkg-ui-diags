import { RootNodeRenderer, ChildNodeRenderer } from './NodesRenderer';
import { EdgeRenderer } from './EdgeRenderer';

export const renderers = {
  'rm:UsedInDiagramAsChildNode': ChildNodeRenderer,
  'rm:UsedInDiagramAsRootNodeShape': RootNodeRenderer,
  'rm:UsedInDiagramAsArrow': EdgeRenderer,
};