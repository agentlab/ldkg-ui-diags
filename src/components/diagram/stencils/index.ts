import { NodeShape } from './NodeShape';
import { NodeField } from './NodeField';
import { Compartment } from './Compartment';
import { DefaultLabel } from './DefualtLabel';
import { Default } from './Default';
import { Card } from './Card';
import { Association } from './Association';
import { Inheritance } from './Inheritance';
import { WindTurbine, Heater, House, Generator, Substation } from './Architecture';
import { DefaultArrow } from './DefaultArrow';

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
  'ar:WindTurbineStencil': WindTurbine,
  'ar:HeaterStencil': Heater,
  'ar:HouseStencil': House,
  'ar:SubstationStencil': Substation,
  'ar:GeneratorStencil': Generator,
  'ar:Line': DefaultArrow,
};
