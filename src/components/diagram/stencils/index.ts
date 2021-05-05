import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';

export const stencils = {
  'rm:CompartmentNodeStencil': Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  'rm:AssociationArrowStencil': Default,
  defaultLabel: DefaultLabel,
};
