var jsld_client = require("@agentlab/sparql-jsld-client");
var schema = require("./schema.js");

(async () => {
	var rootStore = jsld_client.rootStore;
	const rdfServerUrl = "https://expert.agentlab.ru/rdf4j-server";
	rootStore.server.setURL(rdfServerUrl);
	const repository = rootStore.server.repository;
	const repositoryID = "jsld_test";
	const repositoryType = "native-rdfs";
	const repositoryParam = {};
	await repository.deleteRepository(repositoryID);
	await repository.createRepository(
		{
			...repositoryParam,
			"Repository ID": repositoryID,
		},
		repositoryType
	);
	repository.setId(repositoryID);
	const files = [
		{ file: "test.ttl", baseURI: "<http://agentlab.ru/jsld_test#>" },
	];
	const rootFolder = "./";
	await repository.uploadFiles(files, rootFolder);

	// data = await repository.selectObjects(schema.PropertyShapeSchema);
	// console.log(JSON.stringify(data));
})();
