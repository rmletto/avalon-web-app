const http = require("http");
const io = require("socket.io");

const AvalonGame = require("./AvalonGame");

/**
 * Main GameServer class. New WebSocket connections come in here
 */
class GameServer {
	constructor(port) {
		this.httpServer = http.createServer();
		this.httpServer.listen(port);

		this.socketsServer = io(this.httpServer, {
			pingTimeout: 60000,		// 1 minute ping timeout
			pingInterval: 300000	// Ping every 5 minutes
		});

		// This stores the current ongoing games
		this.games = [];
		// This stores the number of games the server has had during this run.
		// Done to avoid gameID duplication.
		this.numGames = 0;

		// When a socket connects, register the appropriate events here
		this.socketsServer.on("connection", (socket) => {
			socket.on("create game", ({
				gameInfo,
				username
			}) => {
				this.createGame(gameInfo, socket, username)
			});

			socket.on("join game", ({
				gameID,
				username
			}) => {
				this.joinGame(socket, gameID, username);
			});

			socket.emit("games", this.getListingsInfo());
		});
	}

	// This is the GameServer's "Garbage Collector." When games contain 0 players,
	// it will remove them from this.games. Hopefully, JavaScript cleans it up someday...
	gcListener(game) {
		for (let i = 0; i < this.games.length; i++) {
			let found = false;
			if (this.games[i] === game && game.getListingInfo().numPlayers === 0) {
				this.games.splice(i, 1);
				found = true;
			}

			if (found) {
				break;
			}
		}

		// Inform connected clients
		this.socketsServer.emit("games", this.getListingsInfo());
	}

	createGame(gameInfo, gameMasterSocket, username) {
		const id = this.numGames;
		const newGame = new AvalonGame(gameInfo, gameMasterSocket, username, id, this.gcListener.bind(this));
		// Error handling just in case the game doesn't build properly
		if (newGame != null) {
			this.games.push(newGame);
			this.numGames++;

			// Inform all connected clients of the updated game
			this.socketsServer.emit("games", this.getListingsInfo());
		}
	}

	// Get an array of game listing information for all games currently on the server
	getListingsInfo() {
		let a = [];
		for (let i = 0; i < this.games.length; i++) {
			a.push(this.games[i].getListingInfo());
		}
		return a;
	}

	joinGame(socket, gameID, username) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].getID() == gameID) {
				// See if the player was succesfully added
				const p = this.games[i].addPlayerToGame(socket, username);
				if (p !== null) {
					// Inform all connected clients of the updated game
					this.socketsServer.emit("games", this.getListingsInfo());

					return true;
				}
				return false;
			}
		}
		return false;
	}
}

module.exports = GameServer;