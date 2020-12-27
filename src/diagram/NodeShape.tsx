import React from "react";
import { ReactShape } from "@antv/x6-react-shape";
import { Shape } from "@antv/x6";

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
						padding: 4,
						height: 25,

						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{this.props.text}
				</div>
				<div
					style={{

						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
				</div>
			</div>
		);
	}
}

export { NodeShape };
