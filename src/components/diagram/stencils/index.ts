import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { DefaultLabel } from './DefaultLabel';
import { Default } from './Default';
import { Card } from './Card';
import { SvgStencil } from './SvgStencil';

export const stencils = {
  'aldkg:RectWithText': NodeField,
  'aldkg:TitledRectNodeStencil': NodeShape,
  'aldkg:CardStencil': Card,
  'aldkg:SvgStencil': SvgStencil,
  default: Default,
  defaultLabel: DefaultLabel,
  'aldkg:DefaultEdgeStencil': {},
};
