import React from "react";
import { Collapse } from "antd";
import FlowChart from "../FlowChart";
import styles from "./sider.module.less";

const { Panel } = Collapse;

export default function () {
  return (
    <div>
      <Collapse
        accordion={true}
        bordered={false}
        expandIconPosition="right"
        className={styles.collapse}
      >
        <Panel header="Блок-схема" key="1">
          <FlowChart />
        </Panel>
        <Panel header="Диаграмма классов" key="4" />
        <Panel header="Временная диаграмма" key="5" />
      </Collapse>
    </div>
  );
}
