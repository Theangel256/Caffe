const { model: Model, Schema } = require('mongoose');

const model = new Model('guilds', new Schema({
	guildID: { type: String, uni1que: true },
	prefix: { type: String, default: process.env.prefix },
	channelLogs: { type: String },
	channelWelcome: { type: String },
	goodbyeBackground: { type: String },
	welcomeBackground: { type: String },
	roleid: { type: String },
	language: { type: String, default: 'en' },
	channelGoodbye: { type: String },
	kick: { type: Boolean, required: true },
	kicktime: { type: Number, default: 0 },
	ban: { type: Boolean, required: true },
	bantime: { type: Number, default: 0 },
	role: { type: Boolean, required: true },
	roletime: { type: Number, default: 0 },
}));

module.exports = model;