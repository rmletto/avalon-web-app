import React, { Component } from "react";
import important from "../assets/images/glyngeorgewithaknife.jpg";
import socket from "../sockets/SIOWebSocket";
import Popup from "../Popup/Popup.jsx";
import "./Picking.css"

class Picking extends Component{
	constructor(props) {
		super(props);

		// The popup is a passing or fail quests menu
		this.state = {
			showPopup: false,
			chosenPlayers: []
		};
	}

	togglePopup() {
		this.setState({
			...this.state,
			showPopup: !this.state.showPopup
		});
	}

	handleSubmit(e) {
		// If you submit when the server is not listening for you, you will be ignored.
		// Don't hack my client pls but actually do I really don't care.
		e.preventDefault();
		socket.emit("quest pick", this.state.chosenPlayers);
		this.togglePopup();
	}

	handleFormChange(event) {
		let players = [ ...this.state.chosenPlayers ];

		// See if the player is already chosen
		if (players.indexOf(event.target.value) != -1) {
			// filter player out of array
			players = players.filter(value => {
				return value != event.target.value;
			});
		} else {
			// add player to array
			players.push(event.target.value);
		}

		this.setState({
			...this.state,
			chosenPlayers: players
		});
	}

	// Render form checkboxes to handle picking people for the quest
	checkBoxRender() {
		let a = [];
		for(let i = 0; i < this.props.usernames.length; i++) {
			let username = this.props.usernames[i];
			a.push(
				<li key={`li_${i}`}>
					<input
						key={`input_${i}`}
						type="checkbox"
						name={username}
						value={username}
						checked={this.state.chosenPlayers.includes(username)}
						onChange={this.handleFormChange.bind(this)}
					/>
					<label
						htmlFor={this.props.usernames[i]}
					>
						{this.props.usernames[i]}
					</label>
				</li>
			);
		}

		return a;
	}

	render(){
		return(
			<div>

				<div>
					<button onClick={this.togglePopup.bind(this)}> 
						Select Quest 
					</button>
				</div>

				{
					this.state.showPopup ?
					<Popup closePopup={this.togglePopup.bind(this)}>
						<form onSubmit={this.handleSubmit.bind(this)}>
							<ul>
								{this.checkBoxRender()}
							</ul>

							<div>
								<input type="submit" value="Submit" />
							</div>
						</form>
					</Popup> :
						null
				}

			</div>
		);
	}
}

export default Picking;