import { rootStore } from "@agentlab/sparql-jsld-client";

import { PropertyShapeSchema, NodeShapeSchema } from "../schema";

const get_data = async () => {
	const rdfServerUrl = "https://expert.agentlab.ru/rdf4j-server";
	rootStore.server.setURL(rdfServerUrl);
	const repository = rootStore.server.repository;
	const repositoryID = "jsld_test";
	repository.setId(repositoryID);

	const shapes = await repository.selectObjects(NodeShapeSchema);
	const properties = await repository.selectObjects(PropertyShapeSchema);

	return {
		shapes: shapes,
		properties: properties,
	};
};

export { get_data };
