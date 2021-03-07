
const class_view = {
	type: "canvas",
	elements: [
		{
			type: "class",
			scope: "shapes",
			layout: {
				vertical: "wrap_content",
			},
			elements: [
				{ // general fields
					type: "compartment",
					scope: "!= property",
					title: "General",
					layout: {
						vertical: "wrap_content",
						horizontal: "match_parent"
					},
					elements: [
						{ // без scope рендерит весь элемент
							type: "field",
							layout: {
								horizontal: "match_parent"
							},
						}
					]
				},
				{ // property fields
					type: "compartment",
					scope: "property",
					title: "Properties",
					layout: {
						vertical: "wrap_content",
						horizontal: "match_parent"
					},
					elements: [
						{
							type: "field",
							scope: "@id",
							layout: {
								horizontal: "match_parent"
							},
						}
					]
				},
			]
		},
		{
			type: "edge",
			scope: "",
		},
	]
};

const graph_view = {
	type: "canvas",
	elements: [
		{
			type: "node",
			scope: "shapes",
		},
		{
			type: "node",
			scope: "properties",
		},
		{
			type: "edge",
			scope: "",
		},
	]
};
