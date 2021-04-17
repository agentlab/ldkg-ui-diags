import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { Default } from './Default';

export const stencils = {
  compartment: Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  'rm:AssociationArrowStencil': Default,
};