/**
 * AvalonGame class
 */
const Player = require("./Player");
const { Lake } = require('./Items');
const Alignment = require("./Alignment");
const { GameStateMachine, STATE } = require("./GameStateMachine");

class AvalonGame {
	// -------------------------------------------------------------------------------------------
	// Important Setup Stuff
	// -------------------------------------------------------------------------------------------
	constructor(gameInfo, gameMasterSocket, gameMasterUsername, id, garbageCollector) {
		// ---------------------------------------------------------------------------------------
		// Game Listing Information
		// ---------------------------------------------------------------------------------------
		this.players = [];
		this.id = id;
		this.started = false;
		this.hostUser = this.addPlayerToGame(gameMasterSocket, gameMasterUsername);
		this.numPlayers = gameInfo.numPlayers;
		this.questPicking = gameInfo.questPicking;

		// ---------------------------------------------------------------------------------------
		// Other stuff coming in from gameInfo
		// ---------------------------------------------------------------------------------------
		this.specials = gameInfo.specials;
		this.itemNames = gameInfo.items;
		// ---------------------------------------------------------------------------------------
		// Initialize Game objects
		// ---------------------------------------------------------------------------------------

		// Create a new state machine for the game
		this.stateMachine = new GameStateMachine(this);
		this.stateMachine.addListener(this.gameStateListener.bind(this));

		this.items = [];

		// Used during the questing phase of the game: an array of username strings
		this.questers = [];

		// Initially set quest leader to host user
		this.questLeader = this.hostUser;
		this.questLeaderIdx = 0;

		// ---------------------------------------------------------------------------------------
		// WebSockets communications required on construction
		// ---------------------------------------------------------------------------------------

		// Give the host user the ability to start the game
		this.hostUser.getSocket().on("start game", () => {
			if (
				// Check for number of players
				this.players.length < this.numPlayers ||
				// Check that the game is not already started
				this.started
			) {
				this.hostUser
					.getSocket()
					.emit(
						"cant start",
						`The minumum number of players (${this.numPlayers}) has not been met or game is ongoing.`
					);
			} else {
				this.startGame();
			}
		});

		// Give the host user appropriate UI update info
		this.hostUser.getSocket().emit("joined game", this.getListingInfo());

		// Tell the host it's the game master
		this.hostUser.getSocket().emit("game master");

		// ---------------------------------------------------------------------------------------
		// Misc.
		// ---------------------------------------------------------------------------------------

		// TODO: Implement sending chat history to users in the future
		this.chatHistory = [];

		this.garbageCollector = garbageCollector;
	}

	/**
	 * @return the Player if player was sucessfully added to the game, null othewrwise
	 * @modifies Adds the new player to this.players. It also returns it. It will never
	 * 		add a null value to this.players
	 * */
	addPlayerToGame(socket, username) {
		let success = true;
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];

