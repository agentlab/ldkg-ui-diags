import { UiModel, uiModelInitialState, SparqlClientImpl, ArtifactShapeSchema, PropertyShapeSchema } from "@agentlab/sparql-jsld-client";
import { rdfServerUrl, rmRepositoryParam } from '../config';

const client = new SparqlClientImpl(rdfServerUrl);
let initialState = UiModel.create(uiModelInitialState, {
  client,
});

export const rootStore = initialState;

//Server endpoint
//Это объект синглтон, однократная инициализация
if (rootStore.ns.current.size < 5) {
	//rootStore.setURL(rdfServerUrl);
	rootStore.setId(rmRepositoryParam['Repository ID']);
	rootStore.ns.reloadNs();
}

export const viewDescr = {
	'@id': 'rm:DataModelView',
	'@type': 'rm:View',
	title: 'Модель данных',
	description: 'Модель данных хранилища на основе SHACL Shapes',
	type: 'VerticalLayout',
};

export const collsConstrs: any[] = [
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
];

export const collsConstrs2: any[] = [
	{
	  // globally unique ID of this Query object, could be used for references in mobx JSON-LD storage or server storage, not processed by query generator
	  '@id': 'rm:ProjectViewClass_Artifacts_Query',
	  '@type': 'rm:Query',
	  entConstrs: [
		{
		  // globally unique ID of this Shape object, could be used for references in mobx JSON-LD storage or server storage, not processed by query generator
		  '@id': 'rm:ProjectViewClass_Artifacts_Query_Shape0',
		  //'@type': 'rm:QueryShape',
		  // JSON Schema (often same as Class IRI), required!
		  // it could be schema object or class IRI string
		  schema: 'rm:ArtifactShape',
		  // key-value {}:JsObject, could be omitted
		  conditions: {
			// globally unique ID of this Condition object, could be used for references in mobx JSON-LD storage or server storage, not processed by query generator
			//'@id': 'rm:ProjectViewClass_Artifacts_Query_Shape0_Condition',
			// globally unique ID of the Class of this condition object, could be used for mobx JSON-LD storage or server storage, not processed by query generator
			//'@type': 'rm:QueryCondition',
			//'@_id':
			//'@_type':
			assetFolder: 'folders:samples_collection',
		  },
		  //variables: {},
		  //fields: [], //string[]
		},
	  ],
	  // could be string or string[]. varname or property IRI?
	  // ['?identifier0', 'DESC(?title0)']
	  //orderBy: [{ expression: variable('identifier0'), descending: false }], // if last digit not specified, we assuming '0' (identifier0)
	  //limit: 50,
	},
	{
	  '@id': 'rm:ProjectViewClass_Folders_Query',
	  '@type': 'rm:Query',
	  entConstrs: [
		{
		  '@id': 'rm:ProjectViewClass_Folders_Query_Shape0',
		  '@type': 'rm:QueryShape',
		  schema: 'nav:folderShape',
		},
	  ],
	},
	{
	  '@id': 'rm:ProjectViewClass_Users_Query',
	  '@type': 'rm:Query',
	  entConstrs: [
		{
		  '@id': 'rm:Users_Shape0',
		  '@type': 'rm:QueryShape',
		  schema: 'pporoles:UserShape',
		},
	  ],
	},
	{
	  '@id': 'rm:ProjectViewClass_ArtifactClasses_Query',
	  '@type': 'rm:Query',
	  entConstrs: [
		{
		  '@id': 'rm:ProjectViewClass_ArtifactClasses_Query_Shape0',
		  '@type': 'rm:QueryShape',
		  schema: 'rm:ArtifactClassesShape',
		},
	  ],
	},
	{
	  '@id': 'rm:ProjectViewClass_ArtifactFormats_Query',
	  '@type': 'rm:Query',
	  entConstrs: [
		{
		  '@id': 'rm:ProjectViewClass_ArtifactFormats_Query_Shape0',
		  '@type': 'rm:QueryShape',
		  schema: 'rmUserTypes:_YwcOsRmREemK5LEaKhoOowShape',
		},
	  ],
	},
  ];

/*const get_data = async () => {

	const shapes = await repository.selectObjects(NodeShapeSchema);
	const properties = await repository.selectObjects(PropertyShapeSchema);

	return {
		shapes: shapes,
		properties: properties,
	};
};

export { get_data };*/
