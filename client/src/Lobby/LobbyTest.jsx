// Wanted to save my test code in case I need it later. Copy-pasted my modified App.jsx from the commit in here

import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.css";
import important from "./assets/images/glyngeorgewithaknife.jpg";
import socket from "./sockets/SIOWebSocket";

// Test stuff
import Lobby from "./Lobby/Lobby";

const testGameData = () => {
    const size = ((Math.random()*10) % 10) + 1;

    const gameData = [];

    let i;
    for(i = 0; i < size; i++) {
        gameData.push(
            {
                hostUser: "Ayby",
                playerCount: Math.floor((Math.random()*10) % 10),
                maxPlayers: Math.floor(((Math.random()*10) % 5) + 5),
                questPicking: size % 2,
                items: ["Lady of the Lake"],
                Specials:["Mordred"],
                gameID: i
            }
        );
    }

    return gameData;
}

const doStuff = () => {
    socket.emit("yo");
};

class App extends Component {
    render() {
        return (
            <Lobby games={testGameData()}>
                AAAAAAAAAAAA
            </Lobby>
        );
    }
}

// export default hot(module)(App);