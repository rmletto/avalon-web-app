import React, { Component } from "react";

import "./GameListing.css";

import { Redirect } from "react-router-dom";
import socket from "../sockets/SIOWebSocket";

/*
required info for a gameInfo object in this context:
{
    hostUser,
    playerCount,
    maxPlayers,
    gameID
}
*/

class GameListing extends Component {
    // Handle clicking the "Join Game" button
    handleClick() {
        if(this.props.gameInfo.playerCount == this.props.gameInfo.numPlayers) {
            alert("Cannot join full game");
            return;
        }

        let username = "";
        while(username == "") {
            username = prompt("Please provide a username:", username);
        }

        if(username !== null) {
            socket.emit("join game", {
                gameID: this.props.gameInfo.gameID,
                username: username
            });

            this.props.joinGame();
        }
    }

    render() {
        return (
            <div id={this.id} className='listingOuter'>
                <div className='listingTable'>
                    <div className='listingTitle'>
                        {this.props.gameInfo.hostUser}'s Game
                    </div>
                    <div className='listingCount'>
                        {this.props.gameInfo.playerCount} / {this.props.gameInfo.numPlayers} Players
                    </div>
                    <button className='joinButton' onClick={this.handleClick.bind(this)}>
                        Join Game
                    </button>
                </div>
            </div>
        )
    }
}

export default GameListing;
