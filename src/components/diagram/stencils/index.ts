import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { Card } from './Card';
import { Association } from './Association';
import { Inheritance } from './Inheritance';
import { WindTurbine, Heater, House, Generator, Substation } from './Architecture';
import { SingleLine, DoubleLine } from './Lines';

export const stencils = {
  'rm:GeneralCompartmentNodeStencil': Compartment,
  'rm:PropertiesCompartmentNodeStencil': Compartment,
  'rm:PropertyNodeStencil': NodeField,
  'rm:TitledRectNodeStencil': NodeShape,
  'rm:RectWithText': NodeField,
  'rm:CardStencil': Card,
  'rm:ClassNodeStencil': NodeShape,
  default: Default,
  defaultLabel: DefaultLabel,
  'rm:DefaultEdgeStencil': {},
  'rm:AssociationArrowStencil': Association,
  'rm:InheritanceArrowStencil': Inheritance,
  'rm:WindTurbineStencil': WindTurbine,
  'rm:HeaterStencil': Heater,
  'rm:HouseStencil': House,
  'rm:SubstationStencil': Substation,
  'rm:GeneratorStencil': Generator,
  'rm:Line': SingleLine,
  'rm:DoubleLine': DoubleLine,
};
