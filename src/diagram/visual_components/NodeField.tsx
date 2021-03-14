import React from "react";
import { ReactShape } from "@antv/x6-react-shape";

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
					boxSizing: "border-box",

					width: "100%",
					height: "100%",
					paddingLeft: 3,

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
