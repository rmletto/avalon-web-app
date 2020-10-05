import React, { Component } from "react";
import important from "../assets/images/glyngeorgewithaknife.jpg";
import socket from "../sockets/SIOWebSocket";
import Popup from "../Popup/Popup.jsx";
import "./QuestingChoice.css"
 
class Questing extends Component {
	
	constructor(props) {
		super(props);

		//this.games = props.games;
		// The popup is a passing or fail quests menu
		this.state = { showPopup: false };
	}
	
	// Toggle the questing popup on and off
	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	//next 2 methods are temparary for questing 
	testMSGS() {
		socket.emit("questing", "Pass")
		this.setState({ showPopup: !this.state.showPopup });
	} 

	testMSGF() {
		socket.emit("questing","Fail")
		this.setState({ showPopup: !this.state.showPopup });
	} 
	
	render() {
		return (
			<div>
				<div>
					<button onClick={this.togglePopup.bind(this)}> Questing Pass/Fail </button>
				</div>
			

				{
					this.state.showPopup ?
					<Popup closePopup = {this.togglePopup.bind(this)}>
						<div className = "grid-board">
							<button onClick = {this.testMSGS.bind(this)}>
								Pass
							</button>
							<button onClick = {this.testMSGF.bind(this)}>
								Fail
							</button>
						</div>
					</Popup> :
						null
				}
			</div>
		   
		);
	}
}

export default Questing;