import React, { Component } from "react";
import socket from "../../sockets/SIOWebSocket";
import important from "../../assets/images/glyngeorgewithaknife.jpg";
import "./Board.css";

class Board extends Component {
	//gets the right board config
	getBoardSetup() {
		var playerNum = this.props.numPlayers;

		var five = [2, 3, 2, 3, 3];
		var six = [2, 3, 4, 3, 4];
		var seven = [2, 3, 3, 4, 4];
		var eightPlus = [3, 4, 4, 5, 5];

		var quests = [five, six, seven, eightPlus];

		var temp;

		if (playerNum == 5) {
			temp = quests[0];
		}
		else if (playerNum == 6) {
			temp = quests[1];
		}
		else if (playerNum == 7) {
			temp = quests[2];
		}
		else {
			temp = quests[3];
		}
		return temp;
	}
	//colors the quest circle based off quests being successful, a failure, or not done yet	
	generateQuests() {
		const questBoard = this.getBoardSetup();
		const temp = [];
		for (let i = 1; i <= 5; i++) {
			let q = this.props.quests[i - 1];
			if (q === "Fail") {
				temp.push(<div key={i} className="board-circles" style={{ backgroundColor: "red" }} >
					{questBoard[i - 1]}
				</div>
				);

			}
			else if (q === "Pass") {
				temp.push(<div key={i} className="board-circles" style={{ backgroundColor: "blue" }}>
					{questBoard[i - 1]}
				</div>
				);
			}
			else {
				temp.push(<div key={i} className="board-circles" style={{ backgroundColor: "#FFFFFF" }}>
					{questBoard[i - 1]}
				</div>
				);
			}
		}
		return temp;
	}
	//keeps track of the times a quest has not been accepted
	generateVoteTracker() {
		const temp = [];
		for (let i = 1; i <= 5; i++) {
			if (i === this.props.voteTracker) {
				temp.push(<div key={i} className="board-circles" style={{ backgroundColor: "yellow" }}>
					{i}
				</div>
				);
			}
			else {
				temp.push(<div key={i} className="board-circles" style={{ backgroundColor: "white" }}>
					{i}
				</div>
				);
			}
		}
		return temp;
	}

	render() {
		return (
			<div className="grid-board">
				<div className="white-space">
					{/* just here to take up space*/}
				</div>
				<div className="grid-quests-name">
					<div> Quests </div>
				</div>
				<div className="grid-quests">
					<div className="flex-container">
						{this.generateQuests()}

					</div>
				</div>
				<div className="grid-vote-tracker-name">
					<div>Vote Tracker</div>
				</div>
				<div className="grid-vote-tracker">
					<div className="flex-container">
							{this.generateVoteTracker()}
					</div>
				</div>
			</div>
		);
	}
}

export default Board;