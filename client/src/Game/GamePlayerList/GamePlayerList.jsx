import React, { Component } from 'react';
import GamePlayerListing from './GamePlayerListing';
import "./GamePlayerList.css";

// TODO: CSS

// No role would see this exact information, but it serves to test certain possibliities
const playerListTest = () => {
	const playerData = [];

	// A Percival would see a Merlin role
	playerData.push(
		{
			username: "Ay",
			alignment: "Good",
			role: "Merlin",
		}
	);
	// A Merlin would only see evils
	playerData.push(
		{
			username: "By",
			alignment: "Evil",
			role: null,
		}
	);
	playerData.push(
		{
			username: "Stefan",
			alignment: "Evil",
			role: null,
		}
	);

	return playerData;
};

class GamePlayerList extends Component {
	generateList() {
		let a = [];
		const playerData = this.props.infoList || [];

		for(let i = 0; i < playerData.length; i++) {
			const p = playerData[i];
			a.push(<GamePlayerListing key={i} data={p}/>)
		}

		return a;
	}

	render() {
		return (
			<div className="playerListingOuter">
				{this.generateList()}
			</div>
		);
	}
}

export default GamePlayerList;