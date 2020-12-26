export const NodeShapeSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  "@id": "sh:NodeShapeShape",
  "@type": "sh:NodeShape",
  targetClass: "sh:NodeShape",
  title: "Artifact Shape Schema",
  description: "Schema of Artifact Shape (Meta-schema)",
  type: "object",
  "@context": {
    "@type": "rdf:type",
    targetClass: "sh:targetClass",
    property: {
      "@id": "sh:property",
      "@type": "sh:PropertyShape",
    },
  },
  properties: {
    "@id": {
      type: "string",
      format: "iri",
      title: "URI",
    },
    "@type": {
      title: "Тип",
      type: "object",
    },
    targetClass: {
      type: "object",
    },
    property: {
      type: "array",
      items: {
        type: "object",
      },
    },
  },
  required: ["@id", "targetClass", "property"], // arrays should be required
};

export const PropertyShapeSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  "@id": "sh:PropertyShapeShape",
  "@type": "sh:PropertyShape",
  targetClass: "sh:PropertyShape",
  title: "Property Shape Schema",
  description: "Schema of Property Shape (Meta-schema)",
  type: "object",
  "@context": {
    "@type": "rdf:type",
    description: "sh:description",
    datatype: "sh:datatype",
    path: "sh:path", // object with unknown type should resolve in Resource URI
    node: "sh:node",
    order: "sh:order",
    name: "sh:name",
    minCount: "sh:minCount",
    maxCount: "sh:maxCount",
    class: "sh:class",
    nodeKind: "sh:nodeKind",
  },
  properties: {
    "@id": {
      type: "string",
      format: "iri",
      title: "URI",
    },
    "@type": {
      title: "Тип",
      type: "object",
    },
    name: {
      title: "Название",
      type: "string",
    },
    description: {
      title: "Описание",
      type: "string",
    },
    path: {
      title: "Путь",
      type: "object",
    },
    order: {
      title: "Приоритет",
      type: "integer",
    },
    datatype: {
      title: "Тип данных",
      type: "object",
    },
    minCount: {
      title: "Минимальный предел",
      type: "integer",
    },
    maxCount: {
      title: "Максимальный предел",
      type: "integer",
    },
    class: {
      title: "Класс значений",
      type: "object",
    },
    node: {
      type: "object",
    },
    nodeKind: {
      type: "object",
    },
  },
  required: ["@id", "path"],
};