			if (
				// Check that the player has not been added to the game already
				player.getSocket().id == socket.id ||
				// Check that the username has not been used in this game yet
				player.getName() == username
			) {
				success = false;
				console.error(
					`ERROR: Socket ID ${socket.id} ` +
					`or user ${username} already in game ${this.id}`
				);
				break;
			}
		}

		// Check for max players
		if (success && this.players.length + 1 > this.numPlayers) {
			success = false;
			console.error(`ERROR: max players in game ${this.id}`);
		}

		// Add the player if all previous checks passed
		if (success) {
			const newPlayer = new Player(socket, username);
			this.players.push(newPlayer);

			// If the player disconnects before the game has started, remove them from the player list
			newPlayer.getSocket().on('disconnect', (reason) => {
				// TODO: Something with this console.log when reconnection is implemented
				console.log(`User ${newPlayer.getName()} has disconnected from game ${this.id}. Reason: ${reason}`);
				if (this.started === false) {
					// Find the player and remove them
					for (let i = 0; i < this.players.length; i++) {
						if (this.players[i] == newPlayer) {
							let check = this.players.splice(i, 1);
							// Splice should return the value it removes, so if it doesn't exist, JavaScript is being stupid
							if (!check) {
								throw new TypeError("JavaScript is dumb");
							}
							// Close the player's socket connection
							newPlayer.getSocket().disconnect(true);

							// Run GameServer's garbage collector listener
							this.garbageCollector(this);
							break;
						}
					}

					this.sendPlayers("joined game", this.getListingInfo());
				} else {
					// TODO: Set up reconnecting them to the game
				}
			});

			if (this.hostUser != null && this.started == false) {
				// Inform connected players of new player joining
				this.sendChatMsg(`${username} has joined the game!`);

				// Give all players the listing information to update UI and
				// indicate that a new player has joined
				this.sendPlayers("joined game", this.getListingInfo());
			}

			return newPlayer;
		} else {
			return null;
		}
	}

	// Do all of the setup required to start a game
	startGame() {
		// ---------------------------------------------------------------------------------------
		// Deal Cards
		// ---------------------------------------------------------------------------------------
		let obj = {
			goods: 0, // Number of good cards assigned
			evils: 0, // Number of evil cards assigned
			deck: this.specials, // Deck of cards to assign
			start: 0, // Starting player for dealCards
		};
		// Assign special cards first
		obj = this.dealCards(obj);

		// Determine how many generic cards have to be added
		const totalSpecials = obj.goods + obj.evils;
		obj.deck = [];
		if (this.numPlayers == 5 || this.numPlayers == 6) {
			// There should be 2 evils total in the game. Add evils until we are at 2
			for (
				let i = obj.evils;
				i < 2 && totalSpecials + obj.deck.length < this.numPlayers;
				i++
			) {
				obj.deck.push("Generic Evil");
			}
		} else if (this.numPlayers >= 7 || this.numPlayers <= 9) {
			// There should be 3 evils total in the game
			for (
				let i = obj.evils;
				i < 3 && totalSpecials + obj.deck.length < this.numPlayers;
				i++
			) {
				obj.deck.push("Generic Evil");
			}
		} else if (this.numPlayers == 10) {
			// There should be 4 evils total in the game
			for (
				let i = obj.evils;
				i < 4 && totalSpecials + obj.deck.length < this.numPlayers;
				i++
			) {
				obj.deck.push("Generic Evil");
			}
		}

		// Fill the rest of the deck with Generic Goods
		while (obj.deck.length + totalSpecials < this.numPlayers) {
			obj.deck.push("Generic Good");
		}

		// Deal out the generic cards
		this.dealCards(obj);

		// Send each player in the game individually their card information
		for (let i = 0; i < this.players.length; i++) {
			let p = this.players[i];
			p.getSocket().emit("card info", p.getCard().getInfo(this.players));
		}

		// ---------------------------------------------------------------------------------------
		// Item setup
		// ---------------------------------------------------------------------------------------

		// Assigns the items to players
		for (let i = 0; i < this.itemNames.length; i++) {
			if (this.itemNames == "Lady of the Lake") {
				let lake = new Lake(this.players[this.players.length - 1]);
				this.items.push(lake);
			}
		}

		// ---------------------------------------------------------------------------------------
		// WebSockets stuff
		// ---------------------------------------------------------------------------------------

		// Register the appropriate WebSocket listeners for the picking phase initially
		this.pickingListeners();

		// Start the game!
		this.started = true;
		this.updatePlayerStates(STATE.PICKING);
		// Tell everyone who the quest leader is
		this.sendChatMsg(
			`The current quest leader is ${this.questLeader.getName()}.`
		);
	}

	/**
	 * Deal out the roles, keeping track of how many goods and evils have
	 * been dealt out
	 *
	 * @return the modified object coming in. I would do pass by reference,
	 * 		but JavaScript is dumb and won't let me
	 * */
	dealCards(obj) {
		let { deck, goods, evils, start } = obj;
		// Iterate through each player, starting from the "start" player
		while (
			// Go until we run out of cards
			start < this.players.length &&
			deck.length > 0
		) {
			// Pick a random card index
			let cardIdx = Math.floor(Math.random() * deck.length);

			// Give the player the random card
			this.players[start].assignCard(deck[cardIdx]);

			// Delete the card from the list of cards
			deck.splice(cardIdx, 1);

			// Update whether or not the card was good or evil
			this.players[start].getCard().getAlignment() === Alignment.GOOD
				? goods++
				: evils++;

			start++;
		}

		return {
			deck: deck,
			goods: goods,
			evils: evils,
			start: start,
		};
	}

	// -------------------------------------------------------------------------------------------
	// Game Communications via Listeners and WebSocket Event "State Machine"
	// -------------------------------------------------------------------------------------------

	// Register picking phase listeners
	pickingListeners() {
		// Initially, the only one who can fire an event is the quest leader.
		// Only accept one event
		this.questLeader.getSocket().once("quest pick", (usernames) => {
			this.stateMachine.update({
				player: this.questLeader,
				event: "quest pick",
				choice: usernames,
			});
			let userMsg = "";
			for (let i = 0; i < usernames.length; i++) {
				userMsg += usernames[i];
				if (i != usernames.length - 1) {
					userMsg += " and ";
				}
			}
			this.sendChatMsg(
				`User ${this.questLeader.getName()} wants ${userMsg} to go on the quest.`
			);
			this.sendPlayers("quest choice", usernames);

			this.questers = usernames;
		});
	}

	// Register voting phase listeners
	votingListeners() {
		// Register all players for voting
		for (let i = 0; i < this.players.length; i++) {
			let p = this.players[i];
			// Register the player for the picking event (i.e. listen for their vote).
			// Only accept one vote.
			p.getSocket().once("picking vote", (vote) => {
				// Tell the state machine what their vote is
				this.stateMachine.update({
					player: p,
					event: "picking vote",
					choice: vote,
				});

				this.sendChatMsg(`User ${p.getName()} has voted.`);
			});
		}
	}

	// Register questing listeners
	questingListeners() {
		// Register the players on the quest for passing or failing
		for (let i = 0; i < this.questers.length; i++) {
			let p = null;

			// Find the player with the corresponding username
			for (let j = 0; j < this.players.length; j++) {
				if (this.players[j].getName() == this.questers[i]) {
					p = this.players[j];
					break;
				}
			}

			// Only accept one pass or fail
			p.getSocket().once("questing", (result) => {
				this.stateMachine.update({
					player: p,
					event: "questing",
					choice: result,
				});
			});
		}
	}

	// Register assassination listeners
	assassinationListeners() {
		// Find the Assassin, register the "kill" event for it
		for (let i = 0; i < this.players.length; i++) {
			let p = this.players[i];
			if (p.getCard().getName() === "Assassin") {
				// Only accept 1
				p.getSocket().once("kill", ({ username }) => {
					this.stateMachine.update({
						player: p,
						event: "kill",
						choice: username,
					});
				});
			}
		}
	}

	//Register lady of the lake listeners
	lakeListeners() {
		let p = this.players;
		for (let i = 0; i < this.players.length; i++) {
			if (p[i] === this.items[0].getHolder()) {
				//lake is the only item right now
				p[i].getSocket().once("lake", (username) => {
					for (let j = 0; j < this.players.length; j++) {
						if (p[j].getName() === username) {
							let alignmentOfUsername = this.items[0].use(p[j]);
							p[i].getSocket().emit("lake", `${p[j].getName()} is ${alignmentOfUsername}.`);
						}
					}

					for (let i = 0; i < this.players.length; i++) {
						if (username === p[i].getName()) {
							this.items[0].assignPlayer(p[i]);
							this.sendChatMsg(`User ${p[i].getName()} is now in possession of Lake`);
							break;
						}
					}
				});
			}
		}

	}

	// Register appropriate WebSocket events based on previous state and next state.
	// Also, do any other WebSocket events required
	gameStateListener(prevState, nextState) {
		if (nextState === prevState) {
			// Do nothing
			return;
		}

		switch (nextState) {
			case STATE.PICKING:
				// Set next quest leader
				const nextLeaderIdx = (this.questLeaderIdx + 1) % this.players.length;
				this.questLeader = this.players[nextLeaderIdx];
				this.questLeaderIdx = nextLeaderIdx;

				this.sendChatMsg(
					`The current quest leader is ${this.questLeader.getName()}.`
				);

				// See if clients have to be updated on a quest's pass/fail results
				if (prevState === STATE.QUESTING) {
					const passFailResults = this.stateMachine.getVotes();
					let numFails = 0;
					let numPasses = 0;
					for (let i = 0; i < passFailResults.length; i++) {
						let pOrF = passFailResults[i].choice;
						if (pOrF === "Pass") {
							numPasses++;
						} else if (pOrF === "Fail") {
							numFails++;
						}
					}

					if (
						this.stateMachine.getQuests().length >= 3 && //can lake after second quest testing
						this.stateMachine.getVoteTracker() === 1 //so lake can only be used once per quest
					) {
						this.lakeListeners();
					}

					const questResults = this.stateMachine.getQuests();
					const lastQuestIdx = questResults.length - 1;
					const lastQuestResult = questResults[lastQuestIdx];

					this.sendChatMsg(
						`Quest ${lastQuestIdx + 1} ${lastQuestResult}ed with ` +
						`${numFails} fails and ${numPasses} passes.`
					);
				}

				// Listen for the quest leader's choice
				this.pickingListeners();
				break;

			case STATE.VOTING:
				// When transitioning to voting stage, register voting listeners
				this.votingListeners();
				break;

			case STATE.QUESTING:
				// Listen for the questers' passes or fails
				this.questingListeners();
				break;

			case STATE.ASSASSINATION:
				// Listen for the Assassin's kill
				this.assassinationListeners();
				break;

			// The only case this should be is a winning case
			default:
				this.sendChatMsg(nextState);
				this.started = false;
				break;
		}

		// Inform all clients of the updated state
		this.updatePlayerStates(nextState);
	}

	// -------------------------------------------------------------------------------------------
	// Getters, Setters and General Communication Methods
	// -------------------------------------------------------------------------------------------

	/**
	 * Send all Players in the game the same event and possibly
	 * some same piece of data via their WebSockets
	 */
	sendPlayers(event, data) {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].getSocket().emit(event, data);
		}
	}

	// Send all players in game a chat message
	sendChatMsg(msg) {
		this.chatHistory.push(msg);
		this.sendPlayers("chat message", msg);
	}

	updatePlayerStates(nextState) {
		this.sendPlayers("game state update", {
			newState: nextState,
			voteTracker: this.stateMachine.getVoteTracker(),
			quests: this.stateMachine.getQuests(),
			questLeader: this.questLeader.getName(),
		});
	}

	getListingInfo() {
		let usernames = [];
		for (const p of this.players) {
			usernames.push(p.getName());
		}

		return {
			hostUser: this.hostUser.getName(),
			playerCount: this.players.length,
			numPlayers: this.numPlayers,
			questPicking: this.questPicking,
			gameID: this.id,
			usernames: usernames,
		};
	}

	getID() {
		return this.id;
	}

	getPlayers() {
		return this.players;
	}
}

module.exports = AvalonGame;
