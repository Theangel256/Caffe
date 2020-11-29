const { model: Model, Schema } = require('mongoose');

const model = new Model('systemeconomy', new Schema({
  guildID: { type: String, unique: true },
  userID: { type: String },
  daily: { type: Number },
  money: { type: Number, default: 200 },
  banco: { type: String, default: "BBVA" }
}));

module.exports = model;