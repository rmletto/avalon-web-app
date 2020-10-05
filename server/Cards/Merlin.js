// Merlin card implementation

const Alignment = require("../Alignment");
const {
	GenericGood
} = require("./Generics");

class Merlin extends GenericGood {
	constructor(player) {
		super(player);
		this.cardName = "Merlin";
	}

	getInfo(players) {
		// Merlin knows all evils, other than Mordred
		let infoList = [];
		for (let i = 0; i < players.length; i++) {
			let p = players[i];
			let c = p.getCard();
			if (
				c.getAlignment() == Alignment.EVIL &&
				c.getName() != "Mordred"
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
			info: "You are Merlin. You know who most of the evils are, " +
				"but you do not know who Mordred is. Be careful though, " +
				"if the Assassin finds out who you are, Goods lose the game!",
			infoList: infoList,
			username: this.player.getName()
		};
	}
}

module.exports = Merlin;