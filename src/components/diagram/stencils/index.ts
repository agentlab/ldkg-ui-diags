import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { Card } from './Card';

export const stencils = {
  compartment: Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:CardStencil': Card,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  'rm:AssociationArrowStencil': Default,
  defaultLabel: DefaultLabel,
};
