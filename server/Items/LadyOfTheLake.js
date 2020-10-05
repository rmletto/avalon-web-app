// Item implementation for Lady of the Lake

const Item = require("./Item");

class Lake extends Item {
	constructor(holder) {
		super(holder);
		this.name = "Lady of the Lake";
		this.usedOn = []; //array of Player objects
	}

	//@param targetPlayer is a Player Object
	//@returns alignment of targetPlayer or returns null
	use(targetPlayer) {
		for (let i = 0; i < this.usedOn.length; i++) {
			if (targetPlayer === usedOn[i]) {
				return null;
			}
		}

		//gets alignment of target player
		const alignment = targetPlayer.getCard().getAlignment();

		//Lake can not be used on somebody who has been in possession of the Lake
		this.usedOn.push(this.holder);
		return alignment; //if something jank happens checkout shallow and deep copying
	}
}

module.exports = Lake;
