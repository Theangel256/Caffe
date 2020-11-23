const { model: Model, Schema } = require('mongoose');

const model = new Model('Prefix', new Schema({
  guildID: {
    type: String,
    unique: true
  },
  prefix: {
    type: String,
    default: process.env.prefix
  }
}));

module.exports = model;