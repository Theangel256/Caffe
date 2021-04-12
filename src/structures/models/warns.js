const { model: Model, Schema } = require('mongoose');

const model = new Model('warnMembers', new Schema({
	guildID: { type: String, required: true },
	userID: { type: String, required: true },
	rolID: { type: String },
	time: { type: Number },
	warnings: { type: Number },
}));

module.exports = model;