import React, { Component } from "react";
import important from "../assets/images/glyngeorgewithaknife.jpg";
import socket from "../sockets/SIOWebSocket";
import Popup from "../Popup/Popup.jsx";
import "./VoteInput.css"

/*  
	for now these are the outputs of the button 
	change to after quest leader picks quest
*/
 

class Vote extends Component {
	
	constructor(props) {
		super(props);
		//this.people = this.props;
		//this.games = props.games;
		// The popup is a "Create Game" menu
		this.state = { showPopup: false };
	}

	// Toggle the "Create Game" popup on and off
	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}
	testMSGA() {
		socket.emit("picking vote", "Accepto")
		this.setState({ showPopup: !this.state.showPopup });
	} 
	testMSGR() {
		socket.emit("picking vote", "Rejecto")
		this.setState({ showPopup: !this.state.showPopup });
	} 
	render() {
		return (
			<div>
		   
			<div>
				<button onClick={this.togglePopup.bind(this)}> Vote </button>
			</div>
		   

		   {
				this.state.showPopup ?
				<Popup closePopup = {this.togglePopup.bind(this)}>
					<div className = "grid-board">
						<button onClick = {this.testMSGA.bind(this)}>
							Accepto
						</button>
						<button onClick = {this.testMSGR.bind(this)}>
							Rejecto
						</button>
					</div>
			</Popup> :
					null
			}
			</div>
		   
		);
	}
}

export default Vote;