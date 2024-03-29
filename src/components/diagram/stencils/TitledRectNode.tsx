import React from 'react';
import { Input } from 'antd';

const inputStyle: React.CSSProperties = {
  backgroundColor: '#5c00b3',
  color: 'white',
  paddingLeft: 5,
  height: '20%',
  maxHeight: 25,

  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/*export const NodeShape = React.memo(
  ({ children = () => {}, data = {}, text, setEditing, nodeData, onSave }: any) => {
    const label = data.label || nodeData?.subject?.title || text;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: '2px solid black',
          backgroundColor: 'white',
        }}>
        {data.editing ? (
          <Input defaultValue={label} onBlur={(e: any) => onSave(e.target.value)} style={inputStyle} />
        ) : (
          <div
            onDoubleClick={() => {
              if (setEditing) setEditing(true);
            }}
            style={inputStyle}>
            {label}
          </div>
        )}
        {children()}
      </div>
    );
  },
  (prev: any, next: any) => {
    if (prev.data?.editing !== next.data?.editing) {
      return false;
    }
    return true;
  },
);*/

export const TitledRectNode = React.memo(
  ({ children = () => null, data = {}, text, setEditing, style, nodeData, onSave }: any) => {
    const label = data.label || nodeData?.subject?.title || text;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          ...style,
        }}></div>
    );
  },
  (prev: any, next: any) => {
    if (prev.data?.editing !== next.data?.editing) {
      return false;
    }
    return true;
  },
);
