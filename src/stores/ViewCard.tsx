import moment from 'moment';
import { ArtifactShapeSchema, PropertyShapeSchema, rootModelInitialState } from '@agentlab/sparql-jsld-client';

import { viewDescrCollConstr } from './view';
import { viewKindCollConstr } from './viewKinds';

// @prefix wbc: <https://www.wildberries.ru/catalog/>

export const viewDataRootCardNodes = [
  {
    '@id': 'mktp:diagramNode01',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:CategoryStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
    x: 10,
    y: 10,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    // ref to the model object
    subject: {
      '@id': 'wbc:dom-i-dacha/zdorove',
      '@type': 'hs:Category',
      title: 'Здоровье',
      description: '',
    },
    object: 'mktp:CardView', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramNode02',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:CategoryStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
    x: 10,
    y: 200,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    // ref to the model object
    subject: {
      '@id': 'wbc:zdorove/ozdorovlenie',
      '@type': 'hs:Category',
      title: 'Оздоровление',
      description: '',
    },
    object: 'mktp:CardView', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramNode03',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:CategoryStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
    x: 400,
    y: 10,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    // ref to the model object
    subject: {
      '@id': 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      '@type': 'hs:Category',
      title: 'Массажер электрический',
      description: '',
    },
    object: 'mktp:CardView', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramNode11',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductStencil',
    x: 100,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'mktp:Product1',
      '@type': 'mktp:Product',
      title: 'Массажная подушка роликовая',
      description: 'Электрический роликовый массажер для спины, шеи, плеч',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramNode12',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductStencil',
    x: 300,
    y: 160,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'mktp:Product2',
      '@type': 'mktp:Product',
      title: 'Массажная подушка роликовая с лямками',
      description: 'Электрический роликовый массажер с лямками',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramNode21',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductCardStencil',
    x: 10,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'wbc:15570386/detail.aspx',
      '@type': 'hs:ProductCard',
      title: 'Электрическая массажная подушка релакс с подогревом...',
      description:
        'Электрическая массажная подушка релакс с подогревом / Массажер электрический для тела / шеи / спины',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/15570000/15570386-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/relax-massage',
        '@type': 'hs:Brand',
        name: 'Relax Massage',
      },
      price: 1043,
      seller: {
        '@id': 'https://examples.ru/sellers/15570386',
        '@type': 'hs:Seller',
        name: '',
      },
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramNode22',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductCardStencil',
    x: 250,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'wbc:15622789/detail.aspx',
      '@type': 'hs:ProductCard',
      title: 'Массажная подушка с подогревом для дома и автомомобиля...',
      description:
        'Массажная подушка с подогревом для дома и автомомобиля массажер для шеи спины 8 роликов чудо релакс',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/15620000/15622789-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/happygoods',
        '@type': 'hs:Brand',
        name: 'HappyGoods',
      },
      price: 964,
      seller: {
        '@id': 'https://examples.ru/sellers/15622789',
        '@type': 'hs:Seller',
        name: '',
      },
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramNode23',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductCardStencil',
    x: 500,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'wbc:16170086/detail.aspx',
      '@type': 'hs:ProductCard',
      title: 'Электрическая массажная подушка релакс с подогревом...',
      description:
        'Электрическая массажная подушка релакс с подогревом / Массажер электрический для тела / шеи / спины',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/16170000/16170086-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/doktor-aybolit',
        '@type': 'hs:Brand',
        name: 'ДОКТОР АЙБОЛИТ',
      },
      price: 1304,
      seller: {
        '@id': 'https://examples.ru/sellers/16170086',
        '@type': 'hs:Seller',
        name: '',
      },
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramNode24',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    stencil: 'mktp:ProductCardStencil',
    x: 750,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'wbc:18247707/detail.aspx',
      '@type': 'hs:ProductCard',
      title: 'Массажер для спины шеи тела плеч ног...',
      description: 'Массажер для спины шеи тела плеч ног/ Электрический роликовый Массажер/ массаж шиацу',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/18240000/18247707-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/massazher-dlya-shei-spiny-1',
        '@type': 'hs:Brand',
        name: 'массажер для шеи спины №1',
      },
      price: 1559,
      seller: {
        '@id': 'https://examples.ru/sellers/18247707',
        '@type': 'hs:Seller',
        name: '',
      },
    },
    object: 'mktp:CardView',
  },
];

/**
 * Arrows (reference properties)
 */
