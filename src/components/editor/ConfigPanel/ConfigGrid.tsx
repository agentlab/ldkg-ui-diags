import React from 'react';
import { Tabs, Row, Col, Select, Slider, Input } from 'antd';
import { observer } from 'mobx-react-lite';

const { TabPane } = Tabs;

enum GRID_TYPE {
  DOT = 'dot',
  FIXED_DOT = 'fixedDot',
  MESH = 'mesh',
  DOUBLE_MESH = 'doubleMesh',
}

const ConfigGrid = observer((props: any) => {
  const attrs = props.view.options?.gridOptions || {};

  const onChange = props.onChange || (() => null);

  return (
    <Tabs defaultActiveKey='1'>
      <TabPane tab='Grid' key='1'>
        <Row align='middle'>
          <Col span={8}>Grid Type</Col>
          <Col span={14}>
            <Select style={{ width: '100%' }} value={attrs.type} onChange={(val) => onChange({ type: val })}>
              <Select.Option value={GRID_TYPE.DOT}>Dot</Select.Option>
              <Select.Option value={GRID_TYPE.FIXED_DOT}>Fixed Dot</Select.Option>
              <Select.Option value={GRID_TYPE.MESH}>Mesh</Select.Option>
              <Select.Option value={GRID_TYPE.DOUBLE_MESH}>Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align='middle'>
          <Col span={8}>Grid Size</Col>
          <Col span={12}>
            <Slider min={1} max={20} step={1} value={attrs.size} onChange={(val: number) => onChange({ size: val })} />
          </Col>
          <Col span={2}>
            <div className='result'>{attrs.size}</div>
          </Col>
        </Row>
        {attrs.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align='middle'>
              <Col span={10}>Primary Color</Col>
              <Col span={12}>
                <Input
                  type='color'
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => onChange({ color: e.target.value })}
                />
              </Col>
            </Row>
            <Row align='middle'>
              <Col span={10}>Primary Thickness</Col>
              <Col span={10}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val: number) => onChange({ thickness: val })}
                />
              </Col>
              <Col span={2}>
                <div className='result'>{attrs.thickness.toFixed(1)}</div>
              </Col>
            </Row>
            <Row align='middle'>
              <Col span={10}>Secondary Color</Col>
              <Col span={12}>
                <Input
                  type='color'
                  value={attrs.colorSecond}
                  style={{ width: '100%' }}
                  onChange={(e) => onChange({ colorSecond: e.target.value })}
                />
              </Col>
            </Row>
            <Row align='middle'>
              <Col span={10}>Secondary Thickness</Col>
              <Col span={10}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thicknessSecond}
                  onChange={(val: number) => onChange({ thicknessSecond: val })}
                />
              </Col>
              <Col span={2}>
                <div className='result'>{attrs.thicknessSecond.toFixed(1)}</div>
              </Col>
            </Row>
            <Row align='middle'>
              <Col span={10}>Scale Factor</Col>
              <Col span={10}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={attrs.factor}
                  onChange={(val: number) => onChange({ factor: val })}
                />
              </Col>
              <Col span={2}>
                <div className='result'>{attrs.factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align='middle'>
              <Col span={8}>Grid Color</Col>
              <Col span={14}>
                <Input
                  type='color'
                  value={attrs.color}
                  style={{ width: '100%' }}
                  onChange={(e) => onChange({ color: e.target.value })}
                />
              </Col>
            </Row>
            <Row align='middle'>
              <Col span={8}>Thickness</Col>
              <Col span={12}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={attrs.thickness}
                  onChange={(val: number) => onChange({ thickness: val })}
                />
              </Col>
              <Col span={1}>
                <div className='result'>{attrs.thickness.toFixed(1)}</div>
              </Col>
            </Row>
          </React.Fragment>
        )}
      </TabPane>
      <TabPane tab='Background' key='2'>
        <Row align='middle'>
          <Col span={6}>Color</Col>
          <Col span={14}>
            <Input
              type='color'
              value={attrs.bgColor}
              style={{ width: '100%' }}
              onChange={(e) => onChange({ bgColor: e.target.value })}
            />
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
});

export default ConfigGrid;
