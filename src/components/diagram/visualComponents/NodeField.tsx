
export const NodeField = ({/*node,*/ text}) => {

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
				{text}
			</div>
		);
};
