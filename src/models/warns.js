const { model: Model, Schema } = require("mongoose");

const model = new Model(
  "warnMembers",
  new Schema({
    guildID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    warnings: { type: Number },
  })
);

module.exports = model;
