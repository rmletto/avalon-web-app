/**
 * Chat component, currently only receives information from the server
 */

import socket from "../sockets";

import React, { Component } from 'react';

class Chat extends Component {
	generateMessages() {
		let a = [];
		let i = 0;
		for(const msg of this.props.msgs) {
			a.push(<div key={i}>{msg}</div>)
			i++;
		}

		return a;
	}

	render() {
		return (
			<div>
				{this.generateMessages()}
			</div>
		);
	}
}

export default Chat;
