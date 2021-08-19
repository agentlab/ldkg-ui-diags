import React, { useState } from 'react';
import { Form, Modal, InputNumber } from 'antd';
import { grid } from '../../../diagram/visualComponents/grid';

export const GridOptionsMenu = ({ execute, cells, onClick, onEndOperation, graph }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [layoutOptions, setLayoutOptions] = useState({});

  const gridLayout = () => {
    grid(cells, layoutOptions, graph);
  };
  const onOk = () => {
    gridLayout();
    setModalVisible(false);
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
        Сетка
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
          <Form.Item name={'columns'} label={'Столбцы'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'dx'} label={'горизонтальный отступ'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'dy'} label={'вертикальный отступ'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'columnWidth'} label={'ширина столбца?'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'rowHeight'} label={'высота строки'}>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
