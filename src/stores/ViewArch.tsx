import moment from 'moment';
import { rootModelInitialState } from '@agentlab/sparql-jsld-client';

import { viewDescrCollConstr, viewDescrs } from './view';

export const viewDataRootArchNodes = [
  {
    '@id': 'mktp:diagramNode1',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product1',
      '@type': 'mktp:Product',
      title: 'Ветрогенератор w1',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:WindTurbineStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode2',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Нагреватель h1',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:HeaterStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode3',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Генератор g1',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:GeneratorStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode4',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Подстанция s1',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:SubstationStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode5',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Нагреватель h2',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:HeaterStencil', // ref to the stencil (type of the graphicsl sign, not in
  },
  {
    '@id': 'mktp:diagramNode6',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Дом b1',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:HouseStencil', // ref to the stencil (type of the graphicsl sign, not in
  },
  {
    '@id': 'mktp:diagramNode7',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Дом b2',
      description: '',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:HouseStencil', // ref to the stencil (type of the graphicsl sign, not in
  },
];

/**
 * Arrows (reference properties)
 */
export const viewDataArchArrows = [
  {
    '@id': 'mktp:diagramArrow0',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode1', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode4', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:Line',
  },
  {
    '@id': 'mktp:diagramArrow1',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode4', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode3', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:Line',
  },
  {
    '@id': 'mktp:diagramArrow2',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode4', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode6', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:Line',
  },
  {
    '@id': 'mktp:diagramArrow3',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode4', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode7', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:Line',
  },
  {
    '@id': 'mktp:diagramArrow4',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode7', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode2', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:DoubleLine',
  },
  {
    '@id': 'mktp:diagramArrow5',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode6', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode5', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'ar:DoubleLine',
  },
];

export const rootModelInitialState3 = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: viewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootArchNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataArchArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};
