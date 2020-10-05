import React, { Component } from "react";
import "./Game.css";

import GamePlayerList from "./GamePlayerList";

import Vote from "../PlayerInputs/VoteInput";
import Questing from "../PlayerInputs/QuestingChoice";
import Kill from "../PlayerInputs/Kill";
import Picking from "../PlayerInputs/Picking";
import Lake from "../Lake/Lake";

import Board from "./Board";

import Chat from "../Chat";

import socket from "../sockets";

class Game extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hostUser: "You have not joined a Game",
			numPlayers: 7,
			gameState: "You have not joined a Game",
			gameMaster: false,
			// cardInfo is the same thing that the server-side Card passes (see example Merlin.js on server)
			cardInfo: {
				cardName: "Unknown",
				info: "Unknown",
				alignment: "Unknown",
				infoList: [],
				username: ""
			},
			chatMessages: [],
			usernames: [],
			questLeader: "There isn't one yet",
			quests: []
		};

		// Recieve game information from server when joining a game. The listing info works fine
		socket.on("joined game", gameListingInfo => {
			this.setState({
				...this.state,
				hostUser: gameListingInfo.hostUser,
				numPlayers: gameListingInfo.numPlayers,
				gameState: "Waiting to Start",
				usernames: gameListingInfo.usernames || []
			});
		});

		// Display the server's current game state in the header
		socket.on(
			"game state update",
			({ newState, voteTracker, quests, questLeader }) => {
				this.setState({
					...this.state,
					gameState: newState || "Undefined",
					voteTracker: voteTracker || 0,
					quests: quests || [],
					questLeader: questLeader || "Unknown"
				});
			}
		);

		// Listen to receive card information
		socket.on("card info", info => {
			this.setState({
				...this.state,
				cardInfo: info || null
			});
		});

		// If the player is the game master, the server will tell them that they are and will only
		// listen to the user it tells
		socket.on("game master", () => {
			this.setState({
				...this.state,
				gameMaster: true
			});
		});

		socket.on("cant start", msg => {
			alert(msg);
		});

		socket.on("chat message", msg => {
			// Clone the state value
			let newMsgs = [...this.state.chatMessages];
			newMsgs.push(msg);
			this.setState({
				...this.state,
				chatMessages: newMsgs
			});
		});

		socket.on("lake", msg => {
			alert(msg);
		});
	}

	// When the component gets removed from the DOM, unregister all of its listeners
	componentWillUnmount() {
		socket.off("joined game");
		socket.off("game state update");
		socket.off("card info");
		socket.off("game master");
		socket.off("cant start");
		socket.off("chat message");
		socket.off("lake");
	}

	// Hide certain inputs based on game state
	renderInputs() {
		let g = this.state.gameState;
		if (g == "Waiting to Start") {
			return this.state.gameMaster ? (
				<button
					onClick={() => {
						socket.emit("start game");
					}}
				>
					Start Game
				</button>
			) : null;
		} else if (g == "Picking a Quest") {
			if (this.state.cardInfo.username == this.state.questLeader) {
				return <Picking usernames={this.state.usernames} />;
			}
		} else if (g == "Voting on a Quest") {
			return <Vote />;
		} else if (g == "Questing") {
			return <Questing />;
		} else if (g == "Assassination") {
			if (this.state.cardInfo.cardName == "Assassin") {
				return <Kill usernames={this.state.usernames} />;
			}
		}
	}

	render() {
		// Create appropriate data for GamePlayerList
		let infoList = [];
		for (const username of this.state.usernames) {
			let included = false;
			for (const obj of this.state.cardInfo.infoList) {
				// Check to see if the user has an information entry
				if (obj.username == username) {
					included = true;
					infoList.push(obj);
					break;
				}
			}

			if (!included) {
				infoList.push({
					username: username,
					role: "Unknown",
					alignment: "Unknown"
				});
			}
		}

		return (
			<div className="GameOuter">
				<div className="GameInner">
					<div className="GameHeader">
						Host: {this.state.hostUser} | Game State: {this.state.gameState}
					</div>
					<div className="GameBoard">
						<Board
							voteTracker={this.state.voteTracker}
							quests={this.state.quests}
							numPlayers={this.state.numPlayers}
						/>
					</div>
					<div className="GamePlayerList">
						<GamePlayerList infoList={infoList} />
						{this.state.cardInfo.username ? (
							<div>You are {this.state.cardInfo.username}</div>
						) : null}
						<button
							onClick={() => {
								alert(
									`${this.state.cardInfo.info}\n\nAlignment: ${this.state.cardInfo.alignment}`
								);
							}}
						>
							Show Your Information
            </button>
					</div>
					<div className="GameChat">
						<Chat msgs={this.state.chatMessages} />
					</div>
					<div className="GameInput">
						<div>
							Player Input
              <Lake usernames={this.state.usernames} />
						</div>
						<div>{this.renderInputs()}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Game;
