// Item super class JS is lame 
const Lake = require("./LadyOfTheLake");
class Item {
	constructor(holder) {
		this.name = "Set this to a string of the item";
		this.holder = holder;

	}

	getName() {
		return this.name;
	}

	getHolder() {
		return this.holder;
	}

	assignPlayer(player) {
		this.holder = player;
	}

	use(targetPlayer) {
		if (this.Item.getName() === "LadyOfTheLake") {
			const lake = this.Lake.use(targetPlayer);
			return lake;
		}
	}
}

module.exports = Item;
