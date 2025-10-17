const { model: Model, Schema } = require("mongoose");

const schema = new Schema({
  guildID: { type: String, required: true, unique: true }, // Se asegura de que sea único
  enable: { type: Boolean, required: true },
  license: { type: String },
  time: { type: Number },
});

module.exports = Model("keys", schema);
