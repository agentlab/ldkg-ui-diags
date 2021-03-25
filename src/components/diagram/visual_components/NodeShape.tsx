import React from "react";
import { ReactShape } from "@antv/x6-react-shape";

class NodeShape extends React.Component<{
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
					width: "100%",
					height: "100%",
					boxSizing: "border-box",
					border: "2px solid black",
					backgroundColor: 'white'
				}}
			>
				<div
					style={{
						backgroundColor: '#5c00b3',
						color: 'white',
						paddingLeft: 5,
						height: 25,

						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{this.props.text}
				</div>
			</div>
		);
	}
}

export { NodeShape };
