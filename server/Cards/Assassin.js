// Assassin card implementation

const Alignment = require("../Alignment");

const {
	GenericEvil
} = require("./Generics");

class Assassin extends GenericEvil {
	constructor(player) {
		super(player);
		this.cardName = "Assassin";
	}
	getInfo(players) {
		// Assassin knows the same information as a generic evil
		const superInfo = super.getInfo(players);

		return {
			cardName: this.cardName,
			alignment: this.alignment,
			info: "You are the Assassin. You are evil, and know your evil teammates (Oberon excluded). " +
				"At the end of the game, you can attempt to assassinate an important player (Merlin or " +
				"Gallahad) to steal the win from the good team.",
			infoList: superInfo.infoList,
			username: this.player.getName()
		}
	}
}

module.exports = Assassin;