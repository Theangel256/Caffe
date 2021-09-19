const { model: Model, Schema } = require("mongoose");

const model = new Model(
  "users",
  new Schema({
    userID: { type: String, unique: true },
    marryTag: { type: String },
    marryId: { type: String },
    daily: { type: Number },
    money: { type: Number, default: 200 },
  })
);

module.exports = model;
