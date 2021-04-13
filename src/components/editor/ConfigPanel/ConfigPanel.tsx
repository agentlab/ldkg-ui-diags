import ConfigGrid from './ConfigGrid'
import cloneDeep from 'lodash/cloneDeep';
import { applySnapshot } from "mobx-state-tree";
import styles from './ConfigPanel.module.css'

export const GraphCongigPanel = ({view, viewDescrObs}: any) => {
	const onChange = (val) => {
		if (viewDescrObs) {
			let viewDescr = cloneDeep(view);
			if (!viewDescr.options) viewDescr.options = {};
			viewDescr.options.gridOptions = {
				...viewDescr.options?.gridOptions,
				...val,
			};
			applySnapshot(viewDescrObs, viewDescr);
		}
	}
	return (
		<div className={styles.config}>
		<ConfigPanel view={view} onChange={onChange}/>
	</div>
	)
}

const ConfigPanel = ({view, onChange}) => (
  <div className={styles.config}>
    <ConfigGrid view={view} onChange={onChange} />
  </div>
);

export default ConfigPanel;