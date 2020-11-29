const { model: Model, Schema } = require('mongoose');

const model = new Model('guild', new Schema({
  guildID: { type: String, unique: true },
  prefix: { type: String, default: process.env.prefix },
  channelLogs: { type: String },
  channelWelcome: { type: String, },
  language: { type: String, default: "en" },  
  channelGoodbye: { type: String, },
  role: { type: String },
}));

module.exports = model;