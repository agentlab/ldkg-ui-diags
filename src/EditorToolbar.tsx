import React, { useEffect, useState } from 'react'
import { Toolbar } from '@antv/x6-react-components'
import { DataUri } from '@antv/x6'
import {
  ClearOutlined,
  SaveOutlined,
  PrinterOutlined,
  UndoOutlined,
  RedoOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  RetweetOutlined,
} from '@ant-design/icons'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import useGraph from './stores/graph'
import { observer } from "mobx-react-lite";

const Item = Toolbar.Item
const Group = Toolbar.Group

const EditorToolbar = observer(() => {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const {graphStore, layoutStore} = useGraph();

  const copy = () => {
     const { graph } = graphStore
     const cells = graph.getSelectedCells()
    if (cells.length) {
       graph.copy(cells)
     }
    return false
  }

  const cut = () => {
    const { graph } = graphStore
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  }

  const paste = () => {
    const { graph } = graphStore
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  }

  const switchShape = () => {
    layoutStore.switchShape()
    return false;
  }

  useEffect(() => {
    const { graph } = graphStore
    if (graph) {
    const { history } = graph
    setCanUndo(history.canUndo())
    setCanRedo(history.canRedo())
    history.on('change', () => {
      setCanUndo(history.canUndo())
      setCanRedo(history.canRedo())
    })

    graph.bindKey('meta+z', () => {
      if (history.canUndo()) {
        history.undo()
      }
      return false
    })
    graph.bindKey('meta+shift+z', () => {
      if (history.canRedo()) {
        history.redo()
      }
      return false
    })
    
    graph.bindKey('meta+d', () => {
      graph.clearCells()
      return false
    })
    graph.bindKey('meta+s', () => {
      graph.toPNG((datauri: string) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      return false
    })
    graph.bindKey('meta+p', () => {
      graph.printPreview()
      return false
    })
    graph.bindKey('meta+c', copy)
    graph.bindKey('meta+v', paste)
    graph.bindKey('meta+x', cut)
  }
  }, [graphStore.graph])

  const handleClick = (name: string) => {
    const { graph } = graphStore
    switch (name) {
      case 'undo':
        graph.history.undo()
        break
      case 'redo':
        graph.history.redo()
        break
      case 'delete':
        graph.clearCells()
        break
      case 'save':
        graph.toPNG((datauri: string) => {
          DataUri.downloadDataUri(datauri, 'chart.png')
        })
        break
      case 'print':
        graph.printPreview()
        break
      case 'copy':
        copy()
        break
      case 'cut':
        cut()
        break
      case 'paste':
        paste()
        break
      case 'switch':
        switchShape()
        break
      default:
        break
    }
  }

  return (
    <div>
      <Toolbar hoverEffect={true} size="small" onClick={handleClick}>
        <Group>
          <Item
            name="delete"
            icon={<ClearOutlined />}
            tooltip="Clear (Cmd + D)"
          />
        </Group>
        <Group>
          <Item
            name="undo"
            tooltip="Undo (Cmd + Z)"
            icon={<UndoOutlined />}
            disabled={!canUndo}
          />
          <Item
            name="redo"
            tooltip="Redo (Cmd + Shift + Z)"
            icon={<RedoOutlined />}
            disabled={!canRedo}
          />
        </Group>
        <Group>
          <Item name="copy" tooltip="Copy (Cmd + C)" icon={<CopyOutlined />} />
          <Item name="cut" tooltip="Cut (Cmd + X)" icon={<ScissorOutlined />} />
          <Item
            name="paste"
            tooltip="Paste (Cmd + V)"
            icon={<SnippetsOutlined />}
          />
        </Group>
        <Group>
          <Item name="save" icon={<SaveOutlined />} tooltip="Save (Cmd + S)" />
          <Item
            name="print"
            icon={<PrinterOutlined />}
            tooltip="Print (Cmd + P)"
          />
        </Group>
        <Group>
          <Item
            name="switch"
            icon={<RetweetOutlined />}
            tooltip="Switch"
          />
        </Group>
      </Toolbar>
    </div>
  )
});

export default EditorToolbar;
