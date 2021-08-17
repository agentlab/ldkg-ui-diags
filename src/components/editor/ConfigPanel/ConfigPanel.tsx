import cloneDeep from 'lodash-es/cloneDeep';
import React from 'react';
import { applySnapshot } from 'mobx-state-tree';

import { ConfigGrid } from './ConfigGrid';
import editorStyles from '../../../Editor.module.css';
import panelStyles from './ConfigPanel.module.css';

export interface GraphConfigPanelProps {
  view: any;
  viewDescrObs: any;
}
export interface ConfigPanelProps {
  view: any;
  onChange: (data: any) => void;
}

export const GraphConfigPanel = ({ view, viewDescrObs }: GraphConfigPanelProps): JSX.Element => {
  const onChange = (val) => {
    if (viewDescrObs) {
      const viewDescr = cloneDeep(view);
      if (!viewDescr.options) viewDescr.options = {};
      viewDescr.options.gridOptions = {
        ...viewDescr.options?.gridOptions,
        ...val,
      };
      applySnapshot(viewDescrObs, viewDescr);
    }
  };
  return (
    <div className={editorStyles.config}>
      <ConfigPanel view={view} onChange={onChange} />
    </div>
  );
};

export const ConfigPanel = ({ view, onChange }: ConfigPanelProps): JSX.Element => (
  <div className={panelStyles.config}>
    <ConfigGrid view={view} onChange={onChange} />
  </div>
);
