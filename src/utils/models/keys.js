import { model as Model, Schema } from "mongoose";

const schema = new Schema({
  guildID: { type: String, required: true, unique: true }, // Se asegura de que sea único
  enable: { type: Boolean, required: true, default: false },
  license: { type: String, required: true, default: ""},
  time: { type: Number },
});

export default Model("keys", schema);