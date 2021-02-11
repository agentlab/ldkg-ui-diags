/********************************************************************************
 * Copyright (c) 2020 Agentlab and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 ********************************************************************************/
/**
 * Sparql Endpoint URL (адрес веб-сервиса)
 */
export const rdfServerUrl = process.env.REACT_APP_SERVER_RDF_URL || 'https://expert.agentlab.ru/rdf4j-server';
export const rmRepositoryParam = JSON.parse(process.env.REACT_APP_RM_REPOSITORY_PARAM || '{}');
export const rmRepositoryType = process.env.REACT_APP_RM_REPOSITORY_TYPE || 'native-rdfs';
// TODO:
export const apiUrl = `${rdfServerUrl}/repositories/${process.env.REACT_APP_RDFREP_RM || 'reqs2'}`;

/**
 * URI RDF графа внутри RDF репозитория (т.е. идентификатор графа внутри RDF репа)
 * Все триплы теперь привязываются к графу внутри репа. Графов может быть много в одном RDF репе
 */
export const graphUri = process.env.REACT_APP_GRAPH_URI || 'http://cpgu.kbpm.ru/ns/rm/reqs-dev#';

export const projectAreaUri = 'projects:gishbbProject';
export const rootFolderUri = 'folders:root';

export const textFormatUri = 'rmUserTypes:_YwcOsRmREemK5LEaKhoOow_Text';
export const collectionFormatUri = 'rmUserTypes:_YwcOsRmREemK5LEaKhoOow_Collection';
export const moduleFormatUri = 'rmUserTypes:_YwcOsRmREemK5LEaKhoOow_Module';

/*export const collectionTypeUri = 'https://192.168.1.20:9443/rm/types/_fVFAbxmREemK5LEaKhoOow';
export const moduleFeatureTypeUri = 'https://192.168.1.20:9443/rm/types/_fVFAYxmREemK5LEaKhoOow';

export const collectionFormatUri = 'https://192.168.1.20:9443/rm/types/_YwcOsRmREemK5LEaKhoOow#Collection';
export const moduleFormatUri = 'https://192.168.1.20:9443/rm/types/_YwcOsRmREemK5LEaKhoOow#Module';
export const textFormatUri = 'https://192.168.1.20:9443/rm/types/_YwcOsRmREemK5LEaKhoOow#Text';*/

/**
 * Import settings
 */
export const importUrl = process.env.REACT_APP_IMPORT_URL || 'https://expert.agentlab.ru/import';
export const importFileUploadUrl = `${importUrl}/fileupload`;
export const importStartUrl = `${rdfServerUrl}/start`;
export const importRepositoryID = process.env.REACT_APP_RDFREP_IMPORT || 'import';
export const importNamespace = 'http://cpgu.kbpm.ru/ns/rm/reqs#';
