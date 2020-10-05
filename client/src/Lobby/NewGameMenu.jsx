import React, { Component } from 'react';
import socket from '../sockets';
import { Redirect } from 'react-router-dom';

/**
 * New Game Menu component, meant to be rendered as a popup within a Lobby component
 * 
 * TODO: CSS for this component
 */
class NewGameMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			numPlayers: 5,
			questPicking: false,
			items: ["Lady of the Lake"],
			specials: ["Merlin", "Mordred", "Assassin"]
		}

		this.closeMenu = props.closePopup;
		this.joinGame = props.joinGame;
	}

	handlePlayers(event) {
		if (event.target.value >= 5 && event.target.value <= 10) {
			this.setState({[event.target.name]: event.target.value});
		}
	}

	handleQuestPick(event) {
		this.setState({[event.target.name]: event.target.checked});
	}

	handleItems(event) {
		var newItems = this.state.items;

		if (this.state.items.indexOf(event.target.value) != -1) {
			newItems = newItems.filter(value => {
				return value != event.target.value;
			});
		} else {
			newItems.push(event.target.value);
		}

		this.setState({
			items: newItems
		});
	}

	handleSpecials(event) {
		// TODO: Make sure players can't use this to pick too many goods/evils
		var newSpecials = this.state.specials;

		if (this.state.specials.indexOf(event.target.value) != -1) {
			newSpecials = newSpecials.filter(value => {
				return value != event.target.value;
			});
		} else {
			newSpecials.push(event.target.value);
		}

		this.setState({
			specials: newSpecials
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		let username = "";
        while(username == "") {
            username = prompt("Please provide a username:", username);
		}

		if(username !== null) {
			// Assume you gave the server the correct details
			socket.emit("create game", {
				gameInfo: this.state,
				username: username
			});
			this.joinGame();
		}
	}

	render() {
		// TODO: As more cards get added, generate the specials and items
		return (
			<div>
				<h2>Create New Game</h2>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<label>
						Number of Players: 
						<input type="number" name="numPlayers" value={this.state.numPlayers} onChange={this.handlePlayers.bind(this)} />
					</label>

					<br/>

					<label>
						Quest Picking: 
						<input type="checkbox" name="questPicking" value="questPicking" checked={this.state.questPicking} onChange={this.handleQuestPick.bind(this)} />
					</label>

					<br/>

					<label>
						Items: 
						<br/>
						<input type="checkbox" name="item_lake" value="Lady of the Lake" checked={this.state.items.includes("Lady of the Lake")} onChange={this.handleItems.bind(this)} />
						<label htmlFor="item_lake">Lady of the Lake</label>
					</label>

					<br/>

					<label>
						Special Cards: 
						<br/>
						<input type="checkbox" name="special_merlin" value="Merlin" checked={this.state.specials.includes("Merlin")} onChange={this.handleSpecials.bind(this)} />
						<label htmlFor="special_merlin">Merlin</label>
						<br/>

						<input type="checkbox" name="special_mordred" value="Mordred" checked={this.state.specials.includes("Mordred")} onChange={this.handleSpecials.bind(this)} />
						<label htmlFor="special_mordred">Mordred</label>
						<br/>

						<input type="checkbox" name="special_assassin" value="Assassin" checked={this.state.specials.includes("Assassin")} onChange={this.handleSpecials.bind(this)} />
						<label htmlFor="special_assassin">Assassin</label>
						<br/>
					</label>

					<br/>

					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

export default NewGameMenu;
