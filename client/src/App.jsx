import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.css";

import important from "./assets/images/glyngeorgewithaknife.jpg";

import Lobby from "./Lobby/Lobby";
import Game from "./Game/Game";

import {
	BrowserRouter,
	Route,
} from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Route exact path = "/">
						<Lobby />
					</Route>
					<Route path="/game">
						<Game />
					</Route>
				</BrowserRouter>
			</div>
		);
	}
}

export default hot(module)(App);