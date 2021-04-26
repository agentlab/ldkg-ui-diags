import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const style: React.CSSProperties = {
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
  const { parent, onSave } = props;
  const ref = React.useRef<any>();
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
    parent.style.width = ref.current.clientWidth;
    parent.style.height = ref.current.clientHeight;
    parent.style.x = -ref.current.clientWidth / 2;
  }, [editing]);
  return (
    <div onDoubleClick={() => toggleEdit()} ref={ref} style={{ display: 'inline-block' }}>
      {editing ? (
        <Input style={style} defaultValue={curLabel} size={'small'} onBlur={(e: any) => saveData(e.target.value)} />
      ) : (
        <span style={style}>{curLabel}</span>
      )}
    </div>
  );
};
