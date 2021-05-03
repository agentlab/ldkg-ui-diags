import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { CardDiagram } from './CardDiagram';

export const stencils = {
  compartment: Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:CardDiagramStencil': CardDiagram,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  'rm:AssociationArrowStencil': Default,
  defaultLabel: DefaultLabel,
};
