const { model: Model, Schema } = require('mongoose');

const model = new Model('systemlvl', new Schema({
  guildID: { type: String, unique: true },
  userID: { type: String },
  xp: { type: Number },
  lvl: { type: Number },
}));

module.exports = model;