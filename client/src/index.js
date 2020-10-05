import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";

if (process.env.NODE_ENV !== 'production') {
	console.log("Looks like we are in development mode!");
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
