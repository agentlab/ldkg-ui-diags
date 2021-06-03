import moment from 'moment';
import {
  ArtifactShapeSchema,
  CollState,
  PropertyShapeSchema,
  rootModelInitialState,
  ViewShapeSchema,
} from '@agentlab/sparql-jsld-client';

import { viewKindCollConstr, viewKinds } from './viewKinds';

export const viewDescrCollConstr = {
  '@id': 'rm:Views_Coll',
  entConstrs: [
    {
      '@id': 'rm:Views_EntConstr0',
      schema: ViewShapeSchema,
    },
  ],
};

export const viewDescrs = [
  {
    '@id': 'rm:DataModelView',
    '@type': 'rm:View',
    title: 'Модель данных',
    description: 'Модель данных хранилища на основе SHACL Shapes',
    //viewKind: viewKinds[0]['@id'],
    type: 'DiagramEditor', // control type
    elements: [],
    options: {
      gridOptions: {
        type: 'mesh',
        size: 10,
        color: '#e5e5e5',
        thickness: 1,
        colorSecond: '#d0d0d0',
        thicknessSecond: 1,
        factor: 4,
        bgColor: 'transparent',
      },
    },
    collsConstrs: [
      {
        '@id': 'rm:RootNodes_CollConstr',
        '@type': 'rm:CollConstr',
        '@parent': 'rm:RootNodes_CollConstr',
        entConstrs: [
          {
            '@id': 'rm:RootNodes_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'rm:RootNodes_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'rm:DataModelView',
            },
          },
          {
            '@id': 'rm:RootNodes_EntConstr_1',
            '@type': 'rm:EntConstr',
            schema: ArtifactShapeSchema['@id'],
          },
        ],
      },
      {
        '@id': 'rm:ChildNodes_CollConstr',
        '@type': 'rm:CollConstr',
        '@parent': 'rm:ChildNodes_CollConstr',
        entConstrs: [
          {
            '@id': 'rm:ChildNodes_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsChildNodeShape',
            conditions: {
              '@id': 'rm:ChildNodes_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'rm:DataModelView',
            },
          },
          {
            '@id': 'rm:ChildNodes_EntConstr_1',
            '@type': 'rm:EntConstr',
            schema: PropertyShapeSchema['@id'],
          },
        ],
      },
      {
        '@id': 'rm:Arrows_CollConstr',
        '@type': 'rm:CollConstr',
        '@parent': 'rm:Arrows_CollConstr',
        entConstrs: [
          {
            '@id': 'rm:Arrows_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'rm:Arrows_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'rm:DataModelView',
            },
          },
          {
            '@id': 'rm:Arrows_EntConstr_1',
            '@type': 'rm:CollConstr',
            schema: PropertyShapeSchema['@id'],
          },
        ],
      },
    ],
  },
  {
    '@id': 'rm:GraphView',
    '@type': 'rm:View',
    title: 'Граф данных',
    description: 'Граф данных хранилища на основе SHACL Shapes',
    //viewKind: viewKinds[1]['@id'],
    type: 'DiagramEditor',
    elements: [],
  },
];

/**
 * Parent (root, top level) Graph Nodes
 */
export const viewDataRootNodes = [
  {
    '@id': 'rm:diagramNode1',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 10,
    y: 10,
    z: 0,
    rotation: 0,
    height: 60,
    width: 20,
    subject: {
      // ref to the model object
      '@id': 'rm:ArtifactShape',
      '@type': 'sh:NodeShape',
      title: 'Требование',
      description: 'Тип ресурса',
      defaultIndividNs: 'http://cpgu.kbpm.ru/ns/rm/users#',
      property: [
        'rm:identifierShape',
        'rm:titleShape',
        'rm:descriptionShape',
        'rm:creatorShape',
        'rm:createdShape',
        'rm:modifiedByShape',
        'rm:modifiedShape',
      ],
      targetClass: 'rm:Artifact',
    },
    object: 'rm:DataModelView', // ref to the diagram
    //layout?
    stencil: 'rm:ClassNodeStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode2',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 250,
    y: 150,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'pporoles:UserShape',
      '@type': 'sh:NodeShape',
      title: 'Пользователь',
      description:
        'Пользователь системы. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      property: ['rm:nameShape'],
      targetClass: 'pporoles:User',
    },
    object: 'rm:DataModelView',
    //layout?
    stencil: 'rm:ClassNodeStencil',
    //styles: 'string with css?',
  },
];

/**
 * Child Nodes (primitive properties)
 */
