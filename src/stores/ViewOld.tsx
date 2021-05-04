import { ArtifactShapeSchema, PropertyShapeSchema, ViewShapeSchema } from '@agentlab/sparql-jsld-client';

/**
 * OLD Samples
 */

export const viewDescrCollConstr0 = {
  '@id': 'rm:Views_Coll',
  entConstrs: [
    {
      '@id': 'rm:Views_EntConstr0',
      schema: ViewShapeSchema,
    },
  ],
};

export const viewDescrs0 = [
  {
    '@id': 'rm:DataModelView',
    '@type': 'rm:View',
    title: 'Модель данных',
    description: 'Модель данных хранилища на основе SHACL Shapes',
    //viewKind: viewKinds[0]['@id'],
    type: 'VerticalLayout',
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
        '@id': 'rm:NodeShapes_CollConstr',
        '@type': 'rm:CollConstr',
        entConstrs: [
          {
            '@id': 'rm:NodeShapes_EntConstr0',
            '@type': 'rm:EntConstr',
            schema: ArtifactShapeSchema['@id'],
            conditions: {
              '@id': 'rm:PropertyShapes_CollConstr_condition',
              '@type': 'cond type',
              property: '?eIri1',
            },
          },
          {
            '@id': 'rm:PropertyShapes_CollConstr_1',
            '@type': 'rm:CollConstr',
            schema: PropertyShapeSchema['@id'],
          },
        ],
        limit: 1,
      },
    ],
  },
  {
    '@id': 'rm:GraphView',
    '@type': 'rm:View',
    title: 'Граф данных',
    description: 'Граф данных хранилища на основе SHACL Shapes',
    //viewKind: viewKinds[1]['@id'],
    type: 'VerticalLayout',
    elements: [],
  },
];
