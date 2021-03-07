import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { rootStore } from "./diagram/get_data";

const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
