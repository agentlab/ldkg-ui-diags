import moment from 'moment';
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';

import { SparqlClientImpl, rootModelInitialState, CollState } from '@agentlab/sparql-jsld-client';
import {
  createUiModelFromState,
  MstContextProvider,
  registerMstViewKindSchema,
  viewKindCollConstr,
  viewDescrCollConstr,
  Form,
  antdCells,
  antdControlRenderers,
  antdLayoutRenderers,
} from '@agentlab/ldkg-ui-react';

import { MstDiagramNodeVKElement, MstDiagramEdgeVKElement } from '../src/stores/MstDiagramEditorSchemas';
import { graphRenderers } from '../src/components/graphRenderer';

import '@antv/x6/dist/x6.css';
import '../src/index.css';
import '../src/App.css';

/**
 * Mktp Graph + SplitPane ViewKinds
 */
const mktpGraphViewKinds = [
  {
    '@id': 'mktp:_8g34sKh',
    '@type': 'aldkg:ViewKind',
    collsConstrs: [
      // Categories
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
            schema: 'hs:CategoryShape',
          },
        ],
      },
      // Products
      {
        '@id': 'mktp:_58DfdH',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_oG67s',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_64G7Fd',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_8Fd5S',
            '@type': 'aldkg:EntConstr',
            schema: 'mktp:ProductShape',
          },
        ],
      },
      // ProductCards
      {
        '@id': 'mktp:_lf68D7',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_q8H6d',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_90Hgs6',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_4hg5Df',
            '@type': 'aldkg:EntConstr',
            schema: 'hs:ProductCardShape',
          },
        ],
      },
      // SubcatInCatLink
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
      // CardInCatLink
      {
        '@id': 'mktp:_fS67d',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_kf578s',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_9kJgd8',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_o6sD6f',
            '@type': 'aldkg:CollConstr',
            schema: 'hs:CardInCatLinkShape',
          },
        ],
      },
      // CardInProdLink
      {
        '@id': 'mktp:_ld98Sdg',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_5Sd7fG',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_67Aqw6D',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_n90D6sf',
            '@type': 'aldkg:CollConstr',
            schema: 'mktp:CardInProdLinkShape',
          },
        ],
      },
    ],
    elements: [
      {
        '@id': 'mktp:_45hfg93',
        '@type': 'aldkg:DiagramEditorVKElement',
        elements: [
          /**
           * Nodes
           */
          {
            '@id': 'mktp:CategoryStencil', // stencil should be registered under this @id
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:CardNode', //reference to the base stencil which should be customized additionally with 'style' and registered under the different id from @id property
            resultsScope: 'mktp:_kwe56Hgs',
            // img, title, description are the fields from Cart stencil
            img: {
              fallback:
                'data:image/png;base64,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',
              scope: 'subject/imageUrl',
            },
            title: {
              default: 'Категория',
              scope: 'subject/name',
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
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:CardNode',
            resultsScope: 'mktp:_58DfdH',
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
            '@type': 'aldkg:DiagramNodeVKElement',
            protoStencil: 'aldkg:CardNode',
            resultsScope: 'mktp:_lf68D7',
            img: {
              fallback:
                'data:image/png;base64,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',
              scope: 'subject/imageUrl',
            },
            title: {
              default: 'ProductCard',
              scope: 'subject/name',
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
            '@type': 'aldkg:DiagramEdgeVKElement',
            protoStencil: 'aldkg:CardNode',
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
            '@type': 'aldkg:DiagramEdgeVKElement',
            protoStencil: 'aldkg:CardNode',
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
            '@type': 'aldkg:DiagramEdgeVKElement',
            protoStencil: 'aldkg:CardNode',
            resultsScope: 'mktp:_ld98Sdg',
            title: 'похожесть',
            description: 'Карточка похожего товара объединена по сходству в один товар',
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
    ],
  },
];

/**
 * Mktp Graph + SplitPane ViewKinds
 */
const mktpGraphSplitPaneViewKinds = [
  {
    '@id': 'mktp:_8g34sKh',
    '@type': 'aldkg:ViewKind',
    collsConstrs: [
      {
        '@id': 'mktp:ProductCards_in_Category_Coll',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:ProductCards_in_Category_Coll_Ent0',
            '@type': 'aldkg:EntConstr',
            schema: 'hs:ProductCardShape',
            conditions: {
              '@id': 'mktp:ProductCards_in_Category_Coll_Ent0_con',
              '@_id': 'https://www.wildberries.ru/catalog/16170086/detail.aspx',
            },
          },
        ],
      },
      // Categories
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
            schema: 'hs:CategoryShape',
          },
        ],
      },
      // Products
      {
        '@id': 'mktp:_58DfdH',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_oG67s',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_64G7Fd',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_8Fd5S',
            '@type': 'aldkg:EntConstr',
            schema: 'mktp:ProductShape',
          },
        ],
      },
      // ProductCards
      {
        '@id': 'mktp:_lf68D7',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_q8H6d',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsRootNodeShape',
            conditions: {
              '@id': 'mktp:_90Hgs6',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_4hg5Df',
            '@type': 'aldkg:EntConstr',
            schema: 'hs:ProductCardShape',
          },
        ],
      },
      // SubcatInCatLink
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
      // CardInCatLink
      {
        '@id': 'mktp:_fS67d',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_kf578s',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_9kJgd8',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_o6sD6f',
            '@type': 'aldkg:CollConstr',
            schema: 'hs:CardInCatLinkShape',
          },
        ],
      },
      // CardInProdLink
      {
        '@id': 'mktp:_ld98Sdg',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'mktp:_5Sd7fG',
            '@type': 'aldkg:EntConstr',
            schema: 'aldkg:UsedInDiagramAsArrowShape',
            conditions: {
              '@id': 'mktp:_67Aqw6D',
              '@type': 'aldkg:EntConstrCondition',
              subject: '?eIri1',
            },
          },
          {
            '@id': 'mktp:_n90D6sf',
            '@type': 'aldkg:CollConstr',
            schema: 'mktp:CardInProdLinkShape',
          },
        ],
      },
    ],
    elements: [
      {
        '@id': 'mktp:_934Jfg7',
        '@type': 'aldkg:SplitPaneLayout',
        options: {
          style: {
            width: '100%',
            height: '100%',
          },
          defaultSize: {
            'mktp:_45hfg93': '70%',
            'mktp:_45hfgll': '30%',
          },
          height: 'all-empty-space',
        },
        elements: [
          {
            '@id': 'mktp:_45hfg93',
            '@type': 'aldkg:DiagramEditorVKElement',
            options: {
              connections: [{ to: 'mktp:ProductCards_in_Category_Coll_Ent0_con', by: '@_id' }],
            },
            elements: [
              /**
               * Nodes
               */
              {
                '@id': 'mktp:CategoryStencil', // stencil should be registered under this @id
                '@type': 'aldkg:DiagramNodeVKElement',
                protoStencil: 'aldkg:CardNode', //reference to the base stencil which should be customized additionally with 'style' and registered under the different id from @id property
                resultsScope: 'mktp:_kwe56Hgs',
                // img, title, description are the fields from Cart stencil
                img: {
                  fallback:
                    'data:image/png;base64,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',
                  scope: 'subject/imageUrl',
                },
                title: {
                  default: 'Категория',
                  scope: 'subject/name',
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
                '@type': 'aldkg:DiagramNodeVKElement',
                protoStencil: 'aldkg:CardNode',
                resultsScope: 'mktp:_58DfdH',
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
                '@type': 'aldkg:DiagramNodeVKElement',
                protoStencil: 'aldkg:CardNode',
                resultsScope: 'mktp:_lf68D7',
                img: {
                  fallback:
                    'data:image/png;base64,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',
                  scope: 'subject/imageUrl',
                },
                title: {
                  default: 'ProductCard',
                  scope: 'subject/name',
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
                '@type': 'aldkg:DiagramEdgeVKElement',
                protoStencil: 'aldkg:CardNode',
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
                '@type': 'aldkg:DiagramEdgeVKElement',
                protoStencil: 'aldkg:CardNode',
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
                '@type': 'aldkg:DiagramEdgeVKElement',
                protoStencil: 'aldkg:CardNode',
                resultsScope: 'mktp:_ld98Sdg',
                title: 'похожесть',
                description: 'Карточка похожего товара объединена по сходству в один товар',
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
          {
            '@id': 'rm:_83hd7f',
            '@type': 'aldkg:FormLayout',
            elements: [
              {
                '@id': 'rm:_17Gj78',
                '@type': 'aldkg:Control',
                resultsScope: 'mktp:ProductCards_in_Category_Coll/@id',
              },
              {
                '@id': 'rm:_17Gj78',
                '@type': 'aldkg:Control',
                resultsScope: 'mktp:ProductCards_in_Category_Coll/brand',
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Mktp Cards ViewDescrs
 */
const mktpViewDescrs = [
  {
    '@id': 'mktp:_kg67SdfL',
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
            '@id': 'mktp:_94SdFh5',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_aS57dj', // parent EntConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
            conditions: {
              '@id': 'mktp:_2Yud6',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_Sdf72d', // parent Condition, used @ prefix to avoid collisions with conditions (our extension of JSON-LD)
              object: 'mktp:_kg67SdfL', // all the inheritance thing just to add this field!!!
            },
          },
        ],
      },
      // Form nodes
      /*{
        '@id': 'mktp:_8Df89f1',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_kwe56Hgs1', // parent CollConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
        entConstrs: [
          {
            '@id': 'mktp:_94SdFh51',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_3Kjd6sF1', // parent EntConstr, used @ prefix to avoid collisions with domain props (our extension of JSON-LD)
            conditions: {
              '@id': 'mktp:_2Yud61',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_Sdf72d1', // parent Condition, used @ prefix to avoid collisions with conditions (our extension of JSON-LD)
              object: 'mktp:_kg67SdfL', // all the inheritance thing just to add this field!!!
            },
          },
        ],
      },*/

      // Products (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_s7Df8sj',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_58DfdH',
        entConstrs: [
          {
            '@id': 'mktp:_3K7Dhc6',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_oG67s',
            conditions: {
              '@id': 'mktp:_jd8Fk7',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_64G7Fd',
              object: 'mktp:_kg67SdfL',
            },
          },
        ],
      },
      // ProductCards (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_w67djf',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_lf68D7',
        entConstrs: [
          {
            '@id': 'mktp:_q8H6d',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_oG67s',
            conditions: {
              '@id': 'mktp:_90Hgs6',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_64G7Fd',
              object: 'mktp:_kg67SdfL',
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
              object: 'mktp:_kg67SdfL',
            },
          },
        ],
      },
      // CardInCatLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_kdF79s',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_fS67d',
        entConstrs: [
          {
            '@id': 'mktp:_We7fj6',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_kf578s',
            conditions: {
              '@id': 'mktp:_fjs7Sf',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_9kJgd8',
              object: 'mktp:_kg67SdfL',
            },
          },
        ],
      },
      // CardInProdLink (coll constr, inherited from ViewKind)
      {
        '@id': 'mktp:_aQ7dkf',
        '@type': 'aldkg:CollConstr',
        '@parent': 'mktp:_ld98Sdg',
        entConstrs: [
          {
            '@id': 'mktp:_Lkdjf73',
            '@type': 'aldkg:EntConstr',
            '@parent': 'mktp:_5Sd7fG',
            conditions: {
              '@id': 'mktp:_sDf78D',
              '@type': 'aldkg:EntConstrCondition',
              '@parent': 'mktp:_67Aqw6D',
              object: 'mktp:_kg67SdfL',
            },
          },
        ],
      },
    ],
    elements: [
      {
        '@id': 'mktp:_df734jk',
        '@type': 'aldkg:DiagramEditorVDE', // control type
        '@parent': 'mktp:_45hfg93',
        title: 'Товарный граф',
        description: 'Товарный граф маркетплейса',
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
      },
    ],
  },
];

/**
 * Collections Configs Data
 */
const additionalGraphColls: CollState[] = [
  // ViewKinds Collection
  {
    constr: viewKindCollConstr,
    data: mktpGraphViewKinds,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // disable data loading from the server for viewKinds.collConstrs
    },
  },
  // ViewDescrs Collection
  {
    constr: viewDescrCollConstr,
    data: mktpViewDescrs,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // 'true' here (by default) triggers data loading from the server
      // for viewDescrs.collConstrs (it loads lazily -- after the first access)
    },
  },
];

const additionalGraphSplitPaneColls: CollState[] = [
  // ViewKinds Collection
  {
    constr: viewKindCollConstr,
    data: mktpGraphSplitPaneViewKinds,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // disable data loading from the server for viewKinds.collConstrs
    },
  },
  // ViewDescrs Collection
  {
    constr: viewDescrCollConstr,
    data: mktpViewDescrs,
    opt: {
      updPeriod: undefined,
      lastSynced: moment.now(),
      //resolveCollConstrs: false, // 'true' here (by default) triggers data loading from the server
      // for viewDescrs.collConstrs (it loads lazily -- after the first access)
    },
  },
];

export default {
  title: 'GraphEditor/GraphRenderer',
  component: Form,
} as Meta;

const Template: Story<any> = ({ viewDescrCollId, viewDescrId, additionalColls }) => {
  const renderers = [...antdLayoutRenderers, ...graphRenderers, ...antdControlRenderers];
  registerMstViewKindSchema(MstDiagramNodeVKElement);
  registerMstViewKindSchema(MstDiagramEdgeVKElement);

  const client = new SparqlClientImpl('https://rdf4j.agentlab.ru/rdf4j-server');
  const rootStore = createUiModelFromState('mktp', client, rootModelInitialState, additionalColls);
  //@ts-ignore
  //const rootStore = Repository.create(mktpModelInitialState, { client });
  const store: any = asReduxStore(rootStore);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  connectReduxDevtools(require('remotedev'), rootStore);
  return (
    <div style={{ height: 'calc(100vh - 32px)' }}>
      <Provider store={store}>
        <MstContextProvider store={rootStore} renderers={renderers}>
          <Form viewDescrCollId={viewDescrCollId} viewDescrId={viewDescrId} />
        </MstContextProvider>
      </Provider>
    </div>
  );
};

export const RemoteDataGraph = Template.bind({});
RemoteDataGraph.args = {
  viewDescrCollId: viewDescrCollConstr['@id'],
  viewDescrId: mktpViewDescrs[0]['@id'],
  additionalColls: additionalGraphColls,
};

export const RemoteDataGraphSplitPane = Template.bind({});
RemoteDataGraphSplitPane.args = {
  viewDescrCollId: viewDescrCollConstr['@id'],
  viewDescrId: mktpViewDescrs[0]['@id'],
  additionalColls: additionalGraphSplitPaneColls,
};
