import React, { Component } from "react";
import important from "../assets/images/glyngeorgewithaknife.jpg";
import socket from "../sockets/SIOWebSocket";
import Popup from "../Popup/Popup.jsx";
import "./Kill.css"

class Kill extends Component {
	constructor(props) {
		super(props);

		//this.games = props.games;
		// The popup is a passing or fail quests menu
		this.state = { showPopup: false };
	}


	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}


	buttonRender() {
		let temp = [];
		for (var i = 0; i < this.props.usernames.length; i++) {
			temp.push(
				<div>
					<button value={this.props.usernames[i]} onClick={(e) => {
						socket.emit("kill", {
							username: e.target.value
						});
						this.togglePopup();
					}}>
						{this.props.usernames[i]}
					</button>
				</div>);
		}
		return temp
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={this.togglePopup.bind(this)}> Assassinate </button>
				</div>
				{
					this.state.showPopup ?

						<Popup closePopup={this.togglePopup.bind(this)}>
							<div>
								{this.buttonRender()}
							</div>
						</Popup> :
						null
				}
			</div>
		);
	}
}

export default Kill;