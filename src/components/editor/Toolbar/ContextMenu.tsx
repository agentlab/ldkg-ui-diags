import React, { useState, useEffect } from 'react';
import { Graph, Cell } from '@antv/x6';
import { useClickAway } from 'ahooks';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './context-menu.css';
import { layoutMenu } from './layout-menu';

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
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible');
  const cells = graph.getSelectedCells();
  const containerRef = React.useRef<HTMLDivElement>(null as any);

  useClickAway(() => {
    if (!sideMenuVisible) {
      onEndOperation();
    }
  }, containerRef);
  const increaseZIndex = () => {
    cells.forEach((cell: Cell) => {
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

  const onMenuClick = () => {
    setSideMenuVisible(true);
    setVisibility('hidden');
  };
  return cells.length > 0 ? (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <ul
        className='popup'
        style={{
          top: data.e.clientY,
          left: data.e.clientX,
          zIndex: 99,
          position: 'fixed',
          visibility,
        }}>
        <li onClick={increaseZIndex}>
          <PlusOutlined />
          На слой выше
        </li>
        <li onClick={decreaseZIndex}>
          <MinusOutlined />
          На слой ниже
        </li>
        {cells.length > 1
          ? Object.values(layoutMenu).map((MenuItem, index) => (
              <MenuItem
                key={index}
                graph={graph}
                execute={(data) => {
                  (data.nodes || []).forEach((node) => {
                    const cell = graph.getCellById(node.id);
                    (cell as any).setPosition(node.x, node.y, {
                      ignore: true,
                    });
                    graph.trigger('node:moved', { node: cell });
                  });
                }}
                cells={cells.filter((cell) => !cell.parent)}
                onClick={onMenuClick}
                onEndOperation={onEndOperation}
              />
            ))
          : null}
      </ul>
    </div>
  ) : null;
};
