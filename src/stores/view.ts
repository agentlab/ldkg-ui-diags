import { ArtifactShapeSchema, PropertyShapeSchema, ViewShapeSchema } from "@agentlab/sparql-jsld-client";
import { viewKinds } from "./viewKinds";

export const viewDescrCollConstr = {
	'@id': 'rm:Views_Coll',
	entConstrs: [
	  {
		'@id': 'rm:Views_EntConstr0',
		schema: ViewShapeSchema,
	  }
	],
};

export const viewDescrs = [
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
	}
];

export const viewDataShapes = [
	{
		'@id': 'jsld:PersonShape',
		'@type': 'sh:NodeShape',
		title: 'Person',
		description: 'Person',
		targetClass: 'jsld:Person',
		property: [
			{
				'@id': 'jsld:GivenNamePropertyShape',
				//'@type': 'sh:PropertyShape',
				//name: 'given name',
				//path: 'jsld:givenName',
				//datatype: 'xsd:string'
			},
			{
				'@id': 'jsld:BirthDatePropertyShape',
				//'@type': 'sh:PropertyShape',
				//path: 'jsld:birthDate',
				//maxCount: 1
			},
			{
				'@id': 'jsld:GenderPropertyShape',
				//'@type': 'sh:PropertyShape',
				//path: 'jsld:gender'
			},
			{
				'@id': 'jsld:AddressPropertyShape',
				//'@type': 'sh:PropertyShape',
				//path: 'jsld:address'
			}
		]
	},
	{
		'@id': 'jsld:AddressShape',
		'@type': 'sh:NodeShape',
		title: 'Address',
		description: 'Address',
		targetClass: 'jsld:Address',
		//property: []
	}
];

export const viewDataProperties = [
	{
		'@id': 'jsld:GivenNamePropertyShape',
		'@type': 'sh:PropertyShape',
		name: 'Given Name',
		description: 'Given Name',
		path: 'jsld:givenName',
		datatype: 'xsd:string'
	},
	{
		'@id': 'jsld:BirthDatePropertyShape',
		'@type': 'sh:PropertyShape',
		name: 'Birth Date',
		description: 'Birth Date',
		path: 'jsld:birthDate',
		maxCount: 1
	},
	{
		'@id': 'jsld:GenderPropertyShape',
		'@type': 'sh:PropertyShape',
		name: 'Gender',
		description: 'Gender',
		path: 'jsld:gender'
	},
	{
		'@id': 'jsld:AddressPropertyShape',
		'@type': 'sh:PropertyShape',
		name: 'Address',
		description: 'Address',
		path: 'jsld:address',
		node: 'jsld:AddressShape'
	}
];