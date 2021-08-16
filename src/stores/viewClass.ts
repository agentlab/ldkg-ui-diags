import moment from 'moment';
import {
  ArtifactShapeSchema,
  CollState,
  PropertyShapeSchema,
  rootModelInitialState,
} from '@agentlab/sparql-jsld-client';

import { viewKindCollConstr, viewDescrCollConstr } from './view';

export const classViewKinds = [
  {
    '@id': 'rm:classViewKind',
    '@type': 'rm:ViewKind',
    type: 'DiagramEditor',
    elements: [
      /**
       * Nodes
       */
      {
        '@id': 'rm:ClassNodeStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:TitledRectNodeStencil',
        title: 'Class',
        resultsScope: 'rm:RootNodes_CollConstr',
        style: {
          border: '1px solid rgb(150,150,150)',
        },
        layout: {
          vertical: 'wrap_content',
          width: 200,
          padding: {
            top: 1,
            left: 1,
            right: 1,
            bottom: 1,
          },
        },
        elements: [
          // general fields Compartment (key-value)
          {
            '@id': 'rm:NodeStencilTitle',
            type: 'DiagramNode',
            protoStencil: 'rm:RectWithText',
            title: 'General',
            height: 25,
            style: {
              background:
                'linear-gradient(to top, rgb(247, 247, 247) 10% , rgb(230, 230, 230) 80%, rgb(214, 214, 214) 100%)',
              borderBottom: '1px solid rgb(150,150,150)',
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: '1.2em',
            },
            constant: true,
            //scope: '!= property', // without scope
            layout: {
              vertical: 'wrap_content',
              horizontal: 'match_parent',
            },
          },
          {
            '@id': 'rm:GeneralCompartmentNodeStencil',
            type: 'DiagramNode',
            protoStencil: 'rm:TitledRectNodeStencil',
            title: 'General',
            height: 60,
            style: {
              borderBottom: '1px solid rgb(150,150,150)',
            },
            //scope: '!= property', // without scope
            layout: {
              vertical: 'wrap_content',
              horizontal: 'match_parent',
              padding: {
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
              },
            },
            /*elements: [
              {
                // без scope рендерит весь элемент
                type: 'DiagramNode',
                protoStencil: 'rm:RectWithText',
                layout: {
                  horizontal: 'match_parent',
                },
              },
            ],*/
          },
          // properties Compartment (property-type)
          {
            '@id': 'rm:PropertiesCompartmentNodeStencil',
            type: 'DiagramNode',
            protoStencil: 'rm:TitledRectNodeStencil',
            title: 'Properties',
            height: 60,
            //scope: 'property',  // without scope
            style: {
              borderBottom: '1px solid rgb(150,150,150)',
            },
            //scope: '!= property', // without scope
            layout: {
              vertical: 'wrap_content',
              horizontal: 'match_parent',
              padding: {
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
              },
            },
            /*elements: [
              {
                type: 'rm:PropertyNodeStencil',
                scope: '@id',
                layout: {
                  horizontal: 'match_parent',
                },
              },
            ],*/
          },
        ],
      },
      {
        '@id': 'rm:PropertyNodeStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:RectWithText',
        resultsScope: 'rm:ChildNodes_CollConstr',
        layout: {
          vertical: 'wrap_content',
        },
      },
      /**
       * Edges (arrows)
       */
      {
        '@id': 'rm:AssociationArrow',
        type: 'DiagramEdge',
        resultsScope: 'rm:Association_CollConstr',
        title: 'Ассоциация',
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: {
            name: 'block',
            strokeWidth: 1,
            open: true,
          },
        },
        style: {
          display: 'flex',
          //backgroundColor: 'white',
          boxSizing: 'border-box',
          alignItems: 'center',
        },
      },
      {
        '@id': 'rm:InheritanceArrow',
        type: 'DiagramEdge',
        resultsScope: 'rm:Inheritance_CollConstr',
        title: 'Наследование',
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: {
            name: 'block',
            strokeWidth: 1,
            fill: 'white',
          },
        },
        style: {
          display: 'flex',
          //backgroundColor: 'white',
          boxSizing: 'border-box',
          alignItems: 'center',
        },
      },
    ],
  },
  {
    '@id': 'rm:graphViewKind',
    '@type': 'rm:ViewKind',
    type: 'canvas',
    elements: [
      {
        type: 'node',
        scope: 'shapes',
      },
      {
        type: 'node',
        scope: 'properties',
      },
      {
        type: 'edge',
        scope: '',
      },
    ],
  },
];

export const classViewDescrs = [
  {
    '@id': 'rm:DataModelView',
    '@type': 'rm:View',
    title: 'Модель данных',
    description: 'Модель данных хранилища на основе SHACL Shapes',
    viewKind: 'rm:classViewKind',
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
      title: true,
      minimap: false,
      configPanel: false,
      toolbar: true,
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
        '@id': 'rm:Association_CollConstr',
        '@type': 'rm:CollConstr',
        '@parent': 'rm:Association_CollConstr',
        entConstrs: [
          {
            '@id': 'rm:Association_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'rm:Association_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'rm:DataModelView',
            },
          },
          {
            '@id': 'rm:Association_EntConstr_1',
            '@type': 'rm:CollConstr',
            schema: PropertyShapeSchema['@id'],
          },
        ],
      },
      {
        '@id': 'rm:Inheritance_CollConstr',
        '@type': 'rm:CollConstr',
        '@parent': 'rm:Inheritance_CollConstr',
        entConstrs: [
          {
            '@id': 'rm:Inheritance_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'rm:Inheritance_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'rm:DataModelView',
            },
          },
          {
            '@id': 'rm:Inheritance_EntConstr_1',
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
    '@type': 'rm:UsedInDiagramAsRootNode',
    x: 10,
    y: 10,
    z: 0,
    rotation: 0,
    height: 60,
    width: 172,
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
    stencil: 'rm:ClassNodeStencil', // ref to the stencil (type of the graphical sign, not instance of a sign)
    //styles: 'string with css?',
  },
  {
    '@id': 'rm:diagramNode2',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 170,
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
    height: 35,
    width: 230,
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
export const viewDataAssociationArrows = [
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
    stencil: 'rm:AssociationArrow',
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
    stencil: 'rm:AssociationArrow',
    //styles: 'string with css?',
  },
];

export const classModelInitialState = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    // ViewDescr
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: classViewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewKindDescr
    [viewKindCollConstr['@id']]: {
      '@id': viewKindCollConstr['@id'],
      collConstr: viewKindCollConstr,
      dataIntrnl: classViewKinds,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },

    // Data
    [classViewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': classViewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: classViewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [classViewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
      '@id': classViewDescrs[0].collsConstrs?.[1]['@id'],
      collConstr: classViewDescrs[0].collsConstrs?.[1]['@id'], // reference by @id
      dataIntrnl: viewDataChildNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [classViewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': classViewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: classViewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataAssociationArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [classViewDescrs[0].collsConstrs?.[3]['@id'] || '']: {
      '@id': classViewDescrs[0].collsConstrs?.[3]['@id'],
      collConstr: classViewDescrs[0].collsConstrs?.[3]['@id'], // reference by @id
      dataIntrnl: [],
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
    data: classViewKinds,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false, // disable data loading from the server for viewKinds.collConstrs
    },
  },
  // ViewDescrs Collection
  {
    constr: viewDescrCollConstr,
    data: classViewDescrs,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // 'true' here (by default) triggers data loading from the server
      // for viewDescrs.collConstrs (it loads lazily -- after the first access)
    },
  },
];
