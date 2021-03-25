import ConfigGrid from './ConfigGrid'
import styles from './ConfigPanel.module.css'

const ConfigPanel = ({view, onChange}) => (
  <div className={styles.config}>
    <ConfigGrid view={view} onChange={onChange} />
  </div>
);

export default ConfigPanel;