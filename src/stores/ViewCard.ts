import moment from 'moment';
import { rootModelInitialState } from '@agentlab/sparql-jsld-client';

import { viewDescrCollConstr } from './view';
import { viewKindCollConstr } from './viewKinds';

// @prefix wbc: <https://www.wildberries.ru/catalog/>

/***************************************
 * ViewKinds & ViewDescrs Data
 ***************************************/

/**
 * Mktp Cards ViewKinds
 */
export const mktpViewKinds = [
  {
    '@id': 'mktp:_8g34sKh',
    '@type': 'rm:ViewKind',
    type: 'DiagramEditor',
    collsConstrs: [
      // Categories
      {
        '@id': 'mktp:_kwe56Hgs',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_aS57dj',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_Sdf72d',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_3Kjd6sF',
            '@type': 'rm:EntConstr',
            schema: 'hs:CategoryShape',
          },
        ],
      },
      // Products
      {
        '@id': 'mktp:_58Dfdh',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_oG67s',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_64G7Fd',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_8Fd5S',
            '@type': 'rm:EntConstr',
            schema: 'hs:ProductShape',
          },
        ],
      },
      // ProductCards
      {
        '@id': 'mktp:_lf68D7',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_q8H6d',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_90Hgs6',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_4hg5Df',
            '@type': 'rm:EntConstr',
            schema: 'hs:ProductShape',
          },
        ],
      },
      // SubcatInCatLink
      {
        '@id': 'mktp:_js5Jdf',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_Sdf73k',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_9kJgd8',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_p9Dsk6',
            '@type': 'rm:CollConstr',
            schema: 'hs:SubcatInCatLinkShape',
          },
        ],
      },
      // CardInCatLink
      {
        '@id': 'mktp:_fS67d',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_kf578s',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_9kJgd8',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_o6sD6f',
            '@type': 'rm:CollConstr',
            schema: 'hs:CardInCatLinkShape',
          },
        ],
      },
      // CardInProdLink
      {
        '@id': 'mktp:_ld98Sdg',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_5Sd7fG',
            '@type': 'rm:EntConstr',
            schema: 'rm:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_67Aqw6D',
              '@type': 'rm:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_n90D6sf',
            '@type': 'rm:CollConstr',
            schema: 'hs:CardInProdLinkShape',
          },
        ],
      },
    ],
    elements: [
      /**
       * Nodes
       */
      {
        '@id': 'mktp:CategoryStencil', // stencil should be registered under thos @id
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil', //reference to the base stencil which should be customized additionaly with 'style' and registered under the different id from @id property
        resultsScope: 'mktp:_kwe56Hgs',
        // img, title, description are the fields from Cart stencil
        img: {
          fallback:
            'data:image/png;base64,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',
          scope: 'subject/imageUrl',
        },
        title: {
          default: 'Категория',
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
        '@id': 'mktp:ProductStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil',
        resultsScope: 'mktp:_58Dfdh',
        img: {
          fallback:
            'data:image/png;base64,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',
          scope: 'subject/imageUrl',
        },
        title: {
          default: 'Продукт',
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
        '@id': 'mktp:ProductCardStencil',
        type: 'DiagramNode',
        protoStencil: 'rm:CardStencil',
        resultsScope: 'mktp:_lf68D7',
        img: {
          fallback:
            'data:image/png;base64,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',
          scope: 'subject/imageUrl',
        },
        title: {
          default: 'ProductCard',
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
      /**
       * Edges (arrows)
       */
      {
        '@id': 'mktp:SubcategoryArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        resultsScope: 'mktp:_js5Jdf',
        title: 'подкатегория',
        description: 'Подкатегория в категории',
        paletteOrder: 4,
        // styles for targetMarker
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: {
            name: 'block',
            strokeWidth: 1,
            fill: 'white',
          },
        },
      },
      {
        '@id': 'mktp:CardToCategoryArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        resultsScope: 'mktp:_fS67d',
        title: 'в категории',
        description: 'Карточка товара состоит в категории',
        paletteOrder: 3,
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: {
            name: 'block',
            strokeWidth: 1,
            open: true,
          },
        },
      },
      {
        '@id': 'mktp:CardToProductArrowStencil',
        type: 'DiagramEdge',
        protoStencil: 'rm:CardStencil',
        resultsScope: 'mktp:_ld98Sdg',
        title: 'похожесть',
        description: 'Карточка похожего товара объединена по сходству в один тоавр',
        paletteOrder: 4,
        // styles for targetMarker
        line: {
          stroke: '#808080',
          strokeWidth: 1,
          targetMarker: {
            name: 'block',
            strokeWidth: 1,
            fill: '#808080',
          },
        },
      },
    ],
  },
];

