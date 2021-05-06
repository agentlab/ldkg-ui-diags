import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { Card } from './Card';
import { Association } from './Association';
import { Inheritance } from './Inheritance';

export const stencils = {
  'rm:CompartmentNodeStencil': Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:CardStencil': Card,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  defaultLabel: DefaultLabel,
  'rm:DefaultEdgeStencil': {},
  'rm:AssociationArrowStencil': Association,
  'rm:InheritanceArrowStencil': Inheritance,
};
