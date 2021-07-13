import React from 'react';

import ConfigGrid from './ConfigGrid';
import cloneDeep from 'lodash-es/cloneDeep';
import { applySnapshot } from 'mobx-state-tree';
import editorStyles from '../../../Editor.module.css';
import panelStyles from './ConfigPanel.module.css';

export const GraphCongigPanel = ({ view, viewDescrObs }: any) => {
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

const ConfigPanel = ({ view, onChange }) => (
  <div className={panelStyles.config}>
    <ConfigGrid view={view} onChange={onChange} />
  </div>
);

export default ConfigPanel;
