import { ViewKindShapeSchema } from '@agentlab/sparql-jsld-client';

export const viewKindCollConstr = {
  '@id': 'rm:ViewKinds_Coll',
  entConstrs: [
    {
      '@id': 'rm:ViewKinds_EntConstr0',
      schema: 'rm:ViewKindShape',
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
        '@id': 'rm:AssociationArrowStencil',
        type: 'DiagramEdge',
        resultsScope: 'rm:Arrows_CollConstr',
        line: {
          stroke: '#808080',
          strokeWidth: 1,
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
