import moment from 'moment';
import { rootModelInitialState } from '@agentlab/sparql-jsld-client';

import { viewDescrCollConstr, viewDescrs } from './view';

export const viewDataRootCardNodes = [
  {
    '@id': 'mktp:diagramNode0',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 10,
    y: 10,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      // ref to the model object
      '@id': 'mktp:Cat1',
      '@type': 'mktp:Category',
      title: 'Массажеры электрические',
      description: 'Массажеры электрические',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'rm:CardStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
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
      title: 'Массажная подушка роликовая',
      description: 'Электрический роликовый массажер для спины, шеи, плеч',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'rm:CardStencil', // ref to the stencil (type of the graphicsl sign, not instance of a sign)
  },
  {
    '@id': 'mktp:diagramNode2',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 10,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'https://www.wildberries.ru/catalog/15570386/detail.aspx',
      '@type': 'mktp:ProductCard',
      title: 'Электрическая массажная подушка релакс с подогревом...',
      description:
        'Электрическая массажная подушка релакс с подогревом / Массажер электрический для тела / шеи / спины',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/15570000/15570386-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/relax-massage',
        '@type': 'mktp:Brand',
        name: 'Relax Massage',
      },
      price: 1043,
      seller: {
        '@id': 'https://examples.ru/sellers/15570386',
        '@type': 'mktp:Seller',
        name: '',
      },
    },
    object: 'rm:DataModelView',
    stencil: 'rm:CardStencil',
  },
  {
    '@id': 'mktp:diagramNode3',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 250,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'https://www.wildberries.ru/catalog/15622789/detail.aspx',
      '@type': 'mktp:ProductCard',
      title: 'Массажная подушка с подогревом для дома и автомомобиля...',
      description:
        'Массажная подушка с подогревом для дома и автомомобиля массажер для шеи спины 8 роликов чудо релакс',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/15620000/15622789-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/happygoods',
        '@type': 'mktp:Brand',
        name: 'HappyGoods',
      },
      price: 964,
      seller: {
        '@id': 'https://examples.ru/sellers/15622789',
        '@type': 'mktp:Seller',
        name: '',
      },
    },
    object: 'rm:DataModelView',
    stencil: 'rm:CardStencil',
  },
  {
    '@id': 'mktp:diagramNode4',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 500,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'https://www.wildberries.ru/catalog/16170086/detail.aspx',
      '@type': 'mktp:ProductCard',
      title: 'Электрическая массажная подушка релакс с подогревом...',
      description:
        'Электрическая массажная подушка релакс с подогревом / Массажер электрический для тела / шеи / спины',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/16170000/16170086-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/doktor-aybolit',
        '@type': 'mktp:Brand',
        name: 'ДОКТОР АЙБОЛИТ',
      },
      price: 1304,
      seller: {
        '@id': 'https://examples.ru/sellers/16170086',
        '@type': 'mktp:Seller',
        name: '',
      },
    },
    object: 'rm:DataModelView',
    stencil: 'rm:CardStencil',
  },
  {
    '@id': 'mktp:diagramNode5',
    '@type': 'rm:UsedInDiagramAsRootNodeShape',
    x: 750,
    y: 320,
    z: 0,
    rotation: 0,
    height: 85,
    width: 230,
    subject: {
      '@id': 'https://www.wildberries.ru/catalog/18247707/detail.aspx',
      '@type': 'mktp:ProductCard',
      title: 'Массажер для спины шеи тела плеч ног...',
      description: 'Массажер для спины шеи тела плеч ног/ Электрический роликовый Массажер/ массаж шиацу',
      imageUrl: 'https://img2.wbstatic.net/c252x336/new/18240000/18247707-1.jpg',
      brand: {
        '@id': 'https://www.wildberries.ru/brands/massazher-dlya-shei-spiny-1',
        '@type': 'mktp:Brand',
        name: 'массажер для шеи спины №1',
      },
      price: 1559,
      seller: {
        '@id': 'https://examples.ru/sellers/18247707',
        '@type': 'mktp:Seller',
        name: '',
      },
    },
    object: 'rm:DataModelView',
    stencil: 'rm:CardStencil',
  },
];

/**
 * Arrows (reference properties)
 */
export const viewDataCardArrows = [
  {
    '@id': 'mktp:diagramArrow0',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode1', // ref to the arrow-connected graph node at the "from" end
    arrowTo: 'mktp:diagramNode0', // ref to the arrow-connected graph node at the "to" end
    //router: 'normal',
    router: 'manhattan',
    subject: {
      // ref to the model object
      '@id': 'rm:creatorShape',
      '@type': 'sh:PropertyShape',
      name: 'Подкатегория',
    },
    object: 'rm:DataModelView', // ref to the diagram
    stencil: 'rm:AssociationArrowStencil',
  },
  {
    '@id': 'mktp:diagramArrow1',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode2',
    arrowTo: 'mktp:diagramNode1',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      name: 'Похожий товар',
    },
    object: 'rm:DataModelView',
    stencil: 'rm:AssociationArrowStencil',
  },
  {
    '@id': 'mktp:diagramArrow2',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode3',
    arrowTo: 'mktp:diagramNode1',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      name: 'Похожий товар',
    },
    object: 'rm:DataModelView',
    stencil: 'rm:AssociationArrowStencil',
  },
  {
    '@id': 'mktp:diagramArrow3',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode4',
    arrowTo: 'mktp:diagramNode1',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      name: 'Похожий товар',
    },
    object: 'rm:DataModelView',
    stencil: 'rm:AssociationArrowStencil',
  },
  {
    '@id': 'mktp:diagramArrow4',
    '@type': 'rm:UsedInDiagramAsArrow',
    x: 10,
    y: 10,
    z: 2,
    width: 1,
    arrowFrom: 'mktp:diagramNode5',
    arrowTo: 'mktp:diagramNode1',
    subject: {
      '@id': 'rm:modifiedByShape',
      '@type': 'sh:PropertyShape',
      name: 'Похожий товар',
    },
    object: 'rm:DataModelView',
    stencil: 'rm:AssociationArrowStencil',
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
