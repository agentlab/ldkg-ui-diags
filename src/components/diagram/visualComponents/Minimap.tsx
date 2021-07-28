import React from 'react';

import styles from '../../../Editor.module.css';

export interface MinimapProps {
  minimapContainer: React.Ref<any>;
}
export const Minimap: React.FC<MinimapProps> = ({ minimapContainer }) => {
  return <div className={styles.minimap} ref={minimapContainer} />;
};
