import React, { useState, useEffect } from 'react';
import { Graph, Cell } from '@antv/x6';
import { useClickAway } from 'ahooks';
import { Menu } from 'antd';
import { PlusOutlined, MinusOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import './context-menu.css';
import { className } from '@antv/x6/lib/registry/highlighter/class';

type MenuType = 'node' | 'edge' | 'graph';
interface Props {
  graph: Graph;
}

interface ContextMenuProps {
  menuType?: MenuType;
  menuData: any;
  graph: Graph;
  onEndOperation: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { menuType, menuData, graph, onEndOperation } = props;

  if (menuData) {
    switch (menuType) {
      case 'edge':
        return null;
      case 'graph':
        return null;
      case 'node':
        return <NodeContextMenu data={menuData} graph={graph} onEndOperation={onEndOperation} />;
      default:
        return null;
    }
  }
  return null;
};

export const FloatingContextMenu: React.FC<Props> = ({ graph }) => {
  const [type, setType] = useState<MenuType>();
  const [data, setData] = useState<any>();

  const handler = ({ type, data }: any) => {
    setType(type);
    setData(data);
  };
  useEffect(() => {
    if (graph) {
      graph.on('node:contextmenu', (data) => {
        handler({ type: 'node', data });
      });
      graph.on('edge:contextmenu', (data) => {
        handler({ type: 'edge', data });
      });
      graph.on('blank:contextmenu', (data) => {
        handler({ type: 'graph', data });
      });
    }
    return () => {
      if (graph) {
        graph.off('node:contextmenu', handler);
        graph.off('edge:contextmenu', handler);
        graph.off('blank:contextmenu', handler);
      }
    };
  }, [graph]);
  return (
    <div className='mask'>
      <ContextMenu menuData={data} menuType={type} graph={graph} onEndOperation={() => handler({})} />
    </div>
  );
};

const NodeContextMenu = ({ data, graph, onEndOperation }: any) => {
  const cells = graph.getSelectedCells();
  const containerRef = React.useRef<HTMLDivElement>(null as any);

  useClickAway(() => {
    onEndOperation();
  }, containerRef);
  const increaseZIndex = () => {
    cells.forEach((cell: Cell) => {
      console.log('CELL', cell);
      cell.setProp('zIndex', (cell.zIndex || 0) + 1);
    });
    onEndOperation();
  };
  const decreaseZIndex = () => {
    cells.forEach((cell: Cell) => {
      cell.setProp('zIndex', (cell.zIndex || 0) - 1);
    });
    onEndOperation();
  };
  return cells.length > 0 ? (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <ul className='popup' style={{ top: data.y, left: data.x, zIndex: 99, position: 'absolute' }}>
        <li onClick={increaseZIndex}>
          <PlusOutlined />
          На слой выше
        </li>
        <li onClick={decreaseZIndex}>
          <MinusOutlined />
          На слой ниже
        </li>
      </ul>
    </div>
  ) : null;
};
