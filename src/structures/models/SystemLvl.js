const { model: Model, Schema } = require('mongoose');

const model = new Model('systemlvl', new Schema({
  guildID: { type: String },
  userID: { type: String },
  xp: { type: Number },
  lvl: { type: Number, default: 1 },
}));

module.exports = model;