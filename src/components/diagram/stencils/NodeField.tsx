
export const NodeField = ({data={}, text}: any) => {
		const label = `${data?.subject?.name}: ${data?.subject?.datatype}` || text;
		return (
			<div
				style={{
					backgroundColor: "white",
					boxSizing: "border-box",

					width: "100%",
					height: "100%",
					paddingLeft: 3,
					fontSize: 10,

					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{label}
			</div>
		);
};
