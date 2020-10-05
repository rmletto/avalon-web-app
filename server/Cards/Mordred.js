// Mordred card implementation

const {
	GenericEvil
} = require("./Generics");

class Mordred extends GenericEvil {
	constructor(player) {
		super(player);
		this.cardName = "Mordred";
	}
	getInfo(players) {
		// Mordred knows the same information as a generic evil
		const superInfo = super.getInfo(players);

		return {
			cardName: this.cardName,
			alignment: this.alignment,
			info: "You are Mordred, an evil that Merlin does not know the identity of.",
			infoList: superInfo.infoList,
			username: this.player.getName()
		};
	}
}

module.exports = Mordred;