/**
 * AvalonGame state machine
 */

const STATE = {
	PICKING: "Picking a Quest",
	VOTING: "Voting on a Quest",
	QUESTING: "Questing",
	ASSASSINATION: "Assassination",
	GOODS_WIN: "Goods Win!",
	EVILS_WIN: "Evils Win!",
};

class GameStateMachine {
	constructor(game) {
		// Listeners for state change
		this.listeners = [];

		this.numPlayers = game.numPlayers;

		this.game = game;
		// Tracks the number of game cycles that have happened
		this.cycles = 1;

		// Tracks whatever vote is going on, being accepto or rejecto, or
		// pass or fail in the questing phase
		this.votes = [];
		this.voteTracker = 1;
		this.setState(STATE.PICKING);

		// Array of "Pass" and "Fail" for the overall quests
		this.quests = [];
	}

	// Register a listener to the state change
	addListener(listener) {
		this.listeners.push(listener);
	}

	// @returns int
	getVoteTracker() {
		return this.voteTracker;
	}

	// Required to make the State Machine emit events, allowing us to use the Observer
	// pattern in AvalonGame such that it observes state machine changes
	setState(nextState) {
		// Deep copy the previous state
		const prevState = this.state != null ? this.state.slice(0) : STATE.PICKING;

		this.state = nextState;
		for (let i = 0; i < this.listeners.length; i++) {
			// Call all listeners
			this.listeners[i](prevState, this.state);
		}
	}

	/**
	 * Called on some form of update i.e. someone sends an accepto or rejecto,
	 * someone sends an assassination attempt, someone sends pass or fail
	 *
	 * @param obj: An object containing:
	 * 		- The Player trying to do a thing (player)
	 * 		- The thing the player is doing (event)
	 * 		- The Player's choice (choice)
	 * */
	update(obj) {
		switch (this.state) {
			case STATE.PICKING:
				this.votes = [];
				this.setState(STATE.VOTING);

				break;

			case STATE.VOTING:
				this.votes.push(obj.choice);
				var numForAccept;
				var acceptos = 0;
				if (this.votes.length === this.numPlayers) {
					/*	
						voting based off of majority rules so we do a parity check with the modulus operation. 
						So if 'x' % 2 equals anything but zero the number is odd meaning if we add 0.5 to it 
						we will get a whole number, which just so happens to be the number required for a quest
						to be accepted.
					*/
					if (this.votes.length % 2 !== 0) {
						numForAccept = this.votes.length / 2 + 0.5;
					} else {
						numForAccept = this.votes.length / 2;
					}

					// Tally votes
					for (let i = 0; i < this.votes.length; i++) {
						if (this.votes[i] === "Accepto") {
							acceptos++;
						}
					}

					if (acceptos >= numForAccept) {
						// Go to questing, vote tracker = 1
						this.voteTracker = 1;
						this.setState(STATE.QUESTING);
					}
					// If vote tracker hits 5, fail a quest and go to picking
					else if (this.voteTracker === 5) {
						// Reset vote tracker
						this.voteTracker = 1;
						this.quests.push("Fail");
						this.cycles++;
						this.setState(STATE.PICKING);
					} else {
						// Quest was not accepted. Pick a new one and increment vote tracker
						this.voteTracker++;
						this.setState(STATE.PICKING);
					}

					this.votes = [];
				}

				break;

			case STATE.QUESTING:
				// Check to see if the user already submitted a pass or fail
				this.votes.push(obj);
				var questPassCount = 0;
				var questFailCount = 0;

				if (this.votes.length === this.game.questers.length) {
					// Tally votes
					for (let i = 0; i < this.votes.length; i++) {
						if (this.votes[i].choice === "Pass") {
							questPassCount++;
						} else if (this.votes[i].choice === "Fail") {
							questFailCount++;
						}
					}
					// Quest 4 requires 2 or more fails in games with 7 players or more
					if (
						questFailCount >= 2 &&
						this.quests.length == 4 &&
						this.numPlayers >= 7
					) {
						this.quests.push("Fail");
					} else if (questFailCount >= 1) {
						this.quests.push("Fail");
					} else {
						this.quests.push("Pass");
					}

					// Check to see if either goods or evils have won yet through quest number
					let passes = 0;
					let fails = 0;

					for (let i = 0; i < this.quests.length; i++) {
						this.quests[i] == "Pass" ? passes++ : fails++;
					}

					if (passes === 3) {
						this.setState(STATE.ASSASSINATION);
					} else if (fails === 3) {
						this.setState(STATE.EVILS_WIN);
					} else {
						this.cycles++;
						this.setState(STATE.PICKING);
					}
				}

				break;

			case STATE.ASSASSINATION:
				// Find the player with the associated username
				let p = null;
				let target = obj.choice;
				for (let i = 0; i < this.game.players.length; i++) {
					if (this.game.players[i].getName() === target) {
						p = this.game.players[i];
					}
				}

				if (p.getCard().getName() === "Merlin") this.setState(STATE.EVILS_WIN);
				else {
					this.setState(STATE.GOODS_WIN);
				}

				break;

			case STATE.GOODS_WIN:
			//games over soooo.... yeah

			case STATE.EVILS_WIN:
			//gg
		}

		return this.state;
	}

	getVotes() {
		return this.votes;
	}

	getCycles() {
		return this.cycles;
	}

	getQuests() {
		return this.quests;
	}
	getVoteTracker() {
		return this.voteTracker;
	}
}

module.exports = {
	GameStateMachine,
	STATE,
};
