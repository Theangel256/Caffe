const { model: Model, Schema } = require('mongoose');

const model = new Model('Logs', new Schema({
  guildID: {
    type: String,
    unique: true
  },
  channel: {
    type: String,
    default: undefined
  }
}));

module.exports = model;