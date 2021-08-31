import React, { useState } from 'react';
import { Point } from '@antv/x6';
import { Form, Modal, InputNumber } from 'antd';

export const EllipseOptionsMenu = ({ execute, cells, onClick, onEndOperation, graph }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [layoutOptions, setLayoutOptions] = useState<any>({});

  const ellipseLayout = () => {
    const cx = 320;
    const cy = 180;
    const rx = layoutOptions?.rx || 100;
    const ry = layoutOptions?.ry || 50;
    const ratio = rx / ry;
    const center = new Point(cx, cy);
    const start = new Point(cx, cy - ry);
    const stepAngle = 360 / cells.length;

    const newData = cells.map((cell, index) => {
      const angle = stepAngle * index;
      const p = start.clone().rotate(-angle, center).scale(ratio, 1, center).round();
      const node: any = {
        id: cell.id,
        x: p.x,
        y: p.y,
      };
      return node;
    });

    return { nodes: newData };
  };
  const onOk = () => {
    const newData = ellipseLayout();
    setModalVisible(false);
    execute(newData);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <React.Fragment>
      <li
        onClick={() => {
          onClick();
          setModalVisible(true);
        }}>
        Элипс
      </li>
      <Modal
        visible={isModalVisible}
        style={{ paddingTop: '40px' }}
        onCancel={() => setModalVisible(false)}
        onOk={onOk}
        afterClose={() => onEndOperation()}>
        <Form
          {...layout}
          initialValues={{ remember: true }}
          onValuesChange={(change, values) => {
            setLayoutOptions(values);
          }}>
          <Form.Item name={'rx'} label={'Большая полуось'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'ry'} label={'Малая полуось'}>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
