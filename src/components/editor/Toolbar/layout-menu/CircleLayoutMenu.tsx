import React, { useState } from 'react';
import { Form, Modal, Checkbox, InputNumber } from 'antd';
import { CircularLayout } from '@antv/layout';

export const CircleOptionsMenu = ({ execute, cells, onClick, onEndOperation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [layoutOptions, setLayoutOptions] = useState({});
  const circularLayout = () => {
    const layout = new CircularLayout({
      type: 'circular',
      center: [20, 20],
      ...layoutOptions,
    });
    const newData = layout.layout({ nodes: cells });
    (newData.nodes || []).forEach((node) => {
      (node as any).setPosition((node as any).x, (node as any).y, {
        ignore: true,
      });
    });
    return newData;
  };

  const onOk = () => {
    const newData = circularLayout();
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
        Круг
      </li>
      <Modal
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={onOk}
        afterClose={() => onEndOperation()}>
        <Form
          {...layout}
          initialValues={{ remember: true }}
          onValuesChange={(change, values) => {
            setLayoutOptions(values);
          }}>
          <Form.Item name={'radius'} label={'Радиус'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name='clockwise' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox checked={true}>По часовой стрелке</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
