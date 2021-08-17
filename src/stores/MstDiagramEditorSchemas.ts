/********************************************************************************
 * Copyright (c) 2021 Agentlab and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the GNU General Public License v. 3.0 which is available at
 * https://www.gnu.org/licenses/gpl-3.0.html.
 *
 * SPDX-License-Identifier: GPL-3.0-only
 ********************************************************************************/
import { types } from 'mobx-state-tree';

import { MstJsObject } from '@agentlab/sparql-jsld-client';
import { MstViewKindElement } from '@agentlab/ldkg-ui-react';

export const MstDiagramNodeVKElement = types.compose(
  'aldkg:DiagramNodeVKElement',
  MstViewKindElement,
  types.model({
    '@type': types.literal('aldkg:DiagramNodeVKElement'),
    protoStencil: types.maybe(types.string),
    paletteOrder: types.maybe(types.number),
    img: types.maybe(types.union(types.string, MstJsObject)),
    height: types.maybe(types.number),
    width: types.maybe(types.number),
    constant: types.maybe(types.boolean),
    layout: types.maybe(MstJsObject),
  }),
);

export const MstDiagramEdgeVKElement = types.compose(
  'aldkg:DiagramEdgeVKElement',
  MstViewKindElement,
  types.model({
    '@type': types.literal('aldkg:DiagramEdgeVKElement'),
    protoStencil: types.maybe(types.string),
    paletteOrder: types.maybe(types.number),
    line: types.maybe(types.union(types.string, MstJsObject)),
    outline: types.maybe(types.union(types.string, MstJsObject)),
    shape: types.maybe(types.union(types.string, MstJsObject)),
  }),
);
