import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { Card } from './Card';
import { Association } from './Association';
import { Inheritance } from './Inheritance';
import { SvgStencil } from './SvgStencil';

export const stencils = {
  'rm:RectWithText': NodeField,
  'rm:TitledRectNodeStencil': NodeShape,
  'rm:CardStencil': Card,
  'rm:SvgStencil': SvgStencil,
  default: Default,
  defaultLabel: DefaultLabel,
  'rm:DefaultEdgeStencil': {},
  'rm:AssociationArrowStencil': Association,
  'rm:InheritanceArrowStencil': Inheritance,
};
