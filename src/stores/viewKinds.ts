import { ViewKindShapeSchema } from '@agentlab/sparql-jsld-client';

export const viewKindCollConstr = {
  '@id': 'rm:ViewKinds_Coll',
  entConstrs: [
    {
      '@id': 'rm:ViewKinds_EntConstr0',
      schema: ViewKindShapeSchema,
    },
  ],
};

export const viewKinds = [
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
        layout: {
          vertical: 'wrap_content',
        },
        elements: [
          // general fields Compartment (key-value)
          {
            '@id': 'rm:GeneralCompartmentNodeStencil',
            type: 'DiagramNode',
            protoStencil: 'rm:TitledRectNodeStencil',
            title: 'General',
            height: 60,
            //scope: '!= property', // without scope
            layout: {
              vertical: 'wrap_content',
              horizontal: 'match_parent',
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
            layout: {
              vertical: 'wrap_content',
              horizontal: 'match_parent',
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
        '@id': 'rm:AssociationArrowStencil',
        type: 'DiagramEdge',
        resultsScope: 'rm:Arrows_CollConstr',
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
