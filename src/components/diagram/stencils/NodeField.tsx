import React from 'react';
import { ToolsView, EdgeView, Point } from '@antv/x6';
import { observer } from 'mobx-react-lite';
import { Input } from 'antd';

const style: React.CSSProperties = {
  backgroundColor: 'white',
  boxSizing: 'border-box',

  width: '100%',
  height: '100%',
  paddingLeft: 3,
  fontSize: 10,

  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const NodeField = React.memo(
  ({ data = {}, text, setEditing, nodeData, onSave }: any) => {
    const label = data.label || `${nodeData?.subject?.name}: ${nodeData?.subject?.datatype}`;
    return data.editing ? (
      <Input defaultValue={label} onBlur={(e: any) => onSave(e.target.value)} style={style} />
    ) : (
      <div
        onDoubleClick={() => {
          setEditing(true);
        }}
        style={style}>
        {label}
      </div>
    );
  },
  (prev: any, next: any) => {
    if (prev.data.editing != next.data.editing) {
      return false;
    }
    return true;
  },
);

export const NodeFieldWrap = observer<any>(({ data = {}, text, editingData, setEditing }: any) => {
  const editing = editingData.get(data['@id']);
  if (!editingData.has(data['@id'])) {
    setEditing(false);
    return null;
  }
  return <NodeField data={data} text={text} editing={editing} setEditing={setEditing} />;
});
export interface EditableCellToolOptions extends ToolsView.ToolItem.Options {
  x: number;
  y: number;
}

export class EditableCellTool extends ToolsView.ToolItem<EdgeView, EditableCellToolOptions> {
  private editorContent: HTMLDivElement;

  render() {
    super.render();
    const cell = this.cell;
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    if (cell.isNode()) {
      const position = cell.position();
      const size = cell.size();
      const pos = this.graph.localToGraph(position);
      const zoom = this.graph.zoom();
      x = pos.x;
      y = pos.y;
      width = size.width * zoom;
      height = size.height * zoom;
    } else {
      x = this.options.x - 40;
      y = this.options.y - 20;
      width = 80;
      height = 40;
    }

    const editorParent = ToolsView.createElement('div', false) as HTMLDivElement;
    editorParent.style.position = 'absolute';
    editorParent.style.left = `${x}px`;
    editorParent.style.top = `${y}px`;
    editorParent.style.width = `${width}px`;
    editorParent.style.height = `${height}px`;
    editorParent.style.display = 'flex';
    editorParent.style.alignItems = 'center';
    editorParent.style.textAlign = 'center';

    this.editorContent = ToolsView.createElement('div', false) as HTMLDivElement;
    this.editorContent.contentEditable = 'true';
    this.editorContent.style.width = '100%';
    this.editorContent.style.outline = 'none';
    this.editorContent.style.backgroundColor = cell.isEdge() ? '#fff' : '';
    this.editorContent.style.border = cell.isEdge() ? '1px solid #ccc' : 'none';
    editorParent.appendChild(this.editorContent);
    this.container.appendChild(editorParent);

    this.init();

    return this;
  }
  init = () => {
    const cell = this.cell;
    if (cell.isNode()) {
      const value = cell.attr('text/textWrap/text') as string;
      if (value) {
        this.editorContent.innerText = value;
        cell.attr('text/style/display', 'none');
      }
    }
    setTimeout(() => {
      this.editorContent.focus();
    });
    document.addEventListener('mousedown', this.onMouseDown);
  };

  onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.editorContent) {
      const cell = this.cell;
      const value = this.editorContent.innerText;
      cell.removeTools();
      if (cell.isNode()) {
        cell.attr('text/textWrap/text', value);
        cell.attr('text/style/display', '');
      } else if (cell.isEdge()) {
        cell.appendLabel({
          attrs: {
            text: {
              text: value,
            },
          },
          position: {
            distance: this.getDistance(),
          },
        });
      }
      document.removeEventListener('mousedown', this.onMouseDown);
    }
  };
  getDistance() {
    const cell = this.cell;
    if (cell.isEdge()) {
      const targetPoint = cell.getTargetPoint();
      const cross = cell.getSourceNode()!.getBBox().intersectsWithLineFromCenterToPoint(targetPoint)!;
      const p = new Point(this.options.x, this.options.y);
      return p.distance(cross);
    }
    return 0;
  }
}
EditableCellTool.config({
  tagName: 'div',
  isSVGElement: false,
});
