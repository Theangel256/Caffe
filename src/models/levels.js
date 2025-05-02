const { model: Model, Schema } = require("mongoose");

const schema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  xp: { type: Number, default: 1 },
  lvl: { type: Number, default: 1 },
});

// Índice único compuesto para evitar duplicados de userID por guildID
schema.index({ guildID: 1, userID: 1 }, { unique: true });

module.exports = Model("systemlvl", schema);
