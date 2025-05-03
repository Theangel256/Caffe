const { model: Model, Schema } = require("mongoose");

const schema = new Schema({
  guildID: { type: String, required: true, unique: true }, // Se asegura de que sea único
  prefix: { type: String, default: process.env.prefix, required: true },
  channelLogs: { type: String },
  channelWelcome: { type: String },
  goodbyeBackground: { type: String },
  welcomeBackground: { type: String },
  roleid: { type: String },
  rolauto: { type: String },
  language: { type: String, default: "en", required: true },
  channelGoodbye: { type: String },
  kick: { type: Boolean, default: false, required: true },
  warningKickCounter: { type: Number, default: 0 },
  ban: { type: Boolean, default: false, required: true },
  warningBanCounter: { type: Number, default: 0 },
  role: { type: Boolean, default: false, required: true },
  warningRoleCounter: { type: Number, default: 0 },
});

module.exports = Model("guilds", schema);
