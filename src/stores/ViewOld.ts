import { ArtifactShapeSchema, PropertyShapeSchema } from '@agentlab/sparql-jsld-client';

/**
 * OLD Samples
 */

export const viewDescrs0 = [
  {
    '@id': 'rm:DataModelView',
    '@type': 'aldkg:ViewDescr',
    //viewKind: viewKinds[0]['@id'],
    collsConstrs: [
      {
        '@id': 'rm:NodeShapes_CollConstr',
        '@type': 'aldkg:CollConstr',
        entConstrs: [
          {
            '@id': 'rm:NodeShapes_EntConstr0',
            '@type': 'aldkg:EntConstr',
            schema: ArtifactShapeSchema['@id'],
            conditions: {
              '@id': 'rm:PropertyShapes_CollConstr_condition',
              '@type': 'cond type',
              property: '?eIri1',
            },
          },
          {
            '@id': 'rm:PropertyShapes_CollConstr_1',
            '@type': 'aldkg:CollConstr',
            schema: PropertyShapeSchema['@id'],
          },
        ],
        limit: 1,
      },
    ],
    elements: [
      {
        '@id': 'mktp:_30HdF6',
        '@type': 'aldkg:DiagramEditorVDE',
        //'@parent': 'mktp:_XXX',
        title: 'Модель данных',
        description: 'Модель данных хранилища на основе SHACL Shapes',
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