/**
 * Mktp Cards ViewDescrs
 */
export const mktpViewDescrs = [
  {
    '@id': 'mktp:_kg67Sdfl',
    '@type': 'rm:View',
    title: 'Товарный граф',
    description: 'Товарный граф маркетплейса',
    viewKind: 'mktp:_8g34sKh',
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
      toolbar: false,
    },
    collsConstrs: [
      // Categories (coll constr, inherited from ViewKind, parent references in '@parent' fields, which are our extension of JSON-LD)
      {
        '@id': 'mktp:_8Df89f',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_kwe56Hgs', // parent CollConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
        entConstrs: [
          {
            '@id': 'mktp:_94Sdfh5',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_aS57dj', // parent EntConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
            conditions: {
              '@id': 'mktp:_2Yud6',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_Sdf72d', // parent Cond, used @ prefix to avoid collisions with conditions (our extension of JSON-LD)
              object: 'mktp:_kg67Sdfl', // all the inheritance thing just to add this field!!!
            },
          },
        ],
      },
      // Products (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_s7Df8sj',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_58Dfdh',
        entConstrs: [
          {
            '@id': 'mktp:_3K7Dhc6',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_oG67s',
            conditions: {
              '@id': 'mktp:_jd8Fk7',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_64G7Fd',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
      // ProductCards (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_w67djf',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_lf68D7',
        entConstrs: [
          {
            '@id': 'mktp:_q8H6d',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_oG67s',
            conditions: {
              '@id': 'mktp:_90Hgs6',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_64G7Fd',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
      // SubcatInCatLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_od8S6f',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_js5Jdf',
        entConstrs: [
          {
            '@id': 'mktp:_2Yd7G',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_Sdf73k',
            conditions: {
              '@id': 'mktp:_kd7DQmd',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_9kJgd8',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
      // CardInCatLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_kdF79s',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_fS67d',
        entConstrs: [
          {
            '@id': 'mktp:_We7fj6',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_kf578s',
            conditions: {
              '@id': 'mktp:_fjs7Sf',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_9kJgd8',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
      // CardInProdLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_aQ7dkf',
        '@type': 'rm:CollConstr',
        '@parent': 'mktp:_ld98Sdg',
        entConstrs: [
          {
            '@id': 'mktp:_Lkdjf73',
            '@type': 'rm:EntConstr',
            '@parent': 'mktp:_5Sd7fG',
            conditions: {
              '@id': 'mktp:_sDf78D',
              '@type': 'rm:EntConstrCondition',
              '@parent': 'mktp:_67Aqw6D',
              object: 'mktp:_kg67Sdfl',
            },
          },
        ],
      },
    ],
  },
];

/***************************************
 * Diagram Nodes
 ***************************************/

export const viewDataCategoryNodes = [
  {
    '@id': 'mktp:diagramNode01',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramNode02',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramNode03',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl', // ref to the diagram
  },
];

export const viewDataProductNodes = [
  {
    '@id': 'mktp:diagramNode11',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramNode12',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
];

export const viewDataProductCardNodes = [
  {
    '@id': 'mktp:diagramNode21',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramNode22',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramNode23',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramNode24',
    '@type': 'rm:UsedInDiagramAsRootNode',
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
    object: 'mktp:_kg67Sdfl',
  },
];

/***************************************
 * Arrows
 ***************************************/

/**
 * Отношения между 3 категориями
 */
export const viewDataSubcatInCatArrows = [
  {
    '@id': 'mktp:diagramArrow01',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:SubcategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode02', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode01', // ref to the arrow-connected graph node at the "to" end
    //router: 'manhattan',
    // ref to the model object
    subject: {
      '@id': 'mktp:sc01',
      '@type': 'hs:SubcatInCatLink',
      subject: 'wbc:zdorove/ozdorovlenie',
      object: 'wbc:dom-i-dacha/zdorove',
      name: 'подкатегория',
    },
    object: 'mktp:_kg67Sdfl', // ref to the diagram
  },
  {
    '@id': 'mktp:diagramArrow02',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:SubcategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode03',
    arrowTo: 'mktp:diagramNode02',
    subject: {
      '@id': 'mktp:sc02',
      '@type': 'hs:SubcatInCatLink',
      subject: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      object: 'wbc:zdorove/ozdorovlenie',
      name: 'подкатегория',
    },
    object: 'mktp:_kg67Sdfl',
  },
];

/**
 * 4 товара в категории 03
 */
export const viewDataCardInCatArrows = [
  {
    '@id': 'mktp:diagramArrow11',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode21',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cicl1',
      '@type': 'hs:CardInCatLink',
      subject: 'wbc:15570386/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow12',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode22',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cicl2',
      '@type': 'hs:CardInCatLink',
      subject: 'wbc:15622789/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow13',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode23',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cicl3',
      '@type': 'hs:CardInCatLink',
      subject: 'wbc:16170086/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow14',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToCategoryArrowStencil',
    arrowFrom: 'mktp:diagramNode24',
    arrowTo: 'mktp:diagramNode03',
    subject: {
      '@id': 'mktp:cicl4',
      '@type': 'hs:CardInCatLink',
      subject: 'wbc:18247707/detail.aspx',
      object: 'wbc:zdorove/ozdorovlenie?sort=popular&page=1&xsubject=594',
      name: 'в категории',
    },
    object: 'mktp:_kg67Sdfl',
  },
];

/**
 * 3 товара в продукте1 и 1 товар в продукте 2
 */
export const viewDataCardInProdArrows = [
  {
    '@id': 'mktp:diagramArrow21',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode21',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'mktp:cipl1',
      '@type': 'hs:CardInProdLink',
      subject: 'wbc:15570386/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow22',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode22',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'mktp:cipl2',
      '@type': 'hs:CardInProdLink',
      subject: 'wbc:15622789/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow23',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode23',
    arrowTo: 'mktp:diagramNode11',
    subject: {
      '@id': 'mktp:cipl3',
      '@type': 'hs:CardInProdLink',
      subject: 'wbc:16170086/detail.aspx',
      object: 'mktp:Product1',
      name: 'похожесть',
    },
    object: 'mktp:_kg67Sdfl',
  },
  {
    '@id': 'mktp:diagramArrow24',
    '@type': 'rm:UsedInDiagramAsArrow',
    stencil: 'mktp:CardToProductArrowStencil',
    arrowFrom: 'mktp:diagramNode24',
    arrowTo: 'mktp:diagramNode12',
    subject: {
      '@id': 'mktp:cipl4',
      '@type': 'hs:CardInProdLink',
      subject: 'wbc:18247707/detail.aspx',
      object: 'mktp:Product2',
      name: 'похожесть',
    },
    object: 'mktp:_kg67Sdfl',
  },
];

/**
 * Mktp Cards Initial Model State with all data
 */
export const mktpModelInitialState = {
  ...rootModelInitialState,
  colls: {
    ...rootModelInitialState.colls,
    // ViewKind
    [viewKindCollConstr['@id']]: {
      '@id': viewKindCollConstr['@id'],
      collConstr: viewKindCollConstr,
      dataIntrnl: mktpViewKinds,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewDescr
    [viewDescrCollConstr['@id']]: {
      '@id': viewDescrCollConstr['@id'],
      collConstr: viewDescrCollConstr,
      dataIntrnl: mktpViewDescrs,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewData -- Nodes
    [mktpViewDescrs[0].collsConstrs?.[0]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[0]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[0]['@id'], // reference by @id
      dataIntrnl: viewDataCategoryNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [mktpViewDescrs[0].collsConstrs?.[1]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[1]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[1]['@id'], // reference by @id
      dataIntrnl: viewDataProductNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [mktpViewDescrs[0].collsConstrs?.[2]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[2]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[2]['@id'], // reference by @id
      dataIntrnl: viewDataProductCardNodes,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    // ViewData -- Arrows
    [mktpViewDescrs[0].collsConstrs?.[3]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[3]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[3]['@id'], // reference by @id
      dataIntrnl: viewDataSubcatInCatArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [mktpViewDescrs[0].collsConstrs?.[4]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[4]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[4]['@id'], // reference by @id
      dataIntrnl: viewDataCardInCatArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
    [mktpViewDescrs[0].collsConstrs?.[5]['@id'] || '']: {
      '@id': mktpViewDescrs[0].collsConstrs?.[5]['@id'],
      collConstr: mktpViewDescrs[0].collsConstrs?.[5]['@id'], // reference by @id
      dataIntrnl: viewDataCardInProdArrows,
      updPeriod: undefined,
      lastSynced: moment.now(),
      resolveCollConstrs: false,
    },
  },
};
