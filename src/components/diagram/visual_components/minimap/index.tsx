import { EdgeView, NodeView } from "@antv/x6"
import { MiniMapManager } from "@antv/x6/lib/graph/minimap"

class SimpleNodeView extends NodeView {
  protected renderMarkup() {
    this.renderJSONMarkup({
      tagName: 'rect',
      selector: 'body',
    })
  }

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#31d0c6',
      },
    })
  }
}

class SimpleEdgeView extends EdgeView {

	update() {

		this.cleanCache()
    this.updateConnection()

		const partialAttrs = {
			line: {
				stroke: "#31d0c6", 
				strokeWidth: 4, 
				targetMarker: "classic"
			},
			lines: {
				connection: true, 
				strokeLinejoin: "round"
			},
			wrap: {
				strokeWidth: 4
			}
		}

    const attrs = this.cell.getAttrs()
    if (attrs != null) {
      super.updateAttrs(this.container, attrs, {
        attrs: partialAttrs === attrs ? null : partialAttrs,
        selectors: this.selectors,
      })
    }

		return this;
	}

	renderTools() {
		return this;
	}

	renderExternalTools() {
		return this;
	}

	renderArrowheadMarkers() {
		return this;
	}

	renderVertexMarkers() {
		return this;
	}

	renderLabels() {
		return this;
	}
}

const useMinimap = (minimapConteiner) : MiniMapManager.Options => ({
  enabled: true,
  container: minimapConteiner,
  width: 200,
  height: 160,
  padding: 10,
  graphOptions: {
    async: false,
    sorting: 'none',
    getCellView(cell) {
      
      if (cell.isNode()) {
        return SimpleNodeView
      }
      if (cell.isEdge()) {
        return SimpleEdgeView;
      }
    },
  }
});

export default useMinimap;