export const viewDataChildNodes = [
  {
    '@id': 'rm:diagramNode100',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 20,
    z: 2,
    height: 85,
    width: 230,
    parent: 'rm:diagramNode1', // ref to the parent node
    object: 'rm:DataModelView', // ref to the diagram
    //path?
    //layout?
    stencil: 'rm:GeneralCompartmentNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode10',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 20,
    z: 2,
    height: 85,
    width: 230,
    parent: 'rm:diagramNode1', // ref to the parent node
    object: 'rm:DataModelView', // ref to the diagram
    //path?
    //layout?
    stencil: 'rm:PropertiesCompartmentNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode11',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 20,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode10', // ref to the parent node
    subject: {
      // ref to the model object
      '@id': 'rm:identifierShape',
      '@type': 'sh:PropertyShape',
      name: 'Идентификатор',
      description: 'Числовой идентификатор требования, уникальный только в пределах этой системы',
      path: 'dcterms:identifier',
      datatype: 'xsd:integer',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 2,
    },
    object: 'rm:DataModelView', // ref to the diagram
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode12',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 30,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode10',
    subject: {
      '@id': 'rm:titleShape',
      '@type': 'sh:PropertyShape',
      name: 'Название',
      description: 'Краткое название требования',
      path: 'dcterms:title',
      datatype: 'xsd:string',
      maxCount: 1,
      minCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'user',
      order: 3,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode13',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 40,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode10',
    subject: {
      '@id': 'rm:descriptionShape',
      '@type': 'sh:PropertyShape',
      name: 'Описание',
      description: 'Информация о требовании',
      path: 'dcterms:description',
      datatype: 'xsd:string',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'user',
      order: 4,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode14',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 50,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode10',
    subject: {
      '@id': 'rm:createdShape',
      '@type': 'sh:PropertyShape',
      name: 'Когда создан',
      description: 'Когда требование было создано',
      path: 'dcterms:created',
      datatype: 'xsd:dateTime',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 6,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode15',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 10,
    y: 60,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode10',
    subject: {
      '@id': 'rm:modifiedShape',
      '@type': 'sh:PropertyShape',
      name: 'Когда изменен',
      description: 'Когда требование было изменено',
      path: 'dcterms:modified',
      datatype: 'xsd:dateTime',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 8,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode16',
    '@type': 'rm:UsedInDiagramAsChildNode',
    x: 40,
    y: 30,
    z: 2,
    height: 10,
    width: 20,
    parent: 'rm:diagramNode2',
    subject: {
      '@id': 'rm:modifiedShape',
      '@type': 'sh:PropertyShape',
      name: 'Имя пользователя',
      description: 'Имя пользователя системы.',
      path: 'dcterms:modified',
      datatype: 'xsd:dateTime',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 8,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:PropertyNodeStencil',
    //styles: 'string with css?',
  },
];

/**
 * Arrows (reference properties)
 */
export const viewDataArrows = [
  {
    '@id': 'rm:diagramArrow1',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 2,
    arrowFrom: 'rm:diagramNode1', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'rm:diagramNode2', // ref to the arrow-connected graph node at the "to" end
    router: 'normal',
    subject: {
      // ref to the model object
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
      name: 'Кем создан',
      description: 'Пользователь, создавший требование',
      path: 'dcterms:creator',
      nodeKind: 'sh:BlankNodeOrIRI',
      class: 'pporoles:User',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 5,
    },
    object: 'rm:DataModelView', // ref to the diagram
    //path?
    //layout?
    stencil: 'rm:AssociationArrowStencil',
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramArrow3',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 2,
    arrowFrom: 'rm:diagramNode1',
    arrowTo: 'rm:diagramNode2',
    router: 'manhattan',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      name: 'Кем изменен',
      description: 'Пользователь, изменивший требование',
      path: 'oslc:modifiedBy',
      nodeKind: 'sh:BlankNodeOrIRI',
      class: 'pporoles:User',
      maxCount: 1,
      shapeModifiability: 'system',
      valueModifiability: 'system',
      order: 7,
    },
    object: 'rm:DataModelView',
    //path?
    //layout?
    stencil: 'rm:AssociationArrowStencil',
    //styles: 'string with css?',
  },
];

export const rootModelInitialState2 = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    // ViewDescr
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: viewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewKindDescr
    [viewKindCollConstr['@id']]: {
      '@id': viewKindCollConstr['@id'],
      collConstr: viewKindCollConstr,
      dataIntrnl: viewKinds,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },

    // Data
    [viewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[1]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[1]['@id'], // reference by @id
      dataIntrnl: viewDataChildNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};

/**
 * Collections Configs Data
 */
export const additionalColls: CollState[] = [
  // ViewKinds Collection
  {
    constr: viewKindCollConstr,
    data: viewKinds,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false, // disable data loading from the server for viewKinds.collConstrs
    },
  },
  // ViewDescrs Collection
  {
    constr: viewDescrCollConstr,
    data: viewDescrs,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // 'true' here (by default) triggers data loading from the server
      // for viewDescrs.collConstrs (it loads lazily -- after the first access)
    },
  },
];
