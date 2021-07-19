import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import './cell.css';
const defaultStyle: React.CSSProperties = {
  backgroundColor: 'white',
  boxSizing: 'border-box',

  width: '100%',
  height: '100%',
  paddingLeft: 2,
  paddingRight: 2,
  fontSize: 10,

  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const DefaultLabel = (props: any) => {
  const [editing, setEditing] = useState(false);
  const [curLabel, setCurLabel] = useState(props.label);
  const { parent, onSave, editable = true } = props;
  const labelStyle = { ...defaultStyle, ...props.style };
  const ref = React.useRef<any>();
  const inputRef = React.createRef<any>();
  const toggleEdit = () => {
    const newState = !editing;
    setEditing(newState);
  };
  const saveData = (data: string) => {
    setCurLabel(data);
    toggleEdit();
    onSave(data);
  };
  useEffect(() => {
    if (editing && editable) {
      inputRef.current.focus();
    }
  }, [editing]);
  useEffect(() => {
    parent.style.width = ref.current.clientWidth;
    parent.style.height = ref.current.clientHeight;
    parent.style.x = -ref.current.clientWidth / 2;
  }, [editing]);
  return (
    <div onDoubleClick={() => toggleEdit()} ref={ref} style={{ display: 'inline-block' }}>
      {editing && editable ? (
        <Input
          ref={inputRef}
          style={labelStyle}
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          defaultValue={curLabel}
          size={'small'}
          onBlur={(e: any) => saveData(e.target.value)}
        />
      ) : (
        <span style={labelStyle}>{curLabel}</span>
      )}
    </div>
  );
};
