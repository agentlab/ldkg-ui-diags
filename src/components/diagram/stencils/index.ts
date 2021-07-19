import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { DefaultLabel } from './DefaultLabel';
import { Default } from './Default';
import { Card } from './Card';
import { SvgStencil } from './SvgStencil';

export const stencils = {
  'rm:RectWithText': NodeField,
  'rm:TitledRectNodeStencil': NodeShape,
  'rm:CardStencil': Card,
  'rm:SvgStencil': SvgStencil,
  default: Default,
  defaultLabel: DefaultLabel,
  'rm:DefaultEdgeStencil': {},
};
