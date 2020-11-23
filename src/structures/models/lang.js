const { model: Model, Schema } = require('mongoose');

const model = new Model('Lang', new Schema({
  guildID: {
    type: String,
    unique: true
  },
  language: {
    type: String,
    default: "en"
  }
}));

module.exports = model;