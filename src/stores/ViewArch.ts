import moment from 'moment';

import { rootModelInitialState } from '@agentlab/sparql-jsld-client';
import { viewKindCollConstr, viewDescrCollConstr } from '@agentlab/ldkg-ui-react';

/***************************************
 * ViewKinds & ViewDescrs Data
 ***************************************/

/**
 * Architecture ViewKinds
 */
export const archViewKinds = [
  {
    '@id': 'mktp:_8g34sKh',
    '@type': 'aldkg:ViewKind',
    collsConstrs: [
      // Devices
      {
        '@id': 'mktp:_kwe56Hgs',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_aS57dj',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_Sdf72d',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_3Kjd6sF',
            '@type': 'aldkg:EntConstr',
            schema: 'hs:ProductShape',
          },
        ],
      },
      // Lines
      {
        '@id': 'mktp:_js5Jdf',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_Sdf73k',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_9kJgd8',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_p9Dsk6',
            '@type': 'aldkg:CollConstr',
            schema: 'hs:SubcatInCatLinkShape',
          },
        ],
      },
    ],
    elements: [
      {
        '@id': 'mktp:_hd86jd',
        '@type': 'aldkg:DiagramEditorVKElement',
        elements: [
          /**
           * Nodes
           */
          {
            '@id': 'rm:WindTurbineStencil', // stencil should be registered under this @id
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:SvgStencil', //reference to the base stencil which should be customized additionally with 'style' and registered under the different id from @id property
            resultsScope: 'mktp:_kwe56Hgs',
            // img, title, description are the fields from Cart stencil
            img: '/wind.svg',
            title: {
              default: 'Ветрогенератор',
              scope: 'subject/title',
            },
            description: {
              scope: 'subject/description',
            },
            // style for the root DIV for the Cart stencil
            style: {
              borderRight: '4px solid #582dcf',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
              // child embedding should be disabled here
            },
            paletteOrder: 0, // sorting order for stencils palette
          },
          {
            '@id': 'rm:HeaterStencil',
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:SvgStencil',
            resultsScope: 'mktp:_kwe56Hgs',
            img: '/heater.svg',
            title: {
              default: 'Нагреватель',
              scope: 'subject/title',
            },
            description: {
              scope: 'subject/description',
            },
            style: {
              borderRight: '4px solid #832dcf',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
              // child embedding should be disabled here
            },
            paletteOrder: 1,
          },
          {
            '@id': 'rm:HouseStencil',
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:SvgStencil',
            resultsScope: 'mktp:_kwe56Hgs',
            img: '/house.svg',
            title: {
              default: 'Дом',
              scope: 'subject/title',
            },
            description: {
              scope: 'subject/description',
            },
            style: {
              borderRight: '4px solid #b42dcf',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
              // child embedding should be disabled here
            },
            paletteOrder: 2,
          },
          {
            '@id': 'rm:SubstationStencil',
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:SvgStencil',
            resultsScope: 'mktp:_kwe56Hgs',
            img: '/substation.svg',
            title: {
              default: 'Подстанция',
              scope: 'subject/title',
            },
            description: {
              scope: 'subject/description',
            },
            style: {
              borderRight: '4px solid #b42dcf',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
              // child embedding should be disabled here
            },
            paletteOrder: 3,
          },
          {
            '@id': 'rm:GeneratorStencil',
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:SvgStencil',
            resultsScope: 'mktp:_kwe56Hgs',
            img: '/generator.svg',
            title: {
              default: 'Генератор',
              scope: 'subject/title',
            },
            description: {
              scope: 'subject/description',
            },
            style: {
              borderRight: '4px solid #b42dcf',
              boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
              // child embedding should be disabled here
            },
            paletteOrder: 4,
          },
          /**
           * Edges (arrows)
           */
          {
            '@id': 'rm:LineStencil',
            '@type': 'aldkg:DiagramEdgeVKElement',
            protoStencil: 'aldkg:CardStencil',
            resultsScope: 'mktp:_js5Jdf',
            title: 'Линия',
            description: 'Линия',
            paletteOrder: 5,
            // styles for targetMarker
            line: {
              targetMarker: null,
            },
          },
          {
            '@id': 'rm:DoubleLineStencil',
            '@type': 'aldkg:DiagramEdgeVKElement',
            protoStencil: 'aldkg:CardStencil',
            resultsScope: 'mktp:_js5Jdf',
            title: 'Двойная линия',
            description: 'Двойная линия',
            paletteOrder: 6,
            shape: 'double-edge',
            line: {
              strokeWidth: 4,
              stroke: 'white',
              targetMarker: null,
            },
            outline: {
              stroke: 'black',
              strokeWidth: 6,
            },
          },
        ],
      },
    ],
  },
];

