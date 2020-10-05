// Player Class for Server

const Cards = require("./Cards");

class Player {
	constructor(socket, username) {
		this.socket = socket;
		this.username = username;
	}

	getSocket() {
		return this.socket;
	}

	// Don't think there's another way to do this unfortunately. We need the
	// Strategy implementation to get this to work so this needs to be somewhere.
	// Might as well throw it here.
	assignCard(cardName) {
		if(this.card != null) {
			console.error(`Player ${this.username} already has a card!`);
		}
		switch(cardName) {
			case "Mordred":
				this.card = new Cards.Mordred(this);
				break;
			case "Merlin":
				this.card = new Cards.Merlin(this);
				break;
			case "Assassin":
				this.card = new Cards.Assassin(this);
				break;
			case "Generic Good":
				this.card = new Cards.GenericGood(this);
				break;
			case "Generic Evil":
				this.card = new Cards.GenericEvil(this);
				break;
		}
	}

	getCard() {
		return this.card;
	}

	getName() {
		return this.username;
	}
}

module.exports = Player;