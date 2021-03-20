import ConfigGrid from './ConfigGrid'
import styles from './ConfigPanel.module.css'

const ConfigPanel = () => (
  <div className={styles.config}>
    <ConfigGrid />
  </div>
);

export default ConfigPanel;