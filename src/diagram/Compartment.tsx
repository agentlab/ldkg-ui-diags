import React from "react";
import { ReactShape } from "@antv/x6-react-shape";
import { Shape } from "@antv/x6";

class Compartment extends React.Component<{
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
          backgroundColor: "lightblue",
          border: "2px solid black",
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: 4,
          marginLeft: 5,
          marginRight: 5,
          // marginTop: 3,
          marginBottom: 3,
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

export { Compartment };
