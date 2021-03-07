import React from "react";
import moment from "moment";
import { Spin } from "antd";
import { getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";

import "./App.css";

import { G } from "./diagram/nested_2";
import { test_data } from './example_data'
import { rmRepositoryParam } from "./config";



const App = observer(() => {

	const { shapes, properties } = test_data;
	
	return (properties.length > 0 && shapes.length > 0)
		?
			( <G data={{shapes, properties}} /> )
		: 
			( <Spin size="large"/> );
});

export default App;
