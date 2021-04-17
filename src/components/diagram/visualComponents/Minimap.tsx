import styles from '../../../Editor.module.css'

export const Minimap = ({minimapContainer}) => {
  return <div className={styles.minimap} ref={minimapContainer} />
};
