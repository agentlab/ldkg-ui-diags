
export const NodeShape = ({/*node,*/ text}) => {
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
				{text}
			</div>
		</div>
	);
};