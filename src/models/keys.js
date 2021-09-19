const { model: Model, Schema } = require("mongoose");

const model = new Model(
  "economy",
  new Schema({
    guildID: { type: String, unique: true },
    enable: { type: Boolean, unique: true },
    license: { type: String },
    time: { type: Number },
  })
);

module.exports = model;
