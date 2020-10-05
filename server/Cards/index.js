// index.js file makes importing the Cards easier for anything that needs them

const { GenericGood, GenericEvil } = require("./Generics");
const Assassin = require("./Assassin");
const Merlin = require("./Merlin");
const Mordred = require("./Mordred");

module.exports = {
	GenericGood,
	GenericEvil,
	Assassin,
	Merlin,
	Mordred
};
