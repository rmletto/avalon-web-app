// Card abstract class because interfaces don't exist

class Card {
	constructor(player) {
		this.alignment = "Set this appropriately";
		this.cardName = "Set this appropriately";
		this.player = player;
	}

	// Given a list of all players with their assigned cards, determine
	// what information should be sent to the client playing this card.
	getInfo(players) {
		throw new TypeError("Card.getInfo called. Please overwrite the method.");
	}

	getName() {
		return this.cardName;
	}

	getAlignment() {
		return this.alignment;
	}
}

module.exports = Card;
