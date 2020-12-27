import React from "react";
import { ReactShape } from "@antv/x6-react-shape";
import { Shape } from "@antv/x6";

class NodeField extends React.Component<{
	node?: ReactShape;
	text: string;
}> {
	shouldComponentUpdate() {
		const node = this.props.node;
		if (node) {
			if (node.hasChanged("data")) {
				return true;
			}
		}
		return false;
	}

	render() {
		return (
			<div
				style={{
					backgroundColor: "white",
					// border: "2px solid black",
					boxSizing: "border-box",

					width: "100%",
					height: "100%",
					padding: 4,

					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{this.props.text}
			</div>
		);
	}
}

export { NodeField };