export const viewDataCardArrows = [
  /**
   * Отношения между 3 категориями
   */
  {
    '@id': 'mktp:diagramArrow01',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:SubcategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode02', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode01', // ref to the arrow-connected graph node at the "to" end
    router: 'manhattan',
    // ref to the model object
    subject: {
      '@id': 'mktp:sc01',
      '@type': 'hs:SubcatToCatLink',
      subject: 'wbc:zdorove/ozdorovlenie',
      object: 'wbc:dom-i-dacha/zdorove',
      name: 'подкатегория',
    },
    object: 'mktp:CardView', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramArrow02',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:SubcategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode02',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:sc02',
      '@type': 'hs:SubcatToCatLink',
      subject: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      object: 'wbc:zdorove/ozdorovlenie',
      name: 'подкатегория',
    },
    object: 'mktp:CardView',
  },
  /**
   * 4 товара в категории 03
   */
  {
    '@id': 'mktp:diagramArrow11',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode21',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cppl11',
      '@type': 'hs:CardInCategoryLink',
      subject: 'wbc:15570386/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow12',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode22',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cppl2',
      '@type': 'hs:CardInCategoryLink',
      subject: 'wbc:15622789/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow13',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode23',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cppl3',
      '@type': 'hs:CardInCategoryLink',
      subject: 'wbc:16170086/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow14',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode24',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cppl4',
      '@type': 'hs:CardInCategoryLink',
      subject: 'wbc:18247707/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:CardView',
  },
  /**
   * 3 товара в продукте1 и 1 товар в продукте 2
   */
  {
    '@id': 'mktp:diagramArrow21',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'rm:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode21',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      subject: 'wbc:15570386/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow22',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode22',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      subject: 'wbc:15622789/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow23',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode23',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      subject: 'wbc:16170086/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:CardView',
  },
  {
    '@id': 'mktp:diagramArrow24',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode24',
    arrowTo: 'mktp:diagramNode12',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      subject: 'wbc:18247707/detail.aspx',
      object: 'mktp:Product2',
      name: 'похожесть',
    },
    object: 'mktp:CardView',
  },
];

export const viewKinds = [
  {
    '@id': 'mktp:CardViewKind',
    '@type': 'rm:ViewKind',
    type: 'DiagramEditor',
    elements: [
      /**
       * Nodes
       */
      {
        '@id': 'mktp:CategoryStencil', // stencil should be registered under thos @id
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil', //reference to the base stencil which should be customized additionaly with 'style' and registered under the different id from @id property
        title: 'Category',
        style: {
          borderRight: '4px solid #582dcf',
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
          // child embedding should be disabled here
        },
        paletteOrder: 0, // sorting order for stencils palette
        //scope: '',  // will be specified later
      },
      {
        '@id': 'mktp:ProductStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil',
        title: 'Product',
        style: {
          borderRight: '4px solid #832dcf',
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
          // child embedding should be disabled here
        },
        paletteOrder: 1,
        //scope: '',  // will be specified later
      },
      {
        '@id': 'mktp:ProductCardStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil',
        title: 'ProductCard',
        style: {
          borderRight: '4px solid #b42dcf',
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.4)',
          // child embedding should be disabled here
        },
        paletteOrder: 2,
        //scope: '', // will be specified later
      },
      /**
       * Edges (arrows)
       */
      {
        '@id': 'mktp:CardToCategoryArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        title: 'в категории',
        description: 'Карточка товара состоит в категории',
        paletteOrder: 3,
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          open: true,
        },
        resultsScope: 'rm:Arrows_CollConstr',
      },
      {
        '@id': 'mktp:SubcategoryArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        title: 'подкатегория',
        description: 'Подкатегория в категории',
        paletteOrder: 4,
        // styles for targetMarker
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          fill: 'white',
        },
        resultsScope: 'rm:Arrows_CollConstr',
      },
      {
        '@id': 'mktp:CardToProductArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        title: 'похожесть',
        description: 'Карточка похожего товара объединена по сходству в один тоавр',
        paletteOrder: 4,
        // styles for targetMarker
        targetMarker: {
          name: 'block',
          strokeWidth: 1,
          fill: 'black',
        },
        resultsScope: 'rm:Arrows_CollConstr',
      },
    ],
  },
];

export const viewDescrs = [
  {
    '@id': 'mktp:CardView',
    '@type': 'rm:View',
    title: 'Товарный граф',
    description: 'Товарный граф маркетплейса',
    viewKind: viewKinds[0]['@id'],
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
        entConstrs: [
          {
            '@id': 'rm:RootNodes_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'rm:RootNodes_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'mktp:CardView',
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
        '@id': 'rm:Arrows_CollConstr',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'rm:Arrows_EntConstr_0',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'rm:Arrows_EntConstr_0_Condition',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
              object: 'mktp:CardView',
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
];

export const rootModelInitialState3 = {
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
    // ViewKind
    [viewKindCollConstr['@id']]: {
      '@id': viewKindCollConstr['@id'],
      collConstr: viewKindCollConstr,
      dataIntrnl: viewKinds,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewData
    [viewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataRootCardNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [viewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': viewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: viewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataCardArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};
