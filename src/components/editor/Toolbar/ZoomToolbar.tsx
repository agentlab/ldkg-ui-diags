import React, { useCallback } from 'react';
import { Popover } from 'antd';
import { CompressOutlined, OneToOneOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from '../../../Editor.module.css';

export const ZoomToolbar: React.FC<any> = (props) => {
  const { graph } = props;
  const onHandleSideToolbar = useCallback(
    (action: 'in' | 'out' | 'fit' | 'real') => () => {
      // 确保画布已渲染
      if (graph) {
        switch (action) {
          case 'in':
            graph.zoom(0.1);
            break;
          case 'out':
            graph.zoom(-0.1);
            break;
          case 'fit':
            graph.zoomToFit({ padding: 12 });
            break;
          case 'real':
            graph?.scale(1);
            graph?.centerContent();
            break;
          default:
        }
      }
    },
    [graph],
  );

  return (
    <CanvasHandler
      onZoomIn={onHandleSideToolbar('in')}
      onZoomOut={onHandleSideToolbar('out')}
      onFitContent={onHandleSideToolbar('fit')}
      onRealContent={onHandleSideToolbar('real')}
    />
  );
};

export const CanvasHandler: React.FC<any> = (props) => {
  const { className, onZoomIn, onZoomOut, onFitContent, onRealContent } = props;

  return (
    <ul className={styles.handler}>
      <Popover overlayClassName={styles.popover} content='Увеличить' placement='left'>
        <li onClick={onZoomIn} className={styles.item}>
          <ZoomInOutlined />
        </li>
      </Popover>
      <Popover overlayClassName={styles.popover} content='Уменьшить' placement='left'>
        <li onClick={onZoomOut} className={styles.item}>
          <ZoomOutOutlined />
        </li>
      </Popover>
      <Popover overlayClassName={styles.popover} content='Фактический размер' placement='left'>
        <li onClick={onRealContent} className={styles.item}>
          <OneToOneOutlined />
        </li>
      </Popover>
      <Popover overlayClassName={styles.popover} content='Адаптировано' placement='left'>
        <li onClick={onFitContent} className={styles.item}>
          <CompressOutlined />
        </li>
      </Popover>
    </ul>
  );
};
