/**
 * Generic Good and Generic Evil Card implementation. Both included in the same
 * file because it makes importing them easier.
 * */

const Alignment = require("../Alignment");
const Card = require("./Card");

class GenericGood extends Card {
	constructor(player) {
		super(player);
		this.alignment = Alignment.GOOD;
		this.cardName = "Generic Good";
	}

	getInfo(players) {
		// Generic goods know nothing.
		return {
			cardName: this.cardName,
			alignment: this.alignment,
			info: "You are Generic Good. You are good, and that is all you know.",
			infoList: [],
			username: this.player.getName()
		};
	}
}

class GenericEvil extends Card {
	constructor(player) {
		super(player);
		this.alignment = Alignment.EVIL;
		this.cardName = "Generic Evil";
	}

	getInfo(players) {
		// Generic Evils know evils other than Oberon
		let infoList = [];
		for (let i = 0; i < players.length; i++) {
			let p = players[i];
			let c = p.getCard();
			if (
				c.getAlignment() == Alignment.EVIL &&
				c.getName() != "Oberon"
			) {
				infoList.push({
					username: p.getName(),
					alignment: c.getAlignment(),
					role: null
				});
			}
		}

		return {
			cardName: this.cardName,
			alignment: this.alignment,
			info: "You are Generic Evil. You are evil, and know your evil teammates (Oberon excluded).",
			infoList: infoList,
			username: this.player.getName()
		}
	}
}

module.exports = {
	GenericGood,
	GenericEvil
};