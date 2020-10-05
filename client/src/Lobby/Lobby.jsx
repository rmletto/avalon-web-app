import React, { Component } from "react";
import GameListing from "./GameListing";
import NewGameMenu from "./NewGameMenu";
import Popup from "../Popup/Popup";
import "./Lobby.css";

import socket from "../sockets";
import { Redirect } from "react-router-dom";

const testGameData = () => {
	const size = ((Math.random()*10) % 10) + 1;

	const gameData = [];

	let i;
	for(i = 0; i < size; i++) {
		gameData.push(
			{
				hostUser: "Ayby",
				playerCount: Math.floor((Math.random()*10) % 10),
				maxPlayers: Math.floor(((Math.random()*10) % 5) + 5),
				questPicking: size % 2,
				items: ["Lady of the Lake"],
				specials:["Mordred"],
				gameID: i
			}
		);
	}

	return gameData;
}

class Lobby extends Component {
	/**
	 * @param {*} games: Array of JSONGameInfo
	 */
	constructor(props) {
		super(props);

		// Use the WebSocket connection to get this
		this.games = [];

		// The popup is a "Create Game" menu
		this.state = {
			showPopup: false,
			joinedGame: false
		};

		// Update the current game listings based on incoming WebSocket event
		socket.on("games", (gameData) => {
			// Read the URL and make sure the user isn't in game
			if (!window.location.pathname.includes("/game")) {
				this.games = gameData;

				// The component won't re-render without forcing it to
				this.forceUpdate();
			}
		});
	}

	componentWillUnmount() {
		// Stop listening to Game updates
		socket.off("games");
	}

	// Toggle the "Create Game" popup on and off
	togglePopup() {
		this.setState({
			...this.state,
			showPopup: !this.state.showPopup
		});
	}

	// Handle joining a game
	handleJoining() {
		this.setState({
			...this.state,
			joinedGame: true
		})
	}

	createGameListings() {
		let gameListings = [];

		this.games.forEach((game) => {
			gameListings.push(
				<GameListing
					key={game.gameID}
					gameInfo={game}
					joinGame={this.handleJoining.bind(this)}
				/>);
		}); 

		return gameListings;
	}

	render() {
		return (
			this.state.joinedGame ?
				<Redirect to="/game" push={true}/> :
			<div>
				<div className="lobby-list">
					{this.createGameListings()}
				</div>
				<div className="lobby-footer">
					<button onClick={this.togglePopup.bind(this)}>Create a New Game</button>
				</div>
				{
					this.state.showPopup ?
						<Popup closePopup={this.togglePopup.bind(this)}>
							<NewGameMenu
								closePopup={this.togglePopup.bind(this)}
								joinGame={this.handleJoining.bind(this)}
							/>
						</Popup> :
						null
				}
			</div>
		);
	}
}

export default Lobby;
