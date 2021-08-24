import React, { useState } from 'react';
import { Form, Modal, InputNumber, Select } from 'antd';
import { DagreLayout } from '@antv/layout';

const { Option } = Select;

const defaultOptions = {
  rankDir: 'TB',
  align: 'UL',
  nodesep: 20,
  ranksep: 20,
};
export const DagreOptionsMenu = ({ execute, cells, onClick, onEndOperation, graph }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [layoutOptions, setLayoutOptions] = useState({});

  const dagreLayout = () => {
    const layout = new DagreLayout({
      type: 'dagre',
      ...layoutOptions,
    });
    const cellIds = cells.map((cell) => cell.id);
    const edges = cells.reduce((acc, cell) => {
      const outgoings = graph.getOutgoingEdges(cell);
      (outgoings || []).forEach((edge) => {
        if (cellIds.indexOf(edge.store.data.target.cell) !== -1) {
          acc.push({ source: edge.store.data.source.cell, target: edge.store.data.target.cell });
        }
      });
      return acc;
    }, []);
    const nodes = cells.map((node) => ({
      id: node.id,
      width: node.store.data.size.width,
      height: node.store.data.size.height,
    }));
    const newData = layout.layout({ nodes, edges });
    return newData;
  };
  const onOk = () => {
    const newData = dagreLayout();
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
        Ориентированный граф
      </li>
      <Modal
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={onOk}
        afterClose={() => onEndOperation()}>
        <Form
          {...layout}
          initialValues={defaultOptions}
          onValuesChange={(change, values) => {
            setLayoutOptions(values);
          }}>
          <Form.Item name={'rankdir'} label={'Направление'}>
            <Select defaultValue={'TB'}>
              <Option value={'TB'} key={'TB'}>
                сверху вниз
              </Option>
              <Option value={'LR'} key={'LR'}>
                слева направо
              </Option>
              <Option value={'RL'} key={'RL'}>
                справа налево
              </Option>
              <Option value={'BT'} key={'BT'}>
                снизу вверх
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name={'align'} label={'Выравнивание'}>
            <Select defaultValue={'UR'}>
              <Option value={'UR'} key={'UR'}>
                правый верхний угол
              </Option>
              <Option value={'UL'} key={'UL'}>
                левый верхний угол
              </Option>
              <Option value={'DR'} key={'DR'}>
                правый нижний угол
              </Option>
              <Option value={'DL'} key={'DL'}>
                левый нижний угол
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name={'nodesep'} label={'Отступ между узлами'}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'ranksep'} label={'Отступ между слоями'}>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};
