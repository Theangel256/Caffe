import { model as Model, Schema } from "mongoose";

const schema = new Schema({
  guildID: { type: String, required: true, unique: true }, // Se asegura de que sea único
  prefix: { type: String, default: process.env.prefix, required: true },
  language: { type: String, default: "en", required: true },
  channelLogs: { type: String, default: "" },
  channelWelcome: { type: String, default: "" },
  channelGoodbye: { type: String, default: "" },
  goodbyeBackground: { type: String, default: "" },
  welcomeBackground: { type: String, default: "" },
  roleid: { type: String, default: "" },
  rolauto: { type: String, default: "" },
  kick: { type: Boolean, default: false, required: true },
  warningKickCounter: { type: Number, default: 0 },
  ban: { type: Boolean, default: false, required: true },
  warningBanCounter: { type: Number, default: 0 },
  role: { type: Boolean, default: false, required: true },
  warningRoleCounter: { type: Number, default: 0 },
});

export default Model("guilds", schema);