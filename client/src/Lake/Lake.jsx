import React, { Component } from "react";
import socket from "../sockets";
import important from "../assets/images/glyngeorgewithaknife.jpg";
import Popup from "../Popup/Popup.jsx";
import "./Lake.css";

class LadyOfTheLake extends Component {
	constructor(props) {
		super(props);

		this.state = { showPopup: false };
	}

	togglePopup() {
		this.setState({ showPopup: !this.state.showPopup });
	}

	lakeButtonRender() {
		let temp = [];

		for (var i = 0; i < this.props.usernames.length; i++) {
			let u = this.props.usernames[i];
			temp.push(
				<div key={i}>
					<button
						onClick={() => {
							socket.emit("lake", u);
							this.togglePopup();
						}}
					>
						{this.props.usernames[i]}
					</button>
				</div>
			);
		}
		return temp;
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={this.togglePopup.bind(this)}> Lake </button>
				</div>
				{this.state.showPopup ? (
					<Popup closePopup={this.togglePopup.bind(this)}>
						<div>{this.lakeButtonRender()}</div>
					</Popup>
				) : null}
			</div>
		);
	}
}

export default LadyOfTheLake;
