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
          backgroundColor: "lightgray",
          border: "2px solid black",
          boxSizing: "border-box",
          //   width: "100%",
          //   height: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: 4,
          marginLeft: 8,
          marginRight: 8,
          // marginTop: 5,
          marginBottom: 6,
          position: "absolute",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {this.props.text}
      </div>
    );
  }
}

export { NodeField };