/**
 * Architecture ViewDescrs
 */
export const archViewDescrs = [
  {
    '@id': 'mktp:_kg67Sdfl',
    '@type': 'aldkg:ViewDescr',
    viewKind: 'mktp:_8g34sKh',
    collsConstrs: [
      // Categories (coll constr, inherited from ViewKind, parent references in '@parent' fields, which are our extension of JSON-LD)
      {
        '@id': 'mktp:_8Df89f',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_kwe56Hgs', // parent CollConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
        entConstrs: [
          {
            '@id': 'mktp:_94Sdfh5',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_aS57dj', // parent EntConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
            conditions: {
              '@id': 'mktp:_2Yud6',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_Sdf72d', // parent Condition, used @ prefix to avoid collisions with conditions (our extension of JSON-LD)
              object: 'mktp:_kg67Sdfl', // all the inheritance thing just to add this field!!!
            },
          },
        ],
      },
      // SubcatInCatLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_od8S6f',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_js5Jdf',
        entConstrs: [
          {
            '@id': 'mktp:_2Yd7G',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_Sdf73k',
            conditions: {
              '@id': 'mktp:_kd7DQmd',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_9kJgd8',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
    ],
    elements: [
      {
        '@id': 'mktp:_34jdf89',
        '@type': 'aldkg:DiagramEditorVDE', // control type
        '@parent': 'mktp:_hd86jd',
        title: 'Архитектура смартгрида',
        description: 'Архитектура смартгрида',
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
      },
    ],
  },
];

/***************************************
 * Diagram Nodes
 ***************************************/

export const viewDataRootArchNodes = [
  {
    '@id': 'mktp:diagramNode1',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
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
    stencil: 'rm:WindTurbineStencil', // ref to the stencil (type of the graphical sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode2',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 300,
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
    stencil: 'rm:HeaterStencil', // ref to the stencil (type of the graphical sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode3',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 500,
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
    stencil: 'rm:GeneratorStencil', // ref to the stencil (type of the graphical sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode4',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 100,
    y: 360,
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
    stencil: 'rm:SubstationStencil', // ref to the stencil (type of the graphical sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode5',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 300,
    y: 360,
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
    stencil: 'rm:HeaterStencil', // ref to the stencil (type of the graphical sign, not in
  },
  {
    '@id': 'mktp:diagramNode6',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 500,
    y: 360,
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
    stencil: 'rm:HouseStencil', // ref to the stencil (type of the graphical sign, not in
  },
  {
    '@id': 'mktp:diagramNode7',
    '@type': 'aldkg:UsedInDiagramAsRootNode',
    x: 100,
    y: 560,
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
    stencil: 'rm:HouseStencil', // ref to the stencil (type of the graphical sign, not in
  },
];

/**
 * Arrows (reference properties)
 */
export const viewDataArchArrows = [
  {
    '@id': 'mktp:diagramArrow0',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:LineStencil',
  },
  {
    '@id': 'mktp:diagramArrow1',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:LineStencil',
  },
  {
    '@id': 'mktp:diagramArrow2',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:LineStencil',
  },
  {
    '@id': 'mktp:diagramArrow3',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:LineStencil',
  },
  {
    '@id': 'mktp:diagramArrow4',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:DoubleLineStencil',
  },
  {
    '@id': 'mktp:diagramArrow5',
    '@type': 'aldkg:UsedInDiagramAsArrow',
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
    stencil: 'rm:DoubleLineStencil',
  },
];

/**
 * Architecture Initial Model State with all data
 */
export const archModelInitialState = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    // ViewKind
    [viewKindCollConstr['@id']]: {
      '@id': viewKindCollConstr['@id'],
      collConstr: viewKindCollConstr,
      dataIntrnl: archViewKinds,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewDescr
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: archViewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewData -- Nodes
    [archViewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': archViewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: archViewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootArchNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewData -- Arrows
    [archViewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
      '@id': archViewDescrs[0].collsConstrs?.[1]['@id'],
      collConstr: archViewDescrs[0].collsConstrs?.[1]['@id'], // reference by @id
      dataIntrnl: viewDataArchArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};
