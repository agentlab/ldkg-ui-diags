import { Repository, rootModelInitialState, SparqlClientImpl, ArtifactShapeSchema, PropertyShapeSchema, ViewShapeSchema } from "@agentlab/sparql-jsld-client";
import { rdfServerUrl } from '../config';

const client = new SparqlClientImpl(rdfServerUrl);
//@ts-ignore
let initialState = Repository.create(rootModelInitialState, { client });

export const rootStore = initialState;

export const viewDescrs = [
	{
		'@id': 'rm:DataModelView',
		'@type': 'rm:View',
		title: 'Модель данных',
		description: 'Модель данных хранилища на основе SHACL Shapes',
		type: 'VerticalLayout',
		elements: [],
		collsConstrs: [
			{
				'@id': 'rm:NodeShapes_CollConstr',
				'@type': 'rm:CollConstr',
				entConstrs: [
				  {
					'@id': 'rm:NodeShapes_EntConstr0',
					'@type': 'rm:EntConstr',
					schema: ArtifactShapeSchema['@id'],
				  },
				],
			},
			{
				'@id': 'rm:PropertyShapes_CollConstr',
				'@type': 'rm:CollConstr',
				entConstrs: [
					{
						'@id': 'rm:PropertyShapes_EntConstr0',
						'@type': 'rm:EntConstr',
						schema: PropertyShapeSchema['@id'],
					},
				],
			},
		],
	}
];

export const viewDescrCollConstr = {
	'@id': 'rm:Views_Coll',
	entConstrs: [
	  {
		'@id': 'rm:Views_EntConstr0',
		schema: ViewShapeSchema,
	  }
	],
};
